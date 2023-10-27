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
 * @summary
 * Create an instance of WorldActivity class with a given url slug and optional attributes and session credentials.
 *
 * This class is responsible for all activity of a specified world including editing dropped assets, moving current visitors, etc.
 *
 * @usage
 * ```ts
 * await new WorldActivity(topia, "exampleWorld", {
 *   attributes: { name: "Example World" },
 *   credentials: { apiKey: "exampleKey", interactiveNonce: "exampleNonce", urlSlug: "exampleWorld", visitorId: 1 }
 * });
 * ```
 */
export class WorldActivity extends SDKController {
  urlSlug: string;
  #visitorsMap: { [key: string]: Visitor };

  constructor(topia: Topia, urlSlug: string, options: WorldActivityOptionalInterface = { credentials: {} }) {
    super(topia, {
      apiKey: options?.credentials?.apiKey,
      interactiveNonce: options?.credentials?.interactiveNonce,
      urlSlug,
      visitorId: options?.credentials?.visitorId,
    });
    this.urlSlug = urlSlug;
    this.#visitorsMap = {};
  }

  get visitors() {
    return this.#visitorsMap;
  }

  //////// visitors
  private async fetchVisitors(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors`,
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
      throw this.errorHandler({ error, sdkMethod: "WorldActivity.currentVisitors" });
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
}

export default WorldActivity;
