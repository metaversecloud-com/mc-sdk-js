import { Topia, WorldActivity } from "controllers";
import { WorldOptionalInterface } from "interfaces";

/**
 * @usage
 * ```ts
 * const WorldActivity = new WorldActivityFactory(myTopiaInstance);
 * ```
 */
export class WorldActivityFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * @summary
   * Instantiate a new instance of WorldActivity class.
   *
   * @usage
   * ```
   * const worldActivityInstance = await WorldActivity.create(urlSlug, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  create(urlSlug: string, options?: WorldOptionalInterface): WorldActivity {
    return new WorldActivity(this.topia, urlSlug, options);
  }
}

export default WorldActivityFactory;
