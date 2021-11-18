import { ObjectId } from "mongodb";
import { IDbAdapter } from "../app/DbAdapter";
import { BaseRepository } from "./BaseRepository";
import { Device } from "./DeviceRepository";

export type Data = {
  _id?: ObjectId;
  deviceID: number;
  value: number;
  timestamp: Date;
};

export class DataRepository extends BaseRepository {
  constructor(dbAdapter: IDbAdapter) {
    super(dbAdapter);
  }

  async getDevices(): Promise<Data[]> {
    return this.getCollection<Data>()
      .find({})
      .project<Data>({ _id: 0 })
      .toArray();
  }

  async findByDeviceID(deviceID: Device["deviceID"]): Promise<Partial<Data>[]> {
    return this.getCollection<Data>()
      .find({ deviceID }, { projection: { _id: 0, deviceID: 0 } })
      .toArray();
  }

  async createData(dataDTO: Data): Promise<void> {
    await this.getCollection<Data>().insertOne(dataDTO);
  }

  async insertMany(dataDTOs: Data[]): Promise<void> {
    await this.getCollection<Data>().insertMany(dataDTOs);
  }

  protected getCollectionName(): string {
    return "data";
  }
}
