import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI, removeUndefined, scatterVisitors } from "utils";
import { DroppedAsset } from "controllers/DroppedAsset";
import { Visitor } from "controllers/Visitor";
import { VisitorsToMoveArrayType } from "types";
import { MoveAllVisitorsInterface, WorldDetailsInterface } from "interfaces";

/**
 * Create an instance of World class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new World({ apiKey: API_KEY, urlSlug: "magic" });
 * ```
 */
export class World implements WorldDetailsInterface {
  #droppedAssetsMap: { [key: string]: DroppedAsset };
  #visitorsMap: { [key: string]: Visitor };
  apiKey: string;
  urlSlug: string;

  constructor({ apiKey, args, urlSlug }: { apiKey: string; args: WorldDetailsInterface; urlSlug: string }) {
    Object.assign(this, args);
    this.#droppedAssetsMap = {};
    this.#visitorsMap = {};
    this.apiKey = apiKey;
    this.urlSlug = urlSlug;
  }

  get droppedAssets() {
    return this.#droppedAssetsMap;
  }

  get visitors() {
    return this.#visitorsMap;
  }

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
  // world details
  fetchDetails(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/world-details`)
        .then((response: AxiosResponse) => {
          Object.assign(this, response.data);
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
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
  updateDetails({
    controls,
    description,
    forceAuthOnLogin,
    height,
    name,
    spawnPosition,
    width,
  }: WorldDetailsInterface): Promise<string> {
    const payload: any = {
      controls,
      description,
      forceAuthOnLogin,
      height,
      name,
      spawnPosition,
      width,
    };
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/world-details`, payload)
        .then(() => {
          const cleanPayload = removeUndefined(payload);
          Object.assign(this, cleanPayload);
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  // visitors
  private fetchVisitors(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/visitors`)
        .then((response: AxiosResponse) => {
          // create temp map and then update private property only once
          const tempVisitorsMap: { [key: string]: Visitor } = {};
          for (const playerId in response.data) {
            tempVisitorsMap[playerId] = new Visitor({
              apiKey: this.apiKey,
              args: response.data[playerId],
              urlSlug: this.urlSlug,
            });
          }
          this.#visitorsMap = tempVisitorsMap;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  /**
   * @summary
   * Retrieve all visitors currently in a world.
   *
   * @usage
   * ```ts
   * const visitors = await world.currentVisitors();
   * ```
   */
  async currentVisitors() {
    try {
      await this.fetchVisitors();
      return this.visitors;
    } catch (error) {
      return error;
    }
  }

  /**
   * @summary
   * Move all visitors currently in a world to a single set of coordinates.
   * Optionally refetch visitors, teleport or walk visitors to new location,
   * and scatter visitors by any number so that they don't all move to the exact same location.
   *
   * @usage
   * ```ts
   * await world.moveAllVisitors({
   *   shouldFetchVisitors: true,
   *   shouldTeleportVisitors: true,
   *   scatterVisitorsBy: 40,
   *   x: 100,
   *   y: 100,
   * });
   * ```
   *
   * @result
   * Updates each Visitor instance and world.visitors map.
   */
  async moveAllVisitors({
    shouldFetchVisitors = true,
    shouldTeleportVisitors = true,
    scatterVisitorsBy = 0,
    x,
    y,
  }: MoveAllVisitorsInterface) {
    if (shouldFetchVisitors) await this.fetchVisitors();
    const allPromises: Array<Promise<string>> = [];
    if (!this.visitors) return;
    const objectKeys = Object.keys(this.visitors);
    objectKeys.forEach((key) =>
      allPromises.push(
        this.#visitorsMap[key].moveVisitor(
          shouldTeleportVisitors,
          scatterVisitors(x, scatterVisitorsBy),
          scatterVisitors(y, scatterVisitorsBy),
        ),
      ),
    );
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }

  /**
   * @summary
   * Teleport or walk a list of visitors currently in a world to various coordinates.
   *
   * @usage
   * ```ts
   * const visitorsToMove = [
   *   {
   *     visitorObj: world.visitors["1"],
   *     shouldTeleportVisitor: true,
   *     x: 100,
   *     y: 100
   *   }, {
   *     visitorObj: world.visitors["2"],
   *     shouldTeleportVisitor: false,
   *     x: 100,
   *     y: 100
   *   }
   * ];
   * await world.moveVisitors(visitorsToMove);
   * ```
   *
   * @result
   * Updates each Visitor instance and world.visitors map.
   */
  async moveVisitors(visitorsToMove: VisitorsToMoveArrayType) {
    const allPromises: Array<Promise<string>> = [];
    visitorsToMove.forEach((v) => {
      allPromises.push(v.visitorObj.moveVisitor(v.shouldTeleportVisitor, v.x, v.y));
    });
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }

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
  // dropped assets
  fetchDroppedAssets(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/assets`)
        .then((response: AxiosResponse) => {
          // create temp map and then update private property only once
          const tempDroppedAssetsMap: { [key: string]: DroppedAsset } = {};
          for (const id in response.data) {
            // tempDroppedAssetsMap[id] = createDroppedAsset(this.apiKey, response.data[id], this.urlSlug);
            tempDroppedAssetsMap[id] = new DroppedAsset({
              apiKey: this.apiKey,
              id,
              args: response.data[id],
              urlSlug: this.urlSlug,
            });
          }
          this.#droppedAssetsMap = tempDroppedAssetsMap;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
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
   * await world.moveVisitors(droppedAssetsToUpdate, style);
   * ```
   *
   * @result
   * Updates each DroppedAsset instance and world.droppedAssets map.
   */
  async updateCustomTextDroppedAssets(droppedAssetsToUpdate: Array<DroppedAsset>, style: object): Promise<object> {
    const allPromises: Array<Promise<string>> = [];
    droppedAssetsToUpdate.forEach((a) => {
      allPromises.push(a.updateCustomText(style, a.text));
    });
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
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
  // scenes
  replaceScene(sceneId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/change-scene`, { sceneId })
        .then(() => {
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default World;
