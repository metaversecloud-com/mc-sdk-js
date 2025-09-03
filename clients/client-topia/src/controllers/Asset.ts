import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { AssetInterface, AssetOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * Create an instance of Asset class with a given asset id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * const asset = await new Asset(topia, "id", {
 *   attributes: { assetName: "My Asset", isPublic: false },
 *   credentials: { interactiveNonce: "exampleNonce", assetId: "droppedAssetId", visitorId: 1, urlSlug: "exampleWorld" }
 * });
 * ```
 */
export class Asset extends SDKController implements AssetInterface {
  readonly id?: string;

  constructor(topia: Topia, id: string, options: AssetOptionalInterface = { attributes: {}, credentials: {} }) {
    // options.credentials.assetId is the dropped asset id and is used to validate the interactive credentials. It should NOT match the id that's passed to the constructor.
    super(topia, { ...options.credentials });
    this.id = id;
    Object.assign(this, options.attributes);
  }

  /**
   * Retrieves platform asset details and assigns response data to the instance.
   *
   * @example
   * ```ts
   * await asset.fetchAssetById();
   * const { assetName } = asset;
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns the asset details or an error response.
   */
  async fetchAssetById(): Promise<object | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/assets/${this.id}`, this.requestOptions);
      Object.assign(this, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Asset.fetchAssetById" });
    }
  }

  /**
   * Updates platform asset details.
   *
   * @example
   * ```ts
   * await asset.updateAsset({
   *   assetName: "exampleAsset",
   *   bottomLayerURL: null,
   *   creatorTags: { "decorations": true },
   *   isPublic: true,
   *   shouldUploadImages: true,
   *   tagJson: "[{"label":"decorations","value":"decorations"}]",
   *   topLayerURL: "https://example.topLayerURL"
   *  });
   * const { assetName } = asset;
   * ```
   */
  async updateAsset({
    assetName,
    bottomLayerURL,
    creatorTags,
    isPublic,
    shouldUploadImages,
    tagJson,
    topLayerURL,
  }: {
    assetName: string;
    bottomLayerURL?: string;
    creatorTags: object;
    isPublic: boolean;
    shouldUploadImages?: boolean;
    tagJson: string;
    topLayerURL?: string;
  }): Promise<object | ResponseType> {
    const params = {
      assetName,
      bottomLayerURL,
      creatorTags,
      isPublic,
      shouldUploadImages,
      tagJson,
      topLayerURL,
    };
    try {
      const response: AxiosResponse = await this.topiaPublicApi().put(
        `/assets/${this.id}`,
        params,
        this.requestOptions,
      );
      Object.assign(this, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "Asset.updateAsset" });
    }
  }
}

export default Asset;
