import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI } from "utils";

export class Scene {
  apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  fetchScenesByEmail(email: string): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/scenes/my-scenes?email=${email}`)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default Scene;
