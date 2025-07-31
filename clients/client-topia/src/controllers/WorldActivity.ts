import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";
import { Visitor } from "controllers/Visitor";

// interfaces
import { MoveAllVisitorsInterface, WorldActivityOptionalInterface } from "interfaces";

// types
import { ResponseType, VisitorsToMoveArrayType } from "types";

// utils
import { scatterVisitors } from "utils";

/**
 * Create an instance of WorldActivity class with a given url slug and optional attributes and session credentials.
 *
 * @remarks
 * This class is responsible for all activity of a specified world including editing dropped assets, moving current visitors, etc.
 *
 * @example
 * ```ts
 * const activity = await new WorldActivity(topia, "exampleWorld", {
 *   attributes: { name: "Example World" },
 *   credentials: { interactiveNonce: "exampleNonce", assetId: "droppedAssetId", visitorId: 1, urlSlug: "exampleWorld" }
 * });
 * ```
 */
export class WorldActivity extends SDKController {
  urlSlug: string;
  #visitorsMap: { [key: string]: Visitor };

  constructor(topia: Topia, urlSlug: string, options: WorldActivityOptionalInterface = { credentials: {} }) {
    super(topia, { urlSlug: options?.credentials?.urlSlug || urlSlug, ...options.credentials });
    this.urlSlug = urlSlug;
    this.#visitorsMap = {};
  }

  get visitors() {
    return this.#visitorsMap;
  }

  //////// visitors
  private async fetchVisitors({
    droppedAssetId,
    shouldIncludeAdminPermissions,
  }: {
    droppedAssetId?: string;
    shouldIncludeAdminPermissions?: boolean;
  }): Promise<void | ResponseType> {
    try {
      let queryParams = "";
      if (droppedAssetId) {
        queryParams = `?droppedAssetId=${droppedAssetId}`;
        if (shouldIncludeAdminPermissions)
          queryParams += `&shouldIncludeAdminPermissions=${shouldIncludeAdminPermissions}`;
      } else if (shouldIncludeAdminPermissions) {
        queryParams = `?shouldIncludeAdminPermissions=${shouldIncludeAdminPermissions}`;
      }
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors${queryParams}`,
        this.requestOptions,
      );
      // create temp map and then update private property only once
      const tempVisitorsMap: { [key: string]: Visitor } = {};
      for (const id in response.data) {
        tempVisitorsMap[id] = new Visitor(this.topia, response.data[id].visitorId, this.urlSlug, {
          attributes: response.data[id],
          credentials: this.credentials,
        });
      }
      this.#visitorsMap = tempVisitorsMap;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "WorldActivity.fetchVisitors" });
    }
  }

  /**
   * Retrieve all visitors currently in a world.
   *
   * @category Visitors
   *
   * @example
   * ```ts
   * const visitors = await worldActivity.currentVisitors("exampleLandmarkZoneId", true);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the an object containing current visitors keyed by visitorId or an error.
   */
  async currentVisitors(shouldIncludeAdminPermissions?: boolean) {
    try {
      await this.fetchVisitors({ shouldIncludeAdminPermissions });
      return this.visitors;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "WorldActivity.currentVisitors" });
    }
  }

  /**
   * Retrieve all visitors currently in a Landmark Zone.
   *
   * @category Visitors
   *
   * @example
   * ```ts
   * const visitors = await worldActivity.fetchVisitorsInZone({ droppedAssetId: "exampleDroppedAssetId" });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the an object containing current visitors keyed by visitorId or an error.
   */
  async fetchVisitorsInZone({
    droppedAssetId,
    shouldIncludeAdminPermissions,
  }: {
    droppedAssetId?: string;
    shouldIncludeAdminPermissions?: boolean;
  }) {
    try {
      if (!droppedAssetId) throw "A landmark zone id (droppedAssetId) is required.";
      await this.fetchVisitors({ droppedAssetId, shouldIncludeAdminPermissions });
      return this.visitors;
    } catch (error) {
      throw this.errorHandler({ error, params: { droppedAssetId }, sdkMethod: "WorldActivity.fetchVisitorsInZone" });
    }
  }

  /**
   * Move all visitors currently in a world to a single set of coordinates.
   *
   * @remarks
   * Optionally refetch visitors, teleport or walk visitors to new location,
   * and scatter visitors by any number so that they don't all move to the exact same location.
   *
   * @category Visitors
   *
   * @example
   * ```ts
   * await worldActivity.moveAllVisitors({
   *   shouldFetchVisitors: true,
   *   shouldTeleportVisitors: true,
   *   scatterVisitorsBy: 40,
   *   x: 100,
   *   y: 100,
   * });
   * ```
   *
   * @returns
   * Updates each Visitor instance and worldActivity.visitors map.
   */
  async moveAllVisitors({
    shouldFetchVisitors = true,
    shouldTeleportVisitors = true,
    scatterVisitorsBy = 0,
    x,
    y,
  }: MoveAllVisitorsInterface) {
    if (shouldFetchVisitors) await this.fetchVisitors({});
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
   * Teleport or walk a list of visitors currently in a world to various coordinates.
   *
   * @category Visitors
   *
   * @example
   * ```ts
   * const visitorsToMove = [
   *   {
   *     visitorObj: worldActivity.visitors["1"],
   *     shouldTeleportVisitor: true,
   *     x: 100,
   *     y: 100
   *   }, {
   *     visitorObj: worldActivity.visitors["2"],
   *     shouldTeleportVisitor: false,
   *     x: 100,
   *     y: 100
   *   }
   * ];
   * await worldActivity.moveVisitors(visitorsToMove);
   * ```
   *
   * @returns
   * Updates each Visitor instance and worldActivity.visitors map.
   */
  async moveVisitors(visitorsToMove: VisitorsToMoveArrayType) {
    const allPromises: Array<Promise<void | ResponseType>> = [];
    visitorsToMove.forEach((v) => {
      allPromises.push(v.visitorObj.moveVisitor({ shouldTeleportVisitor: v.shouldTeleportVisitor, x: v.x, y: v.y }));
    });
    const outcomes = await Promise.all(allPromises);
    return outcomes;
  }
}

export default WorldActivity;
