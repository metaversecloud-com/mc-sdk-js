import { AxiosResponse } from "axios";
import { Asset, SDKController, Topia } from "controllers";
import { AssetOptionalInterface } from "interfaces";
import { AssetType } from "types";

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
