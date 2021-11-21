import * as cdk from "@aws-cdk/core";
import * as docdb from "@aws-cdk/aws-docdb";
import * as ec2 from "@aws-cdk/aws-ec2";

interface DocDBStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  vpcCidr: string;
  dbClusterName: string;
  dbInstanceName: string;
  dbUsername: string;
  dbPassword: string;
  dbPort: number;
}

export class DocdbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: DocDBStackProps) {
    super(scope, id, props);

    const docDBSG = new ec2.SecurityGroup(this, "docdb-sg", {
      vpc: props.vpc,
      description:
        "Allow tcp access using specified port to DocumentDB instance",
    });

    const lambdaToDocDBSG = new ec2.SecurityGroup(this, "lambda-to-docdb-sg", {
      vpc: props.vpc,
      description: "Allow Lambda connect to DocumentDB instance",
      allowAllOutbound: false,
    });

    const subnetGroup = new docdb.CfnDBSubnetGroup(this, "docdb-subnet-group", {
      subnetIds: props.vpc.privateSubnets.map((x) => x.subnetId),
      dbSubnetGroupDescription: "Subnet Group for DocDB",
      dbSubnetGroupName: "docdb-subnet-group",
    });

    const dbCluster = new docdb.CfnDBCluster(this, "db-cluster", {
      storageEncrypted: true,
      availabilityZones: props.vpc.availabilityZones.splice(3),
      dbClusterIdentifier: props.dbClusterName,
      masterUsername: props.dbUsername,
      masterUserPassword: props.dbPassword,
      vpcSecurityGroupIds: [docDBSG.securityGroupId],
      dbSubnetGroupName: subnetGroup.dbSubnetGroupName,
      port: props.dbPort,
    });
    dbCluster.addDependsOn(subnetGroup);

    const dbInstance = new docdb.CfnDBInstance(this, "db-instance", {
      dbClusterIdentifier: dbCluster.ref,
      autoMinorVersionUpgrade: true,
      dbInstanceClass: "db.t3.medium",
      dbInstanceIdentifier: props.dbInstanceName,
    });
    dbInstance.addDependsOn(dbCluster);

    lambdaToDocDBSG.connections.allowTo(docDBSG, ec2.Port.tcp(props.dbPort));

    docDBSG.addIngressRule(
      ec2.Peer.ipv4(props.vpcCidr),
      ec2.Port.tcp(props.dbPort)
    );

    docDBSG.connections.allowFrom(lambdaToDocDBSG, ec2.Port.tcp(props.dbPort));

    new cdk.CfnOutput(this, "DocDbSGOutput", {
      value: docDBSG.securityGroupId,
      exportName: "docdb:DocDbSubnetGroup:securityGroupId",
    });

    new cdk.CfnOutput(this, "LambdaSGOutput", {
      value: lambdaToDocDBSG.securityGroupId,
      exportName: "docdb:LambdaToDocDbSecurityGroup:securityGroupId",
    });
  }
}
