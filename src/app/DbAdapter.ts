import { Db, MongoClient } from "mongodb";
import * as path from "path";

// IMPORTANT! this ssl certificate is required for db connection
import "../assets/rds-combined-ca-bundle.pem";

export interface IDbAdapter {
  connect(): Promise<void>;
  getDb(): Db;
  closeConnection(): Promise<void>;
}

class DbAdapter implements IDbAdapter {
  private mongoClient: MongoClient;
  private db: Db;

  constructor() {
    const pathToCAFile = path.resolve(
      __dirname,
      "./../assets/rds-combined-ca-bundle.pem"
    );

    this.mongoClient = new MongoClient(process.env.MONGODB_URI, {
      ssl: true,
      sslCA: pathToCAFile,
      retryWrites: false,
    });
  }

  async connect(): Promise<void> {
    await this.mongoClient.connect();
    this.db = this.mongoClient.db(process.env.MONGODB_DB);
  }

  getDb(): Db {
    return this.db;
  }

  async closeConnection(): Promise<void> {
    await this.mongoClient.close(true);
  }
}

export default new DbAdapter();
