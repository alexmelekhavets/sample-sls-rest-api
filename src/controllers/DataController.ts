import middleware, { AppEvent, AppContext } from "../app/Middleware";
import { Data, DataRepository } from "../repositories/DataRepository";

class DataController {
  async getDeviceData(
    event: AppEvent,
    context: AppContext
  ): Promise<Partial<Data>[]> {
    const {
      pathParameters: { deviceID },
    } = event;

    const dataRepository = new DataRepository(context.dbAdapter);

    return dataRepository.findByDeviceID(parseInt(deviceID));
  }

  async postData(event: AppEvent, context: AppContext): Promise<void> {
    const requestData = event.body as unknown as Data[];

    const dataRepository = new DataRepository(context.dbAdapter);

    await dataRepository.insertMany(requestData);
  }
}

const dataController = new DataController();

export const getDeviceData = middleware.wrapControllerAction(
  "getDeviceData",
  dataController.getDeviceData
);

export const postData = middleware.wrapControllerAction(
  "postData",
  dataController.postData
);
