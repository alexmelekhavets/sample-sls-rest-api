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
      MONGODB_URI: "specify-your-mongo-db-uri",
      MONGODB_DB: "iot-app",
    },
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
};

module.exports = serverlessConfiguration;
