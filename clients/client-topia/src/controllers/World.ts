import { AxiosResponse } from "axios";

// controllers
import { DroppedAsset } from "controllers/DroppedAsset";
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import {
  WorldInterface,
  WorldDetailsInterface,
  WorldOptionalInterface,
  WorldWebhooksInterface,
  FireToastInterface,
} from "interfaces";

// types
import { WorldActivityType, ResponseType } from "types";
import { AnalyticType } from "types/AnalyticTypes";

// utils
import { removeUndefined } from "utils";

/**
 * Create an instance of World class with a given url slug and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * const world = await new World(topia, "exampleWorld", {
 *   attributes: { name: "Example World" },
 *   credentials: { interactiveNonce: "exampleNonce", assetId: "droppedAssetId", visitorId: 1, urlSlug: "exampleWorld" }
 * });
 * ```
 */
export class World extends SDKController implements WorldInterface {
  urlSlug: string;
  #droppedAssetsMap: { [key: string]: DroppedAsset };
  dataObject?: object | null | undefined;
  sceneDropIds?: [string] | null | undefined;
  scenes?: [string] | null | undefined;
  webhooks?: WorldWebhooksInterface | null | undefined;

  constructor(topia: Topia, urlSlug: string, options: WorldOptionalInterface = { attributes: {}, credentials: {} }) {
    super(topia, { urlSlug: options?.credentials?.urlSlug || urlSlug, ...options.credentials });
    Object.assign(this, options.attributes);
    this.urlSlug = urlSlug;
    this.#droppedAssetsMap = {};
  }

  get droppedAssets() {
    return this.#droppedAssetsMap;
  }

  //////// world details
  /**
   * Retrieves details of a world.
   *
   * @example
   * ```ts
   * await world.fetchDetails();
   * const { name } = world;
   * ```
   */
  async fetchDetails(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/world-details`,
        this.requestOptions,
      );
      Object.assign(this, response.data);
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "World.fetchDetails" });
    }
  }

  /**
   * Update details of a world.
   *
   * @example
   * ```ts
   * await world.updateDetails({
   *   controls: {
   *     allowMuteAll: true,
   *     disableHideVideo: true,
   *     isMobileDisabled: false,
   *     isShowingCurrentGuests: false,
   *   },
   *   description: 'Welcome to my world.',
   *   forceAuthOnLogin: false,
   *   height: 2000,
   *   name: 'Example',
   *   spawnPosition: { x: 100, y: 100 },
   *   width: 2000
   * });
   *
   * const { name, description } = world;
   * ```
   */
  async updateDetails({
    controls,
    description,
    forceAuthOnLogin,
    height,
    name,
    spawnPosition,
    width,
  }: WorldDetailsInterface): Promise<void | ResponseType> {
    const params = {
      controls,
      description,
      forceAuthOnLogin,
      height,
      name,
      spawnPosition,
      width,
    };
    try {
      await this.topiaPublicApi().put(`/world/${this.urlSlug}/world-details`, params, this.requestOptions);
      const cleanPayload = removeUndefined(params);
      Object.assign(this, cleanPayload);
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "World.updateDetails" });
    }
  }

  /**
   * Set close world settings
   *
   * @example
   * ```ts
   * await world.updateCloseWorldSettings({
   *   controls: {
   *     allowMuteAll: true,
   *     disableHideVideo: true,
   *     isMobileDisabled: false,
   *     isShowingCurrentGuests: false,
   *   },
   *   description: 'Welcome to my world.',
   *   forceAuthOnLogin: false,
   *   height: 2000,
   *   name: 'Example',
   *   spawnPosition: { x: 100, y: 100 },
   *   width: 2000
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async updateCloseWorldSettings({
    closeWorldDescription,
    isWorldClosed,
  }: {
    closeWorldDescription: string;
    isWorldClosed: boolean;
  }): Promise<void | ResponseType> {
    const params = {
      closeWorldDescription,
      isWorldClosed,
    };
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/set-close-world-settings`,
        params,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "World.updateCloseWorldSettings" });
    }
  }

  ////////// dropped assets
  /**
   * Retrieve all assets dropped in a world.
   *
   * @category Dropped Assets
   *
   * @example
   * ```ts
   * await world.fetchDroppedAssets();
   * const assets = world.droppedAssets;
   * ```
   */
  async fetchDroppedAssets(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets`,
        this.requestOptions,
      );
      // create temp map and then update private property only once
      const tempDroppedAssetsMap: { [key: string]: DroppedAsset } = {};
      for (const index in response.data) {
        tempDroppedAssetsMap[index] = new DroppedAsset(this.topia, response.data[index].id, this.urlSlug, {
          attributes: response.data[index],
          credentials: this.credentials,
        });
      }
      this.#droppedAssetsMap = tempDroppedAssetsMap;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "World.fetchDroppedAssets" });
    }
  }

  /**
   * Retrieve all assets dropped in a world matching uniqueName.
   *
   * @category Dropped Assets
   *
   * @example
   * ```ts
   * const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({ uniqueName: "exampleUniqueName", isPartial: true });
   * ```
   *
   * @returns {Promise<DroppedAsset[]>} Returns an array of DroppedAsset instances.
   */
  async fetchDroppedAssetsWithUniqueName({
    uniqueName,
    isPartial = false,
    isReversed = false,
  }: {
    uniqueName: string;
    isPartial?: boolean;
    isReversed?: boolean;
  }): Promise<DroppedAsset[]> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets-with-unique-name/${uniqueName}?${isPartial ? `partial=${isPartial}&` : ""}${
          isReversed ? `reversed=${isReversed}` : ""
        }`,
        this.requestOptions,
      );
      const droppedAssets: DroppedAsset[] = [];
      for (const asset of response.data.assets) {
        droppedAssets.push(
          new DroppedAsset(this.topia, asset.id, this.urlSlug, {
            attributes: asset,
            credentials: this.credentials,
          }),
        );
      }
      return droppedAssets;
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { uniqueName, isPartial, isReversed },
        sdkMethod: "World.fetchDroppedAssetsWithUniqueName",
      });
    }
  }

  /**
   * Retrieve all assets dropped in a world matching sceneDropId.
   *
   * @category Dropped Assets
   *
   * @example
   * ```ts
   * const droppedAssets = await world.fetchDroppedAssetsBySceneDropId({
   *   sceneDropId: "sceneDropIdExample",
   *   uniqueName: "optionalUniqueNameExample",
   * });
   * ```
   *
   * @returns {Promise<DroppedAsset[]>} Returns an array of DroppedAsset instances.
   */
  async fetchDroppedAssetsBySceneDropId({
    sceneDropId,
    uniqueName,
  }: {
    sceneDropId: string;
    uniqueName?: string;
  }): Promise<DroppedAsset[]> {
    try {
      if (!sceneDropId) throw this.errorHandler({ message: "A sceneDropId is required." });
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets-with-scene-drop-id/${sceneDropId}${
          uniqueName ? `?uniqueName=${uniqueName}` : ""
        }`,
        this.requestOptions,
      );
      // create temp map and then update private property only once
      const droppedAssets: DroppedAsset[] = [];
      for (const asset of response.data.assets) {
        droppedAssets.push(
          new DroppedAsset(this.topia, asset.id, this.urlSlug, {
            attributes: asset,
            credentials: this.credentials,
          }),
        );
      }
      return droppedAssets;
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { sceneDropId, uniqueName },
        sdkMethod: "World.fetchDroppedAssetsBySceneDropId",
      });
    }
  }

  /**
   * Update multiple custom text dropped assets with a single style while preserving text for specified dropped assets only.
   *
   * @category Dropped Assets
   *
   * @example
   * ```ts
   * const droppedAssetsToUpdate = [world.droppedAssets["6"], world.droppedAssets["12"]];
   * const style = {
   *   "textColor": "#abc123",
   *   "textFontFamily": "Arial",
   *   "textSize": 40,
   *   "textWeight": "normal",
   *   "textWidth": 200
   * };
   * await world.updateCustomText(droppedAssetsToUpdate, style);
   * ```
   *
   * @returns
   * Updates each DroppedAsset instance and world.droppedAssets map.
   */
  async updateCustomTextDroppedAssets(droppedAssetsToUpdate: Array<DroppedAsset>, style: object): Promise<object> {
    const allPromises: Array<Promise<void | ResponseType>> = [];
    droppedAssetsToUpdate.forEach((a) => {
      allPromises.push(a.updateCustomTextAsset(style, a.text));
    });
    const outcomes = await Promise.all(allPromises);
    return outcomes;
  }

  /**
   * Retrieve all landmark zone assets dropped in a world.
   *
   * @category Dropped Assets
   *
   * @example
   * ```ts
   * const zones = await world.fetchLandmarkZones("optionalLandmarkZoneName", "optionalSceneDropIdExample");
   * ```
   *
   * @returns {Promise<DroppedAsset[]>} Returns an array of DroppedAsset instances.
   */
  async fetchLandmarkZones(landmarkZoneName?: string, sceneDropId?: string): Promise<DroppedAsset[]> {
    try {
      let queryParams = "";
      if (landmarkZoneName) {
        queryParams = `?landmarkZoneName=${landmarkZoneName}`;
        if (sceneDropId) queryParams += `&sceneDropId=${sceneDropId}`;
      } else if (sceneDropId) {
        queryParams = `?sceneDropId=${sceneDropId}`;
      }
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/landmark-zones${queryParams}`,
        this.requestOptions,
      );
      const droppedAssets: DroppedAsset[] = [];
      for (const asset of response.data.assets) {
        droppedAssets.push(
          new DroppedAsset(this.topia, asset.id, this.urlSlug, {
            attributes: asset,
            credentials: this.credentials,
          }),
        );
      }
      return droppedAssets;
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { landmarkZoneName, sceneDropId },
        sdkMethod: "World.fetchLandmarkZones",
      });
    }
  }

  // scenes
  /**
   * @deprecated Use {@link fetchScenes} instead.
   *
   * Fetch a list of all scene drop ids in a world that include at least one asset with an interactivePublicKey
   *
   * @example
   * ```ts
   * await world.fetchSceneDropIds();
   * ```
   *
   * @returns
   * ```ts
   * { sceneDropIds: [] }
   * ```
   */
  async fetchSceneDropIds(): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/scenes`,
        this.requestOptions,
      );
      this.sceneDropIds = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "World.fetchSceneDropIds" });
    }
  }

  /**
   * Fetch a list of all scene drop ids and dropped assets in a world
   *
   * @category Scenes
   *
   * @example
   * ```ts
   * await world.fetchScenes();
   * ```
   *
   * @returns
   * ```ts
   * { "scenes": {
   *     "sceneDropId_1": {
   *         "droppedAssets": {
   *             "droppedAssetId_1": {
   *                 "metaName": "hello"
   *                 "metaNameReversed": "olleh"
   *             },
   *             "droppedAssetId_2": {
   *                 "metaName": "world"
   *                 "metaNameReversed": "dlorw"
   *             }
   *         }
   *     },
   *   }
   * }
   * ```
   */
  async fetchScenes(): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/scenes-with-dropped-assets`,
        this.requestOptions,
      );
      this.scenes = response.data.scenes;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "World.fetchScenes" });
    }
  }

  /**
   * Drops a scene in a world and returns sceneDropId.
   *
   * @category Scenes
   *
   * @example
   * ```ts
   * await world.dropScene({
   *   "sceneId": "string",
   *   "position": {
   *     "x": 0,
   *     "y": 0
   *   },
   *   "assetSuffix": "string"
   * });
   * ```
   *
   * @returns
   * ```ts
   * { sceneDropId: sceneId-timestamp, success: true }
   * ```
   */
  async dropScene({
    allowNonAdmins,
    assetSuffix,
    position,
    sceneDropId,
    sceneId,
  }: {
    allowNonAdmins?: boolean;
    assetSuffix?: string;
    position: object;
    sceneDropId?: string;
    sceneId: string;
  }): Promise<ResponseType> {
    const params = { allowNonAdmins, assetSuffix, position, sceneDropId, sceneId };
    try {
      const result = await this.topiaPublicApi().post(`/world/${this.urlSlug}/drop-scene`, params, this.requestOptions);
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "World.dropScene" });
    }
  }

  /**
   * Replace the current scene of a world.
   *
   * @category Scenes
   *
   * @example
   * ```ts
   * const droppedAssetsToUpdate = [world.droppedAssets["6"], world.droppedAssets["12"]]
   * const style = {
   *   "textColor": "#abc123",
   *   "textFontFamily": "Arial",
   *   "textSize": 40,
   *   "textWeight": "normal",
   *   "textWidth": 200
   * }
   * await world.replaceScene(SCENE_ID);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async replaceScene(sceneId: string): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(`/world/${this.urlSlug}/change-scene`, { sceneId }, this.requestOptions);
    } catch (error) {
      throw this.errorHandler({ error, params: { sceneId }, sdkMethod: "World.replaceScene" });
    }
  }

  /**
   * Get all particles available
   *
   * @category Particles
   *
   * @example
   * ```ts
   * await world.getAllParticles();
   *
   * @returns {Promise<ResponseType>} Returns an array of particles or an error response.
   * ```
   */
  async getAllParticles(): Promise<object | ResponseType> {
    try {
      const result = await this.topiaPublicApi().get(`/particles`, this.requestOptions);
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: {}, sdkMethod: "World.getAllParticles" });
    }
  }

  /**
   * Trigger a particle effect at a position in the world
   *
   * @category Particles
   *
   * @example
   * ```ts
   * await world.triggerParticle({ name: "Flame" });
   * ```
   *
   * @returns {Promise<ResponseType | string>} Returns `{ success: true }` or a message if no particleId is found.
   */
  async triggerParticle({
    id,
    name,
    duration = 10,
    position = { x: 1, y: 1 },
  }: {
    id?: string;
    name?: string;
    duration?: number;
    position?: object;
  }): Promise<ResponseType | string> {
    if (!id && !name) throw "A particle name is required.";
    try {
      let particleId = id;
      if (name) {
        const response = await this.topiaPublicApi().get(`/particles?name=${name}`, this.requestOptions);
        particleId = response?.data[0]?.id;
      }
      if (!particleId) return "No particleId found.";

      const result = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/particles`,
        { particleId, position, duration },
        this.requestOptions,
      );
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { id, name }, sdkMethod: "World.triggerParticle" });
    }
  }

  /**
   * Add an activity to a world
   * excludeFromNotification is an array of visitorIds to exclude from the notification
   *
   * @example
   * ```ts
   * await world.triggerActivity({ type: "GAME_ON", assetId: "abc123" });
   * ```
   *
   * @returns {Promise<ResponseType | string>} Returns the `activityId` or an error response.
   */
  async triggerActivity({
    type,
    assetId,
    excludeFromNotification,
  }: {
    type: WorldActivityType;
    assetId: string;
    excludeFromNotification?: (string | number)[];
  }): Promise<ResponseType | string> {
    try {
      const result = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/set-activity`,
        { type, assetId, excludeFromNotification },
        this.requestOptions,
      );
      return result.data;
    } catch (error) {
      // TODO: don't throw error if status 409
      throw this.errorHandler({ error, params: { type }, sdkMethod: "World.triggerActivity" });
    }
  }

  /**
   * Display a message via a toast to all visitors currently in a world.
   *
   * @example
   * ```ts
   * await world.fireToast({
   *   groupId: "custom-message",
   *   title: "Hello World",
   *   text: "Thank you for participating!",
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType> {
    const params = {
      groupId,
      title,
      text,
    };
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/fire-toast`,
        params,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "Visitor.fireToast" });
    }
  }

  ////////// data objects
  /**
   * Retrieves the data object for a world. Must have valid interactive credentials from a visitor in the world.
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await world.fetchDataObject();
   * const { dataObject } = world;
   * ```
   */
  fetchDataObject = async (appPublicKey?: string, appJWT?: string): Promise<void | ResponseType> => {
    try {
      let query = "";
      if (appPublicKey) query = `?appPublicKey=${appPublicKey}&appJWT=${appJWT}`;
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/get-data-object${query}`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "World.fetchDataObject" });
    }
  };

  /**
   * Sets the data object for a user. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   * 
   * @example
   * ```ts
    await world.setDataObject(
      {
        ...defaultGameData,
        keyAssetId: droppedAsset.id,
      },
      { lock: { lock: { lockId: `${keyAssetId}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` }, releaseLock: true } },
    );
   * const { profileMapper } = world.dataObject;
   * ```
   */
  setDataObject = async (
    dataObject: object | null | undefined,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> => {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/set-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "World.setDataObject" });
    }
  };

  /**
   * Updates the data object for a world. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await world.updateDataObject({
   *   [`keyAssets.${keyAssetId}.itemsCollectedByUser.${profileId}`]: { [dateKey]: { count: 1 }, total: 1 },
   *   [`profileMapper.${profileId}`]: username,
   * });
   * const { profileMapper } = world.dataObject;
   * ```
   */
  updateDataObject = async (
    dataObject: object,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> => {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/update-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );
      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "World.updateDataObject" });
    }
  };

  /**
   * Increments a specific value in the data object for a world by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await world.incrementDataObjectValue([`keyAssets.${keyAssetId}.totalItemsCollected.count`], 1);
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
        `/world/${this.urlSlug}/increment-data-object-value`,
        { path, amount, ...options },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { path, amount, options },
        sdkMethod: "World.incrementDataObjectValue",
      });
    }
  }

  ////////// webhooks
  /**
   * Retrieve all webhooks in a world.
   *
   * @category Webhooks
   *
   * @example
   * ```ts
   * await world.fetchWebhooks();
   * const webhooks = world.webhooks;
   * ```
   */
  async fetchWebhooks(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/webhooks`,
        this.requestOptions,
      );
      this.webhooks = response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "World.fetchWebhooks" });
    }
  }

  ////////// analytics
  /**
   * Retrieve world analytics by day, week, month, quarter, or year
   *
   * @category Analytics
   *
   * @example
   * ```ts
   * const analytics = await world.fetchWorldAnalytics({
   *   periodType: "week",
   *   dateValue: 40,
   *   year: 2023,
   * });
   * ```
   */
  async fetchWorldAnalytics({
    periodType,
    dateValue,
    year,
  }: {
    periodType: "week" | "month" | "quarter" | "year";
    dateValue: number;
    year: number;
  }): Promise<void | ResponseType> {
    try {
      let query = "";
      switch (periodType) {
        case "week":
          query = `&week=W${dateValue}`;
          break;
        case "month":
          query = `&month=${dateValue}`;
          break;
        case "quarter":
          query = `&quarter=Q${dateValue}`;
          break;
        default:
          "";
      }
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/world-analytics?year=${year}${query}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { periodType, dateValue, year },
        sdkMethod: "World.fetchWorldAnalytics",
      });
    }
  }
}

export default World;
