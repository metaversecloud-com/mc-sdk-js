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
import { AnalyticType } from "types/AnalyticTypes";

/**
 * Create an instance of User class with optional session credentials.
 *
 * @example
 * ```ts
 * const user = await new User(topia, {
 *   profileId: 1,
 *   credentials: { interactiveNonce: "exampleNonce", assetId: "droppedAssetId", visitorId: 1, urlSlug: "exampleWorld" }
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
    super(topia, { profileId: options?.profileId, ...options.credentials });

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

  /*
   * Verify user has valid interactive credentials
   *
   * @example
   * ```ts
   * await user.checkInteractiveCredentials();
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
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
   * Returns all avatars owned by User
   *
   * @category Avatars
   *
   * @example
   * ```ts
   * const avatars = await user.fetchAvatars();
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the avatars or an error.
   */
  async fetchAvatars(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/avatars/${this.profileId}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.fetchAvatars" });
    }
  }

  /**
   * Add a new avatar
   *
   * @category Avatars
   *
   * @example
   * ```ts
   * const animationMeta = {
   *   "emote": { "loop": false, "x": 0, "y": 0, "hideLoop": true }
   * }
   *
   * const spriteSheetJSON = {
   *   "animations": {
   *     "emote": [
   *       "emote/1.png"
   *     ]
   *   },
   *   "frames": {
   *     "emote/1.png": {
   *       "frame": {
   *        "x": 1911,
   *        "y": 778,
   *        "w": 58,
   *        "h": 91
   *      },
   *      "rotated": true,
   *      "trimmed": true,
   *      "spriteSourceSize": {
   *        "x": 50,
   *        "y": 33,
   *        "w": 58,
   *        "h": 91
   *      },
   *      "sourceSize": {
   *        "w": 159,
   *        "h": 159
   *      }
   *    }
   *  },
   *  "spriteSheetTypeMeta": {
   *    "nameplate": {
   *      "x": 0,
   *      "y": -70
   *    }
   *  },
   *  "meta": {
   *    "image": "spriteSheets%2FTvHNjgoMkiErDNSrVqHU%2FspriteSheet.png?alt=media",
   *    "format": "RGBA8888",
   *    "size": {
   *      "w": 2006,
   *      "h": 1099
   *    },
   *    "scale": "1"
   *  }
   * }
   *
   * const formData = new FormData();
   * formData.append('animationMeta', animationMeta);
   * formData.append('name', "ExampleAvatarName");
   * formData.append('spriteSheetJSON', spriteSheetJSON);
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
  async addAvatar(formData: FormData): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/avatars/${this.profileId}`,
        formData,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: formData, sdkMethod: "User.addAvatar" });
    }
  }

  /**
   * Update avatar and sprite sheet records and upload files to existing sprite sheet and avatar storage buckets
   *
   * @category Avatars
   *
   * @example
   * ```ts
   * const animationMeta = {
   *   "emote": { "loop": false, "x": 0, "y": 0, "hideLoop": true }
   * }
   *
   * const spriteSheetJSON = {
   *   "animations": {
   *     "emote": [
   *       "emote/1.png"
   *     ]
   *   },
   *   "frames": {
   *     "emote/1.png": {
   *       "frame": {
   *        "x": 1911,
   *        "y": 778,
   *        "w": 58,
   *        "h": 91
   *      },
   *      "rotated": true,
   *      "trimmed": true,
   *      "spriteSourceSize": {
   *        "x": 50,
   *        "y": 33,
   *        "w": 58,
   *        "h": 91
   *      },
   *      "sourceSize": {
   *        "w": 159,
   *        "h": 159
   *      }
   *    }
   *  },
   *  "spriteSheetTypeMeta": {
   *    "nameplate": {
   *      "x": 0,
   *      "y": -70
   *    }
   *  },
   *  "meta": {
   *    "image": "spriteSheets%2FTvHNjgoMkiErDNSrVqHU%2FspriteSheet.png?alt=media",
   *    "format": "RGBA8888",
   *    "size": {
   *      "w": 2006,
   *      "h": 1099
   *    },
   *    "scale": "1"
   *  }
   * }
   *
   * const formData = new FormData();
   * formData.append('animationMeta', animationMeta);
   * formData.append('name', "ExampleAvatarName");
   * formData.append('spriteSheetJSON', spriteSheetJSON);
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
  async updateAvatar(avatarId: string, formData: FormData): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/avatars/${this.profileId}/${avatarId}`,
        formData,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: formData, sdkMethod: "User.updateAvatar" });
    }
  }

  /**
   * Update avatar and sprite sheet records and upload files to existing sprite sheet and avatar storage buckets
   *
   * @category Avatars
   *
   * @example
   * ```ts
   * await user.deleteAvatar("exampleAvatarId");
   * ```
   */
  async deleteAvatar(avatarId: string): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().delete(
        `/avatars/${this.profileId}/${avatarId}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.deleteAvatar" });
    }
  }

  /**
   * Returns all assets owned by User when an email address is provided.
   *
   * @category Assets
   *
   * @example
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
   * Returns all platform assets.
   *
   * @category Assets
   *
   * @example
   * ```ts
   * const assets = await user.fetchPlatformAssets();
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns the platform assets or an error response.
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
   * Returns all scenes owned by User.
   *
   * @category Scenes
   *
   * @example
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
   * Retrieves all worlds owned by user with matching API Key, creates a new World object for each, and creates new map of Worlds accessible via user.worlds.
   *
   * @category Worlds
   *
   * @example
   * ```ts
   * await user.fetchWorldsByKey();
   * const userWorlds = user.worlds;
   * ```
   *
   * @returns
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
   * Retrieves all worlds a user with matching API Key is an admin in, creates a new World object for each, and creates new map of Worlds accessible via user.adminWorlds.
   *
   * @category Worlds
   *
   * @example
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
   * Retrieves ids of all dropped assets in all worlds with a matching interactivePublicKey.
   *
   * @category Dropped Assets
   *
   * @example
   * ```ts
   * await user.fetchInteractiveWorldsByKey("interactivePublicKeyExample");
   * const interactiveWorlds = user.interactiveWorlds;
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns the `urlSlugs` of worlds where the Public Key is found or an error response.
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
   * Send an email
   *
   * @example
   * ```ts
   * const html = `<p><b>Hello World!</b></p><p>This email is being sent from via SDK.</p>`
   * await user.sendEmail({ html, subject: "Example", to: "example@email.io" });
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns `{ success: true }` if the email is sent successfully or an error response.
   */
  async sendEmail({
    html,
    subject,
    to,
  }: {
    html: string;
    subject: string;
    to: string;
  }): Promise<object | ResponseType> {
    const params = { html, subject, to };
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/notifications/send-email`,
        params,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "User.sendEmail" });
    }
  }

  /**
   * Get expressions
   *
   * @category Expressions
   *
   * @example
   * ```ts
   * await user.getExpressions({ getUnlockablesOnly: true, });
   * ```
   *
   * @returns {Promise<ResponseType>} Returns an array of expressions or an error response.
   */
  async getExpressions({
    name,
    getUnlockablesOnly,
  }: {
    name?: string;
    getUnlockablesOnly?: boolean;
  }): Promise<ResponseType> {
    try {
      let query = `?getUnlockablesOnly=${getUnlockablesOnly}`;
      if (name) query += `&name=${name}`;

      const result = await this.topiaPublicApi().get(`/expressions${query}`, this.requestOptions);
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { name, getUnlockablesOnly }, sdkMethod: "User.getExpressions" });
    }
  }

  /**
   * Retrieves the data object for a user.
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const dataObject = await user.fetchDataObject();
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
   */
  async fetchDataObject(appPublicKey?: string, appJWT?: string): Promise<void | ResponseType> {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";

      let query = "";
      if (appPublicKey) query = `?appPublicKey=${appPublicKey}&appJWT=${appJWT}`;
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/user/dataObjects/${this.profileId}/get-data-object${query}`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "User.fetchDataObject" });
    }
  }

  /**
   * Sets the data object for a user.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await user.setDataObject(
   *   { itemsCollected: 0 },
   *   {
   *     analytics: [{ analyticName: "resets"} ],
   *     lock: { lockId: `${assetId}-${itemsCollected}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
   *   },
   * );
   *
   * const { itemsCollected } = user.dataObject;
   * ```
   */
  async setDataObject(
    dataObject: object | null | undefined,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";

      await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/set-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );

      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "User.setDataObject" });
    }
  }

  /**
   * Updates the data object for a user.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const theme = "exampleTheme";
   *
   * await user.updateDataObject({
   *   [`${theme}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
   * });
   *
   * const { exampleTheme } = user.dataObject;
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      if (!this.profileId) throw "This method requires the use of a profileId";

      await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/update-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "User.updateDataObject" });
    }
  }

  /**
   * Increments a specific value in the data object for a user by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await user.incrementDataObjectValue("key", 1);
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/user/dataObjects/${this.profileId}/increment-data-object-value`,
        { path, amount, ...options },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { path, amount, options }, sdkMethod: "User.incrementDataObjectValue" });
    }
  }
}

export default User;
