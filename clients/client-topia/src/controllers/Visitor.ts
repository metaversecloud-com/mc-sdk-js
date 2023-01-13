// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { MoveVisitorInterface, VisitorInterface, VisitorOptionalInterface } from "interfaces";

// utils
import { getErrorMessage } from "utils";

/**
 * Create an instance of Visitor class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Visitor(this.topia, id, urlSlug, { options });
 * ```
 */
export class Visitor extends SDKController implements VisitorInterface {
  readonly id: number;
  urlSlug: string;

  constructor(topia: Topia, id: number, urlSlug: string, options: VisitorOptionalInterface = { args: {}, creds: {} }) {
    super(topia, options.creds);
    Object.assign(this, options.args);
    this.id = id;
    this.urlSlug = urlSlug;
    this.moveVisitor;
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
  moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<string> {
    return new Promise((resolve, reject) => {
      this.topia.axios
        .put(
          `/world/${this.urlSlug}/visitors/${this.id}/move`,
          {
            moveTo: {
              x,
              y,
            },
            teleport: shouldTeleportVisitor,
          },
          this.requestOptions,
        )
        .then(() => {
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default Visitor;
