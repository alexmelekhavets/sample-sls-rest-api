# Sample of Node.JS REST API using The Serverless Framework

The project uses Serverless Framework with the `aws-nodejs-typescript` boilerplate (see [all boilerplates](https://www.serverless.com/framework/docs/providers/aws/guide/services#creation))

This package aims to give you an idea of building a simple REST API with AWS services API Gateway and AWS Lambda. It doesn't require an AWS account. You can try things locally. Anyway, there is a minor prerequisite: you need the MongoDB database to make it a bit real. The project operates two entities, such as devices and their data. Just a few routes are created for both entities (see the service `serverless.ts` file and controllers) to keep it simple.

## Local development

### Prerequisites

Specify the environment variables of MongoDB in `serverless.ts`: `MONGODB_URI` and `MONGODB_DB`.
To play with Mongo, I prefer shared clusters you can create for free at https://www.mongodb.com/.

```
npm ci
```

### Running locally

```
sls offline
```

After that you'll face the following endpoints:

```
GET  | http://localhost:3000/dev/devices                                      │
GET  | http://localhost:3000/dev/devices/{deviceID}                           │
POST | http://localhost:3000/dev/devices                                      │
GET  | http://localhost:3000/dev/data/{deviceID}                              │
POST | http://localhost:3000/dev/data                                         |
```

Example of requests:

```
// Getting the list of all devices
curl http://localhost:3000/dev/devices

// Creating a new device
curl -X POST http://localhost:3000/dev/devices \
-H 'Content-Type: application/json' \
-d '{"deviceID":1001,"name":"New Device","model":"New Model","brand":"Noname"}'

// Getting data of a given device
curl http://localhost:3000/dev/data/1001

// Creating a new device
curl -X POST http://localhost:3000/dev/data \
-H 'Content-Type: application/json' \
-d '[{"deviceID":1001,"value":21,"timestamp":"2021-11-11T08:30"}]'
```

## Deployment

If you don't have AWS profiles, then I'd recommend you to take a look at [AWS - Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)

```
AWS_PROFILE=your-aws-profile sls deploy -s dev --force --skip-additionalstack
```

Also, you can find more useful information [here](https://www.serverless.com/framework/docs/providers/aws/guide/deploying/)
