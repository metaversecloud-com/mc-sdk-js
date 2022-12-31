import { AxiosResponse } from "axios";
import { World } from "controllers/World";
import { getErrorMessage, publicAPI } from "utils";

export class User {
  #worldsMap: { [key: string]: World };
  apiKey: string;
  email: string;

  constructor({ apiKey, email }: { apiKey: string; email: string }) {
    this.#worldsMap = {};
    this.apiKey = apiKey;
    this.email = email;
  }

  get worlds() {
    return this.#worldsMap;
  }

  fetchScenesByEmail(): Promise<object> {
    return new Promise((resolve, reject) => {
      if (!this.email) reject("There is no email associated with this user.");
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

  fetchWorldsByKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get("/user/worlds")
        .then((response: AxiosResponse) => {
          const tempWorldsMap: { [key: string]: World } = {};
          for (const i in response.data) {
            const worldDetails = response.data[i];
            tempWorldsMap[worldDetails.urlSlug] = new World({
              apiKey: this.apiKey,
              args: worldDetails,
              urlSlug: worldDetails.urlSlug,
            });
          }
          this.#worldsMap = tempWorldsMap;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default User;
