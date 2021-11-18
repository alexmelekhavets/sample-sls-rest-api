import { pino as pinoExtras } from "pino/pino";

export type ILogger = pinoExtras.BaseLogger & pinoExtras.LoggerExtras;
