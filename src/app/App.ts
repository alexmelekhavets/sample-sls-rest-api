import pino from "pino";
import { ILogger } from "./Logger";

export class App {
  createLogger(): ILogger {
    return pino({
      base: {},
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      redact: ["event.headers.Authorization"],
      prettyPrint: false,
      level: "info",
    });
  }
}

export default new App();
