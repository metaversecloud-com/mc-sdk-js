import { publicAPI } from "utils";

export class Scene {
  apiKey: string;
  email: string;

  constructor(apiKey: string, email: string) {
    this.apiKey = apiKey;
    this.email = email;
  }

  async fetchScenesByEmail(): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/scenes/my-scenes?email=${this.email}`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}

export default Scene;