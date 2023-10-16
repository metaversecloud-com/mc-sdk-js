import { AxiosResponse } from "axios";

// controllers
import { DroppedAsset } from "controllers/DroppedAsset";
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { WorldInterface, WorldDetailsInterface, WorldOptionalInterface, WorldWebhooksInterface } from "interfaces";

// types
import { ResponseType } from "types";

// utils
import { removeUndefined } from "utils";

/**
 * @summary
 * Create an instance of World class with a given url slug and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new World(topia, "exampleWorld", { attributes: { name: "Example World" } });
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
    super(topia, { urlSlug, ...options.credentials });
    Object.assign(this, options.attributes);
    this.urlSlug = urlSlug;
    this.#droppedAssetsMap = {};
  }

  get droppedAssets() {
    return this.#droppedAssetsMap;
  }

  //////// world details
  /**
   * @summary
   * Retrieves details of a world.
   *
   * @usage
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
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Update details of a world.
   *
   * @usage
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
      throw this.errorHandler({ error, params });
    }
  }

  ////////// dropped assets
  /**
   * @summary
   * Retrieve all assets dropped in a world.
   *
   * @usage
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
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Retrieve all assets dropped in a world matching uniqueName.
   *
   * @usage
   * ```ts
   * await world.fetchDroppedAssetsWithUniqueName();
   * const assets = world.droppedAssets;
   * ```
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
      throw this.errorHandler({ error, params: { uniqueName, isPartial, isReversed } });
    }
  }

  /**
   * @summary
   * Retrieve all assets dropped in a world matching sceneDropId.
   *
   * @usage
   * ```ts
   * await world.fetchDroppedAssetsBySceneDropId({
   *   sceneDropId: "sceneDropIdExample",
   *   uniqueName: "optionalUniqueNameExample",
   * });
   * const assets = world.droppedAssets;
   * ```
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
        `/world/${this.urlSlug}/assets-with-scene-drop-id/${sceneDropId}?${
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
      throw this.errorHandler({ error, params: { sceneDropId, uniqueName } });
    }
  }

  /**
   * @summary
   * Update multiple custom text dropped assets with a single style while preserving text for specified dropped assets only.
   *
   * @usage
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
   * @result
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
   * @deprecated Use {@link fetchScenes} instead.
   *
   * @summary
   * Fetch a list of all scene drop ids in a world that include at least one asset with an interactivePublicKey
   *
   * @usage
   * ```ts
   * await world.fetchSceneDropIds();
   * ```
   *
   * @result
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
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Fetch a list of all scene drop ids and dropped assets in a world
   *
   * @usage
   * ```ts
   * await world.fetchScenes();
   * ```
   *
   * @result
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
      this.scenes = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Drops a scene in a world and returns sceneDropId.
   *
   * @usage
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
   * @result
   * ```ts
   * { sceneDropId: sceneId-timestamp, success: true }
   * ```
   */
  async dropScene({
    assetSuffix,
    position,
    sceneId,
  }: {
    assetSuffix: string;
    position: object;
    sceneId: string;
  }): Promise<object | ResponseType> {
    const params = { assetSuffix, position, sceneId };
    try {
      const result = await this.topiaPublicApi().post(`/world/${this.urlSlug}/drop-scene`, params, this.requestOptions);
      return result;
    } catch (error) {
      throw this.errorHandler({ error, params });
    }
  }

  /**
   * @summary
   * Replace the current scene of a world.
   *
   * @usage
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
   */
  async replaceScene(sceneId: string): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(`/world/${this.urlSlug}/change-scene`, { sceneId }, this.requestOptions);
    } catch (error) {
      throw this.errorHandler({ error, params: { sceneId } });
    }
  }

  ////////// data objects
  /**
   * @summary
   * Retrieves the data object for a world. Must have valid interactive credentials from a visitor in the world.
   *
   * @usage
   * ```ts
   * await world.fetchDataObject();
   * const { dataObject } = world;
   * ```
   */
  fetchDataObject = async (): Promise<void | ResponseType> => {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/get-data-object`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };

  /**
   * @summary
   * Sets the data object for a user. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await world.setDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * const { dataObject } = world;
   * ```
   */
  setDataObject = async (
    dataObject: object | null | undefined,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> => {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/set-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options } });
    }
  };

  /**
   * @summary
   * Updates the data object for a world. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await world.updateDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * const { dataObject } = world;
   * ```
   */
  updateDataObject = async (
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> => {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/update-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );
      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options } });
    }
  };

  /**
   * @summary
   * Increments a specific value in the data object for a world by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await world.incrementDataObjectValue(
   *   "path": "key",
   *   "amount": 1,
   * );
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/increment-data-object-value`,
        { path, amount, lock },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { path, amount, options } });
    }
  }

  ////////// webhooks
  /**
   * @summary
   * Retrieve all webhooks in a world.
   *
   * @usage
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
      throw this.errorHandler({ error });
    }
  }

  ////////// analytics
  /**
   * @summary
   * Retrieve world analytics by day, week, month, quarter, or year
   *
   * @usage
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
        case "month":
          query = `&month=${dateValue}`;
        case "quarter":
          query = `&quarter=Q${dateValue}`;
      }
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/world-analytics?year=${year}${query}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { periodType, dateValue, year } });
    }
  }
}

export default World;
