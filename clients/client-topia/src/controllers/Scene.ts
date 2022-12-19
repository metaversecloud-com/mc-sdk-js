import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI } from "utils";

export class Scene {
  apiKey: string;
  email: string;

  constructor(apiKey: string, email: string) {
    this.apiKey = apiKey;
    this.email = email;
  }

  fetchScenesByEmail(): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/scenes/my-scenes?email=${this.email}`)
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
