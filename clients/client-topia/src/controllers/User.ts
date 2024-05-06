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
import { ResponseType, SpriteSheetJSONType } from "types";

/**
 * @summary
 * Create an instance of User class with optional session credentials.
 *
 * @usage
 * ```ts
 * await new User(topia, {
 *   profileId: 1,
 *   credentials: { apiKey: "exampleKey", interactiveNonce: "exampleNonce", urlSlug: "exampleWorld", visitorId: 1 }
 * });
 * ```
 */
export class User extends SDKController implements UserInterface {
  profileId?: string | null;
  dataObject?: object | null | undefined;
  profile?: Record<string, any>;

  #adminWorldsMap: { [key: string]: World };
  #assetsMap: { [key: string]: Asset };
  #scenesMap: { [key: string]: Scene };
  #worldsMap: { [key: string]: World };

  constructor(topia: Topia, options: UserOptionalInterface = { profileId: null, credentials: {} }) {
    super(topia, {
      apiKey: options?.credentials?.apiKey,
      interactiveNonce: options?.credentials?.interactiveNonce,
      profileId: options?.profileId,
      urlSlug: options?.credentials?.urlSlug,
      visitorId: options?.credentials?.visitorId,
    });
    this.profileId = options?.profileId;
    this.dataObject = {};
    this.profile = {};

    this.#adminWorldsMap = {};
    this.#assetsMap = {};
    this.#scenesMap = {};
    this.#worldsMap = {};
  }

  get adminWorlds() {
    return this.#adminWorldsMap;
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
   * Verify user has valid interactive credentials
   *
   * @usage
   * ```ts
   * await user.checkInteractiveCredentials();
   * ```
   */
  async checkInteractiveCredentials(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/auth/interactive-credentials`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.checkInteractiveCredentials" });
    }
  }

  /**
   * @summary
   * Returns all avatars owned by User
   *
   * @usage
   * ```ts
   * const avatars = await user.fetchAvatars();
   * ```
   */
  async fetchAvatars(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/avatars`, this.requestOptions);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.fetchAvatars" });
    }
  }

  /**
   * @summary
   * Add a new avatar
   *
   * @usage
   * ```ts
   * const { avatarId, spriteSheetId } = await user.addAvatar({
   *   name: "ExampleAvatar",
   *   animationMeta: {
   *     dance: {
   *       loop: true,
   *       x: 0,
   *       y: -20,
   *       hideLoop: true,
   *     },
   *   },
   *   animations: {
   *     "dance": [
   *       "dance/1.png",
   *       "dance/2.png",
   *       "dance/3.png",
   *       "dance/4.png",
   *       "dance/5.png",
   *     ],
   *   },
   *   frames: {
   *     "dance/1.png": {
   *       "frame": {
   *         "x": 1,
   *         "y": 1040,
   *         "w": 58,
   *         "h": 107
   *       },
   *       "rotated": true,
   *       "trimmed": true,
   *       "spriteSourceSize": {
   *         "x": 50,
   *         "y": 58,
   *         "w": 58,
   *         "h": 107
   *       },
   *       "sourceSize": {
   *         "w": 159,
   *         "h": 200
   *       }
   *     },
   *   },
   *   "spriteSheetType": "PLAYER_AVATAR",
   *   "spriteSheetTypeMeta": {
   *   "meta": {
   *     "image": "spriteSheets%2FTvHNjgoMkiErDNSrVqHU%2FspriteSheet.png?alt=media",
   *     "format": "RGBA8888",
   *     "size": {
   *       "w": 2006,
   *       "h": 1099,
   *     },
   *     "scale": "1",
   *   },
   * });
   * ```
   */
  async addAvatar({
    animationMeta,
    animations,
    name,
    frames,
    meta,
  }: SpriteSheetJSONType): Promise<void | ResponseType> {
    const params = { animationMeta, animations, name, frames, meta };
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(`/avatars`, params, this.requestOptions);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "User.addAvatar" });
    }
  }

  /**
   * @summary
   * Upload sprite sheet and avatar preview .png files to existing sprite sheet and avatar storage buckets
   *
   * @usage
   * ```ts
   * const formData = new FormData();
   * formData.append('expression_dance', expression_dance);
   * formData.append('expression_emote', expression_emote);
   * formData.append('expression_sit', expression_sit);
   * formData.append('expression_stand', expression_stand);
   * formData.append('expression_transport', expression_transport);
   * formData.append('preview', preview);
   * formData.append('spriteSheet', spriteSheet);
   * formData.append('unityPackage', unityPackage);
   * await user.uploadAvatarFiles("exampleAvatarId", formData);
   * ```
   */
  async uploadAvatarFiles(avatarId: string, formData: FormData): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/avatars/${avatarId}/upload-files`,
        formData,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.uploadAvatarFiles" });
    }
  }

  /**
   * @summary
   * Returns all assets owned by User when an email address is provided.
   *
   * @usage
   * ```ts
   * await user.fetchAssets();
   * const userAssets = user.assets;
   * ```
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
      throw this.errorHandler({ error, sdkMethod: "User.fetchAssets" });
    }
  }

  /**
   * @summary
   * Returns all platform assets.
   *
   * @usage
   * ```ts
   * const assets = await user.fetchPlatformAssets();
   * ```
   */
  async fetchPlatformAssets(): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get("/assets/topia-assets", this.requestOptions);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Asset.fetchPlatformAssets" });
    }
  }

  /**
   * @summary
   * Returns all scenes owned by User.
   *
   * @usage
   * ```ts
   * await user.fetchScenes();
   * const userScenes = user.scenes;
   * ```
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
      throw this.errorHandler({ error, sdkMethod: "User.fetchScenes" });
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
      throw this.errorHandler({ error, sdkMethod: "User.fetchWorldsByKey" });
    }
  }

  /**
   * @summary
   * Retrieves all worlds a user with matching API Key is an admin in,
   * creates a new World object for each,
   * and creates new map of Worlds accessible via user.adminWorlds.
   *
   * @usage
   * ```ts
   * await user.fetchAdminWorldsByKey();
   * const adminWorlds = user.adminWorlds;
   * ```
   */
  async fetchAdminWorldsByKey(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get("/user/admin-worlds", this.requestOptions);
      const tempAdminWorldsMap: { [key: string]: World } = {};
      for (const i in response.data) {
        const urlSlug = response.data[i];
        tempAdminWorldsMap[urlSlug] = new World(this.topia, urlSlug, {
          credentials: this.credentials,
        });
      }
      this.#adminWorldsMap = tempAdminWorldsMap;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.fetchAdminWorldsByKey" });
    }
  }

  /**
   * @summary
   * Retrieves ids of all dropped assets in all worlds with a matching interactivePublicKey.
   *
   * @usage
   * ```ts
   * await user.fetchInteractiveWorldsByKey("interactivePublicKeyExample");
   * const interactiveWorlds = user.interactiveWorlds;
   * ```
   */
  async fetchInteractiveWorldsByKey(interactivePublicKey: string): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/user/interactive-worlds?interactivePublicKey=${interactivePublicKey}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.fetchInteractiveWorldsByKey" });
    }
  }

  /**
   * @summary
   * Retrieves the data object for a user.
   *
   * @usage
   * ```ts
   * const dataObject = await user.fetchDataObject();
   * ```
   */
  async fetchDataObject(): Promise<void | ResponseType> {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/user/dataObjects/${this.profileId}/get-data-object`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.fetchDataObject" });
    }
  }

  /**
   * @summary
   * Sets the data object for a user.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await user.setDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * ```
   */
  async setDataObject(
    dataObject: object | null | undefined,
    options: { analytics?: string[]; lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";
      const { analytics = [], lock = {} } = options;
      await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/set-data-object`,
        { analytics, dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );
      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "User.setDataObject" });
    }
  }

  /**
   * @summary
   * Updates the data object for a user.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await user.updateDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: { analytics?: string[]; lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";
      const { analytics = [], lock = {} } = options;
      await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/update-data-object`,
        { analytics, dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "User.updateDataObject" });
    }
  }

  /**
   * @summary
   * Increments a specific value in the data object for a user by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await user.incrementDataObjectValue(
   *   "path": "key",
   *   "amount": 1,
   * );
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: { analytics?: string[]; lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { analytics = [], lock = {} } = options;
      await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/increment-data-object-value`,
        { path, amount, analytics, lock },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { path, amount, options }, sdkMethod: "User.incrementDataObjectValue" });
    }
  }
}

export default User;
