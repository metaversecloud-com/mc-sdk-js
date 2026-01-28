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

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., World).
    - Consumers obtain controller instances via factory methods (e.g., WorldFactory.get).
    - This SDK is installed as an NPM package (@rtsdk/topia) in consumer applications.

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - Do NOT mutate controller shape or return ad-hoc fields.

  AVAILABLE METHODS:
    - fetchDetails(): Retrieves world details and settings
    - updateDetails(options): Updates world settings (name, description, size, spawn position, controls)
    - updateCloseWorldSettings(options): Updates world close/open settings
    - fetchDroppedAssets(): Gets all dropped assets in the world
    - fetchDroppedAssetsWithUniqueName(uniqueName): Gets dropped assets by unique name
    - fetchDroppedAssetsBySceneDropId(sceneDropId): Gets dropped assets by scene drop ID
    - updateCustomTextDroppedAssets(assets, style): Bulk updates text styling for assets
    - fetchLandmarkZones(landmarkZoneName?, sceneDropId?): Gets landmark zones in the world
    - fetchSceneDropIds(): Retrieves all scene drop IDs in the world
    - fetchScenes(): Gets all scenes used in the world
    - dropScene(options): Drops a scene into the world
    - replaceScene(sceneId): Replaces entire world with a scene
    - getAllParticles(): Gets all particle effects in the world
    - triggerParticle(options): Triggers a particle effect
    - triggerActivity(options): Triggers a world activity event
    - fireToast(options): Shows toast notification to all visitors
    - fetchDataObject(): Gets world's data object
    - setDataObject(dataObject, options?): Sets world's entire data object
    - updateDataObject(dataObject, options?): Updates specific fields in world data
    - incrementDataObjectValue(path, amount, options?): Increments numeric value
    - fetchWebhooks(): Gets all webhooks configured for the world
    - fetchWorldAnalytics(options): Retrieves analytics data for the world

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, WorldFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const World = new WorldFactory(topia);

    // controllers/myController.ts (consumer app)
    import { World } from "utils/topiaInit.ts";
    const world = await World.create(urlSlug, { credentials });
    await world.fetchDetails();

============================================================================ */

/**
 * Create an instance of World class with a given url slug and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { World } from "utils/topiaInit.ts";
 *
 * const world = await World.create(exampleUrlSlug, {
 *   attributes: { name: "Example World" },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
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
   * @keywords get, fetch, retrieve, details, info, information, world
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
   * @keywords update, modify, change, edit, world, settings, details
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
   * @keywords update, modify, change, edit, world, settings, details, close, closed
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
   * @keywords get, fetch, retrieve, list, current, dropped assets
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
   * @keywords get, fetch, retrieve, list, current, dropped assets, uniqueName
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
   * @keywords get, fetch, retrieve, list, current, dropped assets, sceneDropId
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
      // Validate sceneDropId to prevent dangerous queries that could match unintended assets
      if (
        !sceneDropId ||
        typeof sceneDropId !== "string" ||
        sceneDropId.trim() === "" ||
        sceneDropId === "undefined" ||
        sceneDropId === "null"
      ) {
        throw this.errorHandler({
          message:
            "A valid sceneDropId is required. Received an empty, undefined, or invalid sceneDropId which could match unintended assets.",
        });
      }
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
   * @keywords update, modify, change, edit, dropped assets, custom text, style, text
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
   * @keywords get, fetch, retrieve, list, landmark, zones, dropped assets
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
   * @keywords get, fetch, retrieve, list, scenes
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
   * @keywords drop, add, place, scene
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
   * @keywords replace, change, scene
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
   * @keywords get, fetch, retrieve, list, particles
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
   * @keywords trigger, start, play, particle, effect
   *
   * @category Particles
   *
   * @example
   * ```ts
   * const droppedAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });
   *
   * await world.triggerParticle({ name: "Flame", duration: 5, position: droppedAsset.position });
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
   * @keywords start, trigger, activity
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
   * @keywords send, display, show, toast, message, notification
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
   * @keywords get, fetch, retrieve, load, data, object, state
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await world.fetchDataObject();
   * const { dataObject } = world;
   * ```
   */
  fetchDataObject = async (
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType> => {
    try {
      let query = "";
      if (appPublicKey) query = `?appPublicKey=${appPublicKey}&appJWT=${appJWT}`;
      else if (sharedAppPublicKey) query = `?sharedAppPublicKey=${sharedAppPublicKey}&sharedAppJWT=${sharedAppJWT}`;

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
   * @keywords set, assign, store, save, data, object, state
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
   * @keywords update, modify, change, edit, alter, data, object, state
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
   * @keywords increment, increase, add, count, data, object, state
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
   * @keywords get, fetch, retrieve, list, current, webhooks
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
   * @keywords get, fetch, retrieve, analytics, stats, statistics, data, metrics
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
