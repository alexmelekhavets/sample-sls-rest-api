import * as Joi from "joi";

import { SchemasType } from "./Validator";

const schemas: SchemasType = new Map();

// Device Controller

schemas.set("getDevices", {
  type: "queryStringParameters",
  responseSchema: Joi.array().items({
    deviceID: Joi.number().positive().required(),
    name: Joi.string().required(),
    model: Joi.string().required(),
    brand: Joi.string().required(),
  }),
});

schemas.set("getDevice", {
  type: "pathParameters",
  requestSchema: {
    deviceID: Joi.number().positive().required(),
  },
  responseSchema: {
    name: Joi.string().required(),
    model: Joi.string().required(),
    brand: Joi.string().required(),
  },
});

schemas.set("postDevice", {
  type: "body",
  requestSchema: {
    deviceID: Joi.number().positive().required(),
    name: Joi.string().required(),
    model: Joi.string().required(),
    brand: Joi.string().required(),
  },
});

// Data Controller

schemas.set("getDeviceData", {
  type: "pathParameters",
  requestSchema: {
    deviceID: Joi.number().positive().required(),
  },
  responseSchema: Joi.array().items({
    timestamp: Joi.string().isoDate().required(),
    value: Joi.number().required(),
  }),
});

schemas.set("postData", {
  type: "body",
  requestSchema: Joi.array().items({
    deviceID: Joi.number().positive().required(),
    timestamp: Joi.string().isoDate().required(),
    value: Joi.number().required(),
  }),
});

export default schemas;
