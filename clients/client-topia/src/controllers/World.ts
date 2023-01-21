import { AxiosResponse } from "axios";

// controllers
import { DroppedAsset } from "controllers/DroppedAsset";
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";
import { Visitor } from "controllers/Visitor";

// interfaces
import { MoveAllVisitorsInterface, WorldInterface, WorldOptionalInterface } from "interfaces";

// types
import { ResponseType, VisitorsToMoveArrayType } from "types";

// utils
import { removeUndefined, scatterVisitors } from "utils";

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
  #droppedAssetsMap: { [key: string]: DroppedAsset };
  #visitorsMap: { [key: string]: Visitor };
  urlSlug: string;

  constructor(topia: Topia, urlSlug: string, options: WorldOptionalInterface = { attributes: {}, credentials: {} }) {
    super(topia, options.credentials);
    Object.assign(this, options.attributes);
    this.#droppedAssetsMap = {};
    this.#visitorsMap = {};
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
  }: WorldInterface): Promise<void | ResponseType> {
    const payload = {
      controls,
      description,
      forceAuthOnLogin,
      height,
      name,
      spawnPosition,
      width,
    };
    try {
      await this.topiaPublicApi().put(`/world/${this.urlSlug}/world-details`, payload, this.requestOptions);
      const cleanPayload = removeUndefined(payload);
      Object.assign(this, cleanPayload);
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  // visitors
  private async fetchVisitors(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors`,
        this.requestOptions,
      );
      // create temp map and then update private property only once
      const tempVisitorsMap: { [key: string]: Visitor } = {};
      for (const id in response.data) {
        tempVisitorsMap[id] = new Visitor(this.topia, response.data[id].playerId, this.urlSlug, {
          attributes: response.data[id],
        });
      }
      this.#visitorsMap = tempVisitorsMap;
    } catch (error) {
      throw this.errorHandler({ error });
    }
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
    const allPromises: Array<Promise<void | ResponseType>> = [];
    if (!this.visitors) return;
    const objectKeys = Object.keys(this.visitors);
    objectKeys.forEach((key) =>
      allPromises.push(
        this.#visitorsMap[key].moveVisitor({
          shouldTeleportVisitor: shouldTeleportVisitors,
          x: scatterVisitors(x, scatterVisitorsBy),
          y: scatterVisitors(y, scatterVisitorsBy),
        }),
      ),
    );
    const outcomes = await Promise.all(allPromises);
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
    const allPromises: Array<Promise<void | ResponseType>> = [];
    visitorsToMove.forEach((v) => {
      allPromises.push(v.visitorObj.moveVisitor({ shouldTeleportVisitor: v.shouldTeleportVisitor, x: v.x, y: v.y }));
    });
    const outcomes = await Promise.all(allPromises);
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
  async fetchDroppedAssets(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets`,
        this.requestOptions,
      );
      // create temp map and then update private property only once
      const tempDroppedAssetsMap: { [key: string]: DroppedAsset } = {};
      for (const index in response.data) {
        // tempDroppedAssetsMap[id] = createDroppedAsset(this.apiKey, response.data[id], this.urlSlug);
        tempDroppedAssetsMap[index] = new DroppedAsset(this.topia, response.data[index].id, this.urlSlug, {
          attributes: response.data[index],
        });
      }
      this.#droppedAssetsMap = tempDroppedAssetsMap;
    } catch (error) {
      throw this.errorHandler({ error });
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
  async replaceScene(sceneId: string): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(`/world/${this.urlSlug}/change-scene`, { sceneId }, this.requestOptions);
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
   * await world.fetchDroppedAssets();
   * const assets = world.droppedAssets;
   * ```
   */
  // dropped assets
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
          }),
        );
      }
      return droppedAssets;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }
}

export default World;
