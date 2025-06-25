import { Topia, Ecosystem } from "controllers";
import { EcosystemOptionalInterface } from "interfaces";

/**
 * @usage
 * ```ts
 * const Ecosystem = new EcosystemFactory(myTopiaInstance);
 * ```
 */
export class EcosystemFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * @summary
   * Instantiate a new instance of Ecosystem class.
   *
   * @usage
   * ```
   * const ecosystemInstance = await Ecosystem.create({ credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId }});
   * ```
   */
  create(options?: EcosystemOptionalInterface): Ecosystem {
    return new Ecosystem(this.topia, options);
  }
}

export default EcosystemFactory;
