import { ObjectId } from "mongodb";
import { IDbAdapter } from "../app/DbAdapter";
import { BaseRepository } from "./BaseRepository";

export type Device = {
  _id?: ObjectId;
  deviceID: number;
  name: string;
  model: string;
  brand: string;
};

export class DeviceRepository extends BaseRepository {
  constructor(dbAdapter: IDbAdapter) {
    super(dbAdapter);
  }

  async getDevices(): Promise<Device[]> {
    return this.getCollection<Device>()
      .find({})
      .project<Device>({ _id: 0 })
      .toArray();
  }

  async findDevice(deviceID: Device["deviceID"]): Promise<Partial<Device>> {
    return this.getCollection<Device>().findOne(
      { deviceID },
      { projection: { _id: 0, deviceID: 0 } }
    );
  }

  async createDevice(deviceDTO: Device): Promise<void> {
    await this.getCollection<Device>().insertOne(deviceDTO);
  }

  protected getCollectionName(): string {
    return "devices";
  }
}
