import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { AssetInterface, AssetOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of Asset class with a given asset id and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new Asset(topia, "assetId", {
 *   attributes: { assetName: "My Asset", isPublic: false },
 *   credentials: { apiKey: "exampleKey", interactiveNonce: "exampleNonce", urlSlug: "exampleWorld", visitorId: 1 }
 * });
 * ```
 */
export class Asset extends SDKController implements AssetInterface {
  readonly id?: string;

  constructor(topia: Topia, id: string, options: AssetOptionalInterface = { attributes: {}, credentials: {} }) {
    // assetId and urlSlug should only be used when Asset is extended by DroppedAsset
    super(topia, {
      apiKey: options?.credentials?.apiKey,
      assetId: options?.credentials?.assetId,
      interactiveNonce: options?.credentials?.interactiveNonce,
      urlSlug: options?.credentials?.urlSlug,
      visitorId: options?.credentials?.visitorId,
    });
    this.id = id;
    Object.assign(this, options.attributes);
  }

  async fetchAssetById(): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/assets/${this.id}`, this.requestOptions);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Asset.fetchAssetById" });
    }
  }
}

export default Asset;
