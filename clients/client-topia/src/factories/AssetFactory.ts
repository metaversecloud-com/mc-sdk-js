import { AxiosResponse } from "axios";
import { Asset, SDKController, Topia } from "controllers";
import { AssetOptionalInterface } from "interfaces";
import { AssetType } from "types";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, AssetFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Asset = new AssetFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { Asset } from "utils/topiaInit.ts";
    const asset = await Asset.create(assetId, { credentials });
    await asset.fetchAssetById();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { AssetFactory, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const Asset = new AssetFactory(topia); // ❌ ad-hoc factory
    const asset = await Asset.getById(assetId); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * @example
 * ```ts
 * const Asset = new AssetFactory(myTopiaInstance);
 * ```
 */
export class AssetFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * Instantiate a new instance of Asset class.
   *
   * @example
   * ```
   * const assetInstance = await Asset.create(id, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   *
   * @returns {Asset} Returns a new Asset object with the asset id.
   */
  create(id: string, options?: AssetOptionalInterface): Asset {
    return new Asset(this.topia, id, options);
  }

  /**
   * Upload a new Asset and return a new instance of Asset class.
   *
   * @example
   * ```
   * const assetPayload = {
   *   assetName: "exampleAssetName"
   *   bottomLayerURL: "https://example.bottomLayerURL"
   *   creatorTags: { "decorations": true },
   *   tagJson: "[{"label":"decorations","value":"decorations"}]",
   *   isPublic: true,
   *   topLayerURL: "https://example.topLayerURL"
   * }
   * const asset = await Asset.upload(assetPayload, apiKey);
   * ```
   *
   * @returns {AssetType} Returns a new Asset object with the asset details.
   */
  async upload(assetPayload: AssetType, apiKey: string): Promise<Asset> {
    try {
      if (!apiKey) throw "A valid API Key is required.";
      const headers = { Authorization: apiKey };

      const response: AxiosResponse = await this.topiaPublicApi().post("/assets", assetPayload, { headers });
      const { assetId, asset } = response.data;

      return new Asset(this.topia, assetId, { attributes: asset });
    } catch (error) {
      throw this.errorHandler({ error, params: assetPayload, sdkMethod: "AssetFactory.upload" });
    }
  }
}

export default AssetFactory;
