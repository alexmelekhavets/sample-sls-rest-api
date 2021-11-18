import middleware, { AppEvent, AppContext } from "../app/Middleware";
import { Device, DeviceRepository } from "../repositories/DeviceRepository";

class DeviceController {
  async getDevices(_event: AppEvent, context: AppContext) {
    const deviceRepository = new DeviceRepository(context.dbAdapter);

    const result = await deviceRepository.getDevices();

    return result;
  }

  async getDevice(event: AppEvent, context: AppContext) {
    const {
      pathParameters: { deviceID },
    } = event;

    const deviceRepository = new DeviceRepository(context.dbAdapter);

    return deviceRepository.findDevice(parseInt(deviceID));
  }

  async postDevice(event: AppEvent, context: AppContext) {
    const deviceData = event.body as unknown as Device;

    const deviceRepository = new DeviceRepository(context.dbAdapter);

    const device = await deviceRepository.findDevice(deviceData.deviceID);

    if (device) {
      throw new Error("Duplicate Device Error");
    }

    await deviceRepository.createDevice(deviceData);
  }
}

const deviceController = new DeviceController();

export const getDevices = middleware.wrapControllerAction(
  "getDevices",
  deviceController.getDevices
);

export const getDevice = middleware.wrapControllerAction(
  "getDevice",
  deviceController.getDevice
);

export const postDevice = middleware.wrapControllerAction(
  "postDevice",
  deviceController.postDevice
);
