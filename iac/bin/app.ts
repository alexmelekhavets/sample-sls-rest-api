#!/usr/bin/env node
import "source-map-support/register";

import * as cdk from "@aws-cdk/core";
import { config } from "dotenv";
config();

import { DocdbStack } from "../lib/DocdbStack";
import { VPCStack } from "../lib/VPCStack";
import { StackProps } from "@aws-cdk/core";

const env: cdk.Environment = {
  region: process.env.AWS_REGION,
  account: process.env.AWS_ACCOUNT_ID,
};

export interface DefaultStackProps extends StackProps {
  vpcCidr: string;
}

const defaultProps: DefaultStackProps = {
  env,
  vpcCidr: process.env.VPC_CIDR as string,
};

const app = new cdk.App({});

const vpcStack = new VPCStack(app, "VPCStack", {
  ...defaultProps,
});

new DocdbStack(app, "DocdbStack", {
  ...defaultProps,
  vpc: vpcStack.vpc,
  dbClusterName: process.env.DB_CLUSTER_NAME as string,
  dbInstanceName: process.env.DB_INSTANCE_NAME as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbPort: parseInt(process.env.DB_PORT as string),
});
