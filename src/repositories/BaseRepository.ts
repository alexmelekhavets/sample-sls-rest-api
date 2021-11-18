import { Collection } from "mongodb";
import { IDbAdapter } from "../app/DbAdapter";

export abstract class BaseRepository {
  constructor(private dbAdapter: IDbAdapter) {}

  protected getCollection<T>(): Collection<T> {
    return this.dbAdapter.getDb().collection<T>(this.getCollectionName());
  }

  protected abstract getCollectionName(): string;
}
