import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

interface VPCStackProps extends cdk.StackProps {
  vpcCidr: string;
}

export class VPCStack extends cdk.Stack {
  private _vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props: VPCStackProps) {
    super(scope, id, props);

    this._vpc = new ec2.Vpc(this, "VPC", {
      cidr: props.vpcCidr,
      natGateways: 1,
      maxAzs: 3,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 24,
          name: "Private",
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
          name: "Public",
        },
      ],
    });

    new cdk.CfnOutput(this, "vpc:vpcId", {
      value: this._vpc.vpcId,
    });

    this._vpc.privateSubnets.map((privateSubnet, index) => {
      new cdk.CfnOutput(this, `PrivateSubnet${index + 1}Output`, {
        value: privateSubnet.subnetId,
        exportName: `vpc:privateSubnet${index + 1}`,
      });
    });
  }

  get vpc(): ec2.Vpc {
    return this._vpc;
  }
}
