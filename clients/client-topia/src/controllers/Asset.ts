import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { AssetInterface, AssetOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., Asset).
    - Consumers obtain controller instances via factory methods (e.g., AssetFactory.get).

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - Do NOT mutate controller shape or return ad-hoc fields.

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, AssetFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Asset = new AssetFactory(topia);

    // controllers/myController.ts (consumer app)
    import { Asset } from "utils/topiaInit.ts";
    const asset = await Asset.create(assetId, { credentials });
    await asset.fetchAssetById();

============================================================================ */

/**
 * Create an instance of Asset class with a given asset id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { Asset } from "utils/topiaInit.ts";
 *
 * const asset = await Asset.create(assetId, {
 *   attributes: { assetName: "My Asset", isPublic: false },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
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
   * @keywords get, fetch, retrieve, load, details, info, information
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
   * @keywords update, modify, change, edit, alter, transform
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
