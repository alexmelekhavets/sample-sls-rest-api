import { Db, MongoClient } from "mongodb";

export interface IDbAdapter {
  connect(): Promise<void>;
  getDb(): Db;
  closeConnection(): Promise<void>;
}

class DbAdapter implements IDbAdapter {
  private mongoClient: MongoClient;
  private db: Db;

  constructor() {
    this.mongoClient = new MongoClient(process.env.MONGODB_URI);
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
