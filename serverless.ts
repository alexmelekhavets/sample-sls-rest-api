import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "iot-api",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      MONGODB_URI: "specify-your-document-db-uri",
      MONGODB_DB: "iot-app",
    },
    vpc: {
      securityGroupIds: [
        {
          "Fn::ImportValue": "docdb:LambdaToDocDbSecurityGroup:securityGroupId",
        },
      ],
      subnetIds: [
        {
          "Fn::ImportValue": "vpc:privateSubnet1",
        },
        {
          "Fn::ImportValue": "vpc:privateSubnet2",
        },
        {
          "Fn::ImportValue": "vpc:privateSubnet3",
        },
      ],
    },
    timeout: 15,
  },
  functions: {
    getDevices: {
      handler: "src/controllers/DeviceController.getDevices",
      events: [
        {
          http: {
            method: "get",
            path: "/devices",
          },
        },
      ],
    },
    getDevice: {
      handler: "src/controllers/DeviceController.getDevice",
      events: [
        {
          http: {
            method: "get",
            path: "/devices/{deviceID}",
          },
        },
      ],
    },
    postDevice: {
      handler: "src/controllers/DeviceController.postDevice",
      events: [
        {
          http: {
            method: "post",
            path: "/devices",
            authorizer: {
              type: "COGNITO_USER_POOLS",
              authorizerId: {
                Ref: "ApiGatewayAuthorizer",
              },
            },
          },
        },
      ],
    },
    getDeviceData: {
      handler: "src/controllers/DataController.getDeviceData",
      events: [
        {
          http: {
            method: "get",
            path: "/data/{deviceID}",
          },
        },
      ],
    },
    postData: {
      handler: "src/controllers/DataController.postData",
      events: [
        {
          http: {
            method: "post",
            path: "/data",
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      CognitoUserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "iot-api-user-pool",
          UsernameAttributes: ["email"],
          AutoVerifiedAttributes: ["email"],
        },
      },
      CognitoUserPoolClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "iot-api-user-pool-client",
          UserPoolId: {
            Ref: "CognitoUserPool",
          },
          ExplicitAuthFlows: ["ADMIN_NO_SRP_AUTH"],
          GenerateSecret: false,
        },
      },
      ApiGatewayAuthorizer: {
        Type: "AWS::ApiGateway::Authorizer",
        Properties: {
          Name: "iot-app-apigateway-authorizer",
          IdentitySource: "method.request.header.Authorization",
          Type: "COGNITO_USER_POOLS",
          RestApiId: { Ref: "ApiGatewayRestApi" },
          ProviderARNs: [{ "Fn::GetAtt": ["CognitoUserPool", "Arn"] }],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
