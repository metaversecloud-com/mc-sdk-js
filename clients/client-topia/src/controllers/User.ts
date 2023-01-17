import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { World } from "controllers/World";
import { Topia } from "controllers/Topia";

// interfaces
import { UserOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

// utils
import { getErrorResponse, getSuccessResponse } from "utils";

/**
 * Create an instance of User class with email and optional session credentials.
 *
 * ```ts
 * await new User(topia, "example@email.io", { interactiveNonce: "exampleNonce", interactivePublicKey: "examplePublicKey", playerId: 1 });
 * ```
 */
export class User extends SDKController {
  #worldsMap: { [key: string]: World };
  email: string;

  constructor(topia: Topia, email: string, options: UserOptionalInterface = { credentials: {} }) {
    super(topia, options.credentials);
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
    return new Promise((resolve) => {
      this.topia.axios
        .get(`/assets/my-assets?email=${ownerEmail}`, this.requestOptions)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }

  /**
   * @summary
   * Returns all scenes owned by User when an email address is provided.
   */
  fetchScenesByEmail(): Promise<object> {
    return new Promise((resolve) => {
      if (!this.email) resolve(getErrorResponse({ message: "There is no email associated with this user." }));
      this.topia.axios
        .get(`/scenes/my-scenes?email=${this.email}`, this.requestOptions)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
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
  fetchWorldsByKey(): Promise<ResponseType> {
    return new Promise((resolve) => {
      this.topia.axios
        .get("/user/worlds", this.requestOptions)
        .then((response: AxiosResponse) => {
          const tempWorldsMap: { [key: string]: World } = {};
          for (const i in response.data) {
            const worldDetails = response.data[i];
            tempWorldsMap[worldDetails.urlSlug] = new World(this.topia, worldDetails.urlSlug, {
              attributes: worldDetails,
            });
          }
          this.#worldsMap = tempWorldsMap;
          resolve(getSuccessResponse());
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }
}

export default User;
