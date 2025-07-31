import { Topia, WorldActivity } from "controllers";
import { WorldOptionalInterface } from "interfaces";

/**
 * @example
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
   * Instantiate a new instance of WorldActivity class.
   *
   * @example
   * ```
   * const worldActivityInstance = await WorldActivity.create(urlSlug, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   */
  create(urlSlug: string, options?: WorldOptionalInterface): WorldActivity {
    return new WorldActivity(this.topia, urlSlug, options);
  }
}

export default WorldActivityFactory;
