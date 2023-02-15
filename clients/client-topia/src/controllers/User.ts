import { AxiosResponse } from "axios";

// controllers
import { Scene } from "controllers/Scene";
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";
import { World } from "controllers/World";

// interfaces
import { UserOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of User class with email and optional session credentials.
 *
 * @usage
 * ```ts
 * await new User(topia, "example@email.io", { interactiveNonce: "exampleNonce", interactivePublicKey: "examplePublicKey", playerId: 1 });
 * ```
 */
export class User extends SDKController {
  #scenesMap: { [key: string]: Scene };
  #worldsMap: { [key: string]: World };
  email: string | undefined;
  urlSlug: string | undefined;
  visitorId: number | undefined | null;

  constructor(
    topia: Topia,
    options: UserOptionalInterface = { email: "", visitorId: null, urlSlug: "", credentials: {} },
  ) {
    super(topia, options.credentials);
    this.#scenesMap = {};
    this.#worldsMap = {};
    this.email = options.email;
    this.urlSlug = options.urlSlug;
    this.visitorId = options.visitorId;
  }

  get scenes() {
    return this.#scenesMap;
  }

  get worlds() {
    return this.#worldsMap;
  }

  /**
   * @summary
   * Returns details for a specific User by visitorId
   */
  async fetchUserByVisitorId(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.visitorId}`,
        this.requestOptions,
      );
      Object.assign(this, response.data);
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Returns all assets owned by User when an email address is provided.
   */
  async fetchAssetsByEmail(ownerEmail: string): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/assets/my-assets?email=${ownerEmail}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Returns all scenes owned by User
   */
  async fetchScenes(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get("/scenes/my-scenes", this.requestOptions);
      const tempScenesMap: { [key: string]: Scene } = {};
      for (const i in response.data) {
        const sceneDetails = response.data[i];
        tempScenesMap[sceneDetails.id] = new Scene(this.topia, sceneDetails.urlSlug, {
          attributes: sceneDetails,
        });
      }
      this.#scenesMap = tempScenesMap;
    } catch (error) {
      throw this.errorHandler({ error });
    }
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
  async fetchWorldsByKey(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get("/user/worlds", this.requestOptions);
      const tempWorldsMap: { [key: string]: World } = {};
      for (const i in response.data) {
        const worldDetails = response.data[i];
        tempWorldsMap[worldDetails.urlSlug] = new World(this.topia, worldDetails.urlSlug, {
          attributes: worldDetails,
        });
      }
      this.#worldsMap = tempWorldsMap;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }
}

export default User;
