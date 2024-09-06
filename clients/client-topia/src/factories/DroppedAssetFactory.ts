import { DroppedAsset, Topia, Asset, SDKController } from "controllers";
import { DroppedAssetOptionalInterface } from "interfaces";
import { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";

/**
 * @usage
 * ```ts
 * const DroppedAsset = new DroppedAssetFactory(myTopiaInstance);
 * ```
 */
export class DroppedAssetFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * @summary
   * Instantiate a new instance of DroppedAsset class.
   *
   * @usage
   * ```
   * const droppedAssetInstance = await DroppedAsset.create(assetId, urlSlug, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  create(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): DroppedAsset {
    return new DroppedAsset(this.topia, id, urlSlug, options);
  }

  /**
   * @summary
   * Instantiate a new instance of DroppedAsset class and retrieve all properties.
   *
   * @usage
   * ```
   * const droppedAssetInstance = await DroppedAsset.get(assetId, urlSlug, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  async get(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): Promise<DroppedAsset> {
    const droppedAsset = new DroppedAsset(this.topia, id, urlSlug, options);
    await droppedAsset.fetchDroppedAssetById();
    return droppedAsset;
  }

  /**
   * @summary
   * Searches dropped assets within a world by a provide `uniqueName`. If a single match is found, a new instance of DroppedAsset class is returned all properties.
   *
   * @usage
   * ```
   * const droppedAssetInstance = await DroppedAsset.getWithUniqueName("exampleUniqueName", urlSlug, interactiveSecret, credentials);
   * ```
   */
  async getWithUniqueName(
    uniqueName: string,
    urlSlug: string,
    interactiveSecret: string,
    credentials: {
      apiKey?: string;
      interactiveNonce?: string;
      interactivePublicKey: string;
      visitorId?: number;
    },
  ): Promise<DroppedAsset> {
    const params = { credentials, interactiveSecret, uniqueName, urlSlug };
    try {
      const { apiKey, interactivePublicKey } = credentials;
      const headers: { Authorization?: string; interactiveJWT?: string; publickey?: string } = {};
      headers.publickey = interactivePublicKey;

      if (interactiveSecret) headers.interactiveJWT = jwt.sign(credentials, interactiveSecret);
      else if (apiKey) headers.Authorization = apiKey;
      else throw "An apiKey or interactive credentials are required.";

      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${urlSlug}/asset-by-unique-name/${uniqueName}`,
        { headers },
      );
      const { id } = response.data;
      return new DroppedAsset(this.topia, id, urlSlug, { attributes: response.data });
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAssetFactory.getWithUniqueName" });
    }
  }

  /**
   * @summary
   * Drops an asset in a world and returns a new instance of DroppedAsset class with all properties.
   *
   * @usage
   * ```
   * const assetInstance = await Asset.create(id, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * const droppedAssetInstance = await DroppedAsset.get(assetInstance, {
        assetScale: 1.5,
        flipped: true,
        layer0: "",
        layer1: "https://pathtoimage.png",
        interactivePublicKey,
        isInteractive: true,
        position: { x: 0, y: 0 },
        uniqueName: "exampleUniqueName",
        urlSlug,
      });
   * ```
   */
  async drop(
    asset: Asset,
    {
      assetScale = 1,
      clickType,
      clickableDisplayTextDescription,
      clickableDisplayTextHeadline,
      clickableLink,
      clickableLinkTitle,
      flipped,
      interactivePublicKey,
      isInteractive,
      isForceLinkInIframe,
      isOpenLinkInDrawer,
      layer0 = "",
      layer1 = "",
      position: { x, y },
      sceneDropId,
      text,
      textColor,
      textSize,
      textWeight,
      textWidth,
      uniqueName,
      urlSlug,
      yOrderAdjust,
    }: {
      assetScale?: number;
      flipped?: boolean;
      clickType?: string;
      clickableDisplayTextDescription?: string;
      clickableDisplayTextHeadline?: string;
      clickableLink?: string;
      clickableLinkTitle?: string;
      interactivePublicKey?: string;
      isInteractive?: boolean;
      isForceLinkInIframe?: boolean;
      isOpenLinkInDrawer?: boolean;
      layer0?: string;
      layer1?: string;
      position: {
        x: number;
        y: number;
      };
      sceneDropId?: string;
      text?: string;
      textColor?: string;
      textSize?: number;
      textWeight?: string;
      textWidth?: number;
      uniqueName?: string;
      urlSlug: string;
      yOrderAdjust?: number;
    },
  ): Promise<DroppedAsset> {
    let specialType = null;
    if (layer0 || layer1) specialType = "webImage";
    else if (text) specialType = "text";

    const params = {
      assetScale,
      clickType,
      clickableDisplayTextDescription,
      clickableDisplayTextHeadline,
      clickableLink,
      clickableLinkTitle,
      flipped,
      interactivePublicKey,
      isInteractive,
      isForceLinkInIframe,
      isOpenLinkInDrawer,
      layer0,
      layer1,
      sceneDropId,
      specialType,
      text,
      textColor,
      textSize,
      textWeight,
      textWidth,
      uniqueName,
      yOrderAdjust,
    };

    if (isInteractive && !interactivePublicKey) {
      throw this.errorHandler({
        message: "interactivePublicKey is required",
        params,
        sdkMethod: "DroppedAssetFactory.drop",
      });
    }

    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/world/${urlSlug}/assets`,
        { ...params, assetId: asset.id, position: { x, y } },
        asset.requestOptions,
      );
      const { id } = response.data;
      return new DroppedAsset(this.topia, id, urlSlug, { credentials: asset.credentials });
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAssetFactory.drop" });
    }
  }
}

export default DroppedAssetFactory;
