import * as Joi from "joi";
import { serializeError } from "serialize-error";

import { ILogger } from "./Logger";
import { AppEvent } from "./Middleware";

export type RouteSchemasType = {
  type: "queryStringParameters" | "body" | "pathParameters";
  requestSchema?: Joi.SchemaLike;
  responseSchema?: Joi.SchemaLike;
};

export type SchemasType = Map<string, RouteSchemasType>;

export class Validator {
  private schema: RouteSchemasType;

  constructor(
    private route: string,
    schemas: SchemasType,
    private logger: ILogger
  ) {
    this.schema = schemas.get(route);
  }

  validateRequest(event: AppEvent) {
    if (this.schema?.requestSchema) {
      const compiled = Joi.compile(this.schema.requestSchema);
      if (this.schema.type === "body") {
        event[this.schema.type] = JSON.parse(event[this.schema.type]);
      }
      const { error, value } = compiled.validate(
        event[this.schema.type] || {},
        {
          abortEarly: false,
        }
      );
      if (error) {
        this.logger.error({
          name: "Validator.validateRequest",
          route: this.route,
          error: serializeError(error),
        });
        throw new Error();
      }
    }
  }

  validateResponse(payload: any) {
    if (this.schema?.responseSchema) {
      const compiled = Joi.compile(this.schema.responseSchema);
      const { error, value } = compiled.validate(payload, {
        abortEarly: false,
      });
      if (error) {
        this.logger.error({
          name: "Validator.validateResponse",
          route: this.route,
          error: serializeError(error),
        });
        throw new Error();
      }
    }
  }
}
