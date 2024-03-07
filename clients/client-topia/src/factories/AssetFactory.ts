import { Asset, Topia } from "controllers";
import { AssetOptionalInterface } from "interfaces";

/**
 * @usage
 * ```ts
 * const Asset = new AssetFactory(myTopiaInstance);
 * ```
 */
export class AssetFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
    this.create;
  }

  /**
   * @summary
   * Instantiate a new instance of Asset class.
   *
   * @usage
   * ```
   * const assetInstance = await Asset.create(id, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  create(id: string, options?: AssetOptionalInterface): Asset {
    return new Asset(this.topia, id, options);
  }
}

export default AssetFactory;
