import { AxiosResponse } from "axios";
import { World } from "controllers/World";
import { getErrorMessage, publicAPI } from "utils";

/**
 * Create an instance of User class with a given apiKey.
 *
 * ```ts
 * await new User({ apiKey: API_KEY, email: "example@email.io" });
 * ```
 */
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

  /**
   * @summary
   * Returns all assets owned by User when an email address is provided.
   */
  fetchAssetsByEmail(ownerEmail: string): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/assets/my-assets?email=${ownerEmail}`)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  /**
   * @summary
   * Returns all scenes owned by User when an email address is provided.
   */
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

  /**
   * @summary
   * Retrieves all worlds owned by user with matching API Key,
   * creates a new World object for each,
   * and creates new map of Worlds accessible via user.worlds.
   *
   * @usage
   * ```ts
   * await user.fetchWorldsByKey();
   * const userWorlds = user.worlds;
   * ```
   *
   * @result
   * ```ts
   * { urlSlug: new World({ apiKey, worldArgs, urlSlug }) }
   * ```
   */
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
