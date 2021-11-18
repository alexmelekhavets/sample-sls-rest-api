import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import app, { App } from "./App";
import dbAdapter, { IDbAdapter } from "./DbAdapter";
import { ILogger } from "./Logger";
import { SchemasType, Validator } from "./Validator";
import schemas from "./Schemas";

export type AppEvent = APIGatewayEvent;
export type AppContext = Context & { dbAdapter: IDbAdapter; log: ILogger };

export type ControllerActionType = (
  event: AppEvent,
  context: AppContext
) => Promise<any>;

export class Middleware {
  constructor(protected app: App, protected schemas: SchemasType) {}

  wrapControllerAction(route: string, controllerAction: ControllerActionType) {
    return async (
      event: APIGatewayEvent,
      context: Context
    ): Promise<APIGatewayProxyResult> => {
      const logger = this.app
        .createLogger()
        .child({ awsRequestId: context.awsRequestId });
      const validator = new Validator(route, this.schemas, logger);

      // validate request
      try {
        validator.validateRequest(event);
      } catch (e) {
        return this.response(400);
      }

      const appContext: AppContext = { ...context } as AppContext;

      // connect to DB
      await dbAdapter.connect();

      // inject DB adapter
      appContext["dbAdapter"] = dbAdapter;

      const result = await controllerAction(event, appContext);

      // close connection to DB
      await dbAdapter.closeConnection();

      // validate result of action
      try {
        validator.validateResponse(result);
      } catch (e) {
        return this.response(500);
      }

      return this.response(200, result);
    };
  }

  private response(
    statusCode: 200 | 400 | 404 | 500,
    payload?: any
  ): APIGatewayProxyResult {
    return {
      statusCode,
      body: payload ? JSON.stringify(payload, null, 2) : "",
    };
  }
}

export default new Middleware(app, schemas);
