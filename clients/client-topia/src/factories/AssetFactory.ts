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
 * Factory for creating Asset instances. Use this factory to create or upload assets in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 *
 * @keywords asset, factory, create, upload, instantiate, topia
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, AssetFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Asset = new AssetFactory(topia);
 * ```
 */
export class AssetFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * Instantiate a new instance of Asset class with the specified asset ID.
   *
   * @remarks
   * This method creates a new Asset controller instance that can be used to interact with an existing asset.
   * It does not create a new asset in the database.
   *
   * @keywords create, instantiate, asset, initialize, get, instance
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { Asset } from "utils/topiaInit.ts";
   *
   * // Create an Asset instance with credentials
   * const assetInstance = await Asset.create(assetId, {
   *   credentials: {
   *     interactiveNonce,
   *     interactivePublicKey,
   *     assetId,
   *     urlSlug,
   *     visitorId
   *   }
   * });
   *
   * // Use the instance to interact with the asset
   * await assetInstance.fetchAssetById();
   * ```
   *
   * @returns {Asset} Returns a new Asset object with the asset id.
   */
  create(id: string, options?: AssetOptionalInterface): Asset {
    return new Asset(this.topia, id, options);
  }

  /**
   * Upload a new Asset to the Topia platform and return a new instance of Asset class.
   *
   * @remarks
   * This method both creates a new asset in the database and returns an Asset controller instance.
   * A valid API key with appropriate permissions is required.
   *
   * @keywords upload, create, new, asset, add, store
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { Asset } from "utils/topiaInit.ts";
   *
   * // Prepare the asset payload
   * const assetPayload = {
   *   assetName: "My Decorative Asset",
   *   bottomLayerURL: "https://example.com/bottom-layer.png",
   *   creatorTags: { "decorations": true },
   *   tagJson: "[{"label":"decorations","value":"decorations"}]",
   *   isPublic: true,
   *   topLayerURL: "https://example.com/top-layer.png"
   * };
   *
   * // Upload the asset using your API key
   * const asset = await Asset.upload(assetPayload, apiKey);
   *
   * // Access the new asset's properties
   * console.log(asset.id);
   * ```
   *
   * @returns {Asset} Returns a new Asset object with the asset details.
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
