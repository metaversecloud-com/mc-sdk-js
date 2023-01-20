// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { MoveVisitorInterface, VisitorInterface, VisitorOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

// utils
import { getErrorResponse } from "utils";

/**
 * @summary
 * Create an instance of Visitor class with a given id and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new Visitor(topia, id, urlSlug, { attributes: { moveTo: { x: 0, y: 0 } } });
 * ```
 */
export class Visitor extends SDKController implements VisitorInterface {
  readonly id: number;
  urlSlug: string;

  constructor(
    topia: Topia,
    id: number,
    urlSlug: string,
    options: VisitorOptionalInterface = { attributes: {}, credentials: {} },
  ) {
    super(topia, options.credentials);
    Object.assign(this, options.attributes);
    this.id = id;
    this.urlSlug = urlSlug;
  }

  /**
   * @summary
   * Get a single visitor from a world
   *
   * @usage
   * ```ts
   * await visitor.fetchVisitor();
   * ```
   *
   * @result
   * Updates each Visitor instance and world.visitors map.
   */
  async fetchVisitor(): Promise<void | ResponseType> {
    try {
      const response = await this.topia.axios.get(`/world/${this.urlSlug}/visitors/${this.id}`, this.requestOptions);
      if (response.data.success) {
        Object.assign(this, response.data).players[0];
      } else {
        throw "This visitor is not active";
      }
    } catch (error) {
      throw getErrorResponse({ error });
    }
  }

  /**
   * @summary
   * Teleport or walk a visitor currently in a world to a single set of coordinates.
   *
   * @usage
   * ```ts
   * await visitor.moveVisitor({
   *   shouldTeleportVisitor: true,
   *   x: 100,
   *   y: 100,
   * });
   * ```
   *
   * @result
   * Updates each Visitor instance and world.visitors map.
   */
  async moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType> {
    try {
      await this.topia.axios.put(
        `/world/${this.urlSlug}/visitors/${this.id}/move`,
        {
          moveTo: {
            x,
            y,
          },
          teleport: shouldTeleportVisitor,
        },
        this.requestOptions,
      );
    } catch (error) {
      throw getErrorResponse({ error });
    }
  }
}

export default Visitor;
