import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { World } from "controllers/World";
import { Topia } from "controllers/Topia";

// interfaces
import { UserOptionalInterface } from "interfaces";

// utils
import { getErrorMessage } from "utils";

/**
 * Create an instance of User class with a given apiKey.
 *
 * ```ts
 * await new User({ email: "example@email.io" });
 * ```
 */
export class User extends SDKController {
  #worldsMap: { [key: string]: World };
  email: string;

  constructor(topia: Topia, email: string, options: UserOptionalInterface = { creds: {} }) {
    super(topia, options.creds);
    this.#worldsMap = {};
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
      this.topia.axios
        .get(`/assets/my-assets?email=${ownerEmail}`, this.requestOptions)
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
      this.topia.axios
        .get(`/scenes/my-scenes?email=${this.email}`, this.requestOptions)
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
      this.topia.axios
        .get("/user/worlds", this.requestOptions)
        .then((response: AxiosResponse) => {
          const tempWorldsMap: { [key: string]: World } = {};
          for (const i in response.data) {
            const worldDetails = response.data[i];
            tempWorldsMap[worldDetails.urlSlug] = new World(this.topia, worldDetails.urlSlug, { args: worldDetails });
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
