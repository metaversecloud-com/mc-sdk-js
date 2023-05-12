import { AxiosResponse } from "axios";

// controllers
import { Asset } from "controllers/Asset";
import { Scene } from "controllers/Scene";
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";
import { World } from "controllers/World";

// interfaces
import { UserInterface, UserOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of User class with optional session credentials.
 *
 * @usage
 * ```ts
 * await new User(topia, { interactiveNonce: "exampleNonce", interactivePublicKey: "examplePublicKey", visitorId: 1 });
 * ```
 */
export class User extends SDKController implements UserInterface {
  profileId?: string | null;
  dataObject?: object | null | undefined;
  profile?: Record<string, any>;

  #assetsMap: { [key: string]: Asset };
  #scenesMap: { [key: string]: Scene };
  #worldsMap: { [key: string]: World };

  constructor(topia: Topia, options: UserOptionalInterface = { profileId: null, credentials: {} }) {
    super(topia, options.credentials);
    this.profileId = options.profileId;
    this.dataObject = {};
    this.profile = {};

    this.#assetsMap = {};
    this.#scenesMap = {};
    this.#worldsMap = {};
  }

  get assets() {
    return this.#assetsMap;
  }

  get scenes() {
    return this.#scenesMap;
  }

  get worlds() {
    return this.#worldsMap;
  }

  /**
   * @summary
   * Returns all assets owned by User when an email address is provided.
   */
  async fetchAssets(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/assets/my-assets`, this.requestOptions);
      const tempAssetsMap: { [key: string]: Asset } = {};
      for (const i in response.data) {
        const assetDetails = response.data[i];
        tempAssetsMap[assetDetails.id] = new Asset(this.topia, assetDetails.id, {
          attributes: assetDetails,
          credentials: this.credentials,
        });
      }
      this.#assetsMap = tempAssetsMap;
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
          credentials: this.credentials,
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
          credentials: this.credentials,
        });
      }
      this.#worldsMap = tempWorldsMap;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Retrieves the data object for a user.
   *
   * @usage
   * ```ts
   * await droppedAsset.fetchDataObject();
   * const { dataObject } = droppedAsset;
   * ```
   */
  async fetchDataObject(): Promise<void | ResponseType> {
    return this.#fetchUserDataObject();
  }

  /**
   * @summary
   * Sets the data object for a user.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.setDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * const { dataObject } = droppedAsset;
   * ```
   */
  async setDataObject(
    dataObject: object | null | undefined,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    return this.#setUserDataObject(dataObject, options);
  }

  /**
   * @summary
   * Updates the data object for a user.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.updateUserDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * const { dataObject } = droppedAsset;
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    return this.#updateUserDataObject(dataObject, options);
  }

  #fetchUserDataObject = async (): Promise<void | ResponseType> => {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/user/dataObjects/${this.profileId}/get-data-object`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };

  #setUserDataObject = async (
    dataObject: object | null | undefined,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> => {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";
      const { lock = {} } = options;
      const response = await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/set-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );

      this.dataObject = dataObject || this.dataObject;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };

  #updateUserDataObject = async (
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> => {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";
      const { lock = {} } = options;
      const response = await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/update-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );

      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };
}

export default User;
