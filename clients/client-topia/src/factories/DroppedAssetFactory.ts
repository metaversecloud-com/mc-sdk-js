import { DroppedAsset, Topia, Asset, SDKController } from "controllers";
import { DroppedAssetOptionalInterface } from "interfaces";
import { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
import { InteractiveCredentials } from "types";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, DroppedAssetFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const DroppedAsset = new DroppedAssetFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { DroppedAsset } from "utils/topiaInit.ts";
    const da = await DroppedAsset.get(droppedAssetId, urlSlug, { credentials });
    await da.fetchDataObject();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { DroppedAssetFactory, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const DroppedAsset = new DroppedAssetFactory(topia); // ❌ ad-hoc factory
    const da = await DroppedAsset.getById(droppedAssetId); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * Factory for creating and retrieving DroppedAsset instances. Use this factory to work with assets that have been placed in a Topia world.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 *
 * @keywords dropped asset, factory, create, get, retrieve, instantiate, topia
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, DroppedAssetFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const DroppedAsset = new DroppedAssetFactory(topia);
 * ```
 */
export class DroppedAssetFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * Instantiate a new instance of DroppedAsset class for an existing dropped asset in a world.
   *
   * @remarks
   * This method creates a controller instance for an existing dropped asset but does not fetch its properties.
   * Use this when you need a lightweight instance and will fetch properties separately if needed or when you already have the properties.
   *
   * @keywords create, instantiate, dropped asset, initialize, instance
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { DroppedAsset } from "utils/topiaInit.ts";
   *
   * // Create a DroppedAsset instance with credentials
   * const droppedAssetInstance = DroppedAsset.create(
   *   assetId,
   *   urlSlug,
   *   {
   *     credentials: {
   *       interactiveNonce,
   *       interactivePublicKey,
   *       assetId,
   *       urlSlug,
   *       visitorId
   *     }
   *   }
   * );
   *
   * // Later fetch its properties if needed
   * await droppedAssetInstance.fetchDroppedAssetById();
   * ```
   *
   * @returns {DroppedAsset} Returns a new DroppedAsset object without fetching its properties.
   */
  create(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): DroppedAsset {
    return new DroppedAsset(this.topia, id, urlSlug, options);
  }

  /**
   * Instantiate a new instance of DroppedAsset class and automatically fetch all its properties.
   *
   * @remarks
   * This method creates a controller instance and immediately fetches all properties of the dropped asset.
   * It's a convenience method that combines creating an instance and calling fetchDroppedAssetById().
   *
   * @keywords get, fetch, retrieve, dropped asset, load, instance
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { DroppedAsset } from "utils/topiaInit.ts";
   *
   * // Get a fully populated DroppedAsset instance
   * const droppedAssetInstance = await DroppedAsset.get(
   *   assetId,
   *   urlSlug,
   *   {
   *     credentials: {
   *       interactiveNonce,
   *       interactivePublicKey,
   *       assetId,
   *       urlSlug,
   *       visitorId
   *     }
   *   }
   * );
   *
   * // The properties are already loaded, so you can use them immediately
   * console.log(droppedAssetInstance.position);
   * ```
   *
   * @returns {Promise<DroppedAsset>} Returns a new DroppedAsset object with all properties already fetched.
   */
  async get(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): Promise<DroppedAsset> {
    const droppedAsset = new DroppedAsset(this.topia, id, urlSlug, options);
    await droppedAsset.fetchDroppedAssetById();
    return droppedAsset;
  }

  /**
   * Searches for and retrieves a dropped asset by its unique name within a world.
   *
   * @remarks
   * This method leverages the handleGetDroppedAssetByUniqueName endpoint in the Public API and assumes there is exactly one dropped asset with the matching uniqueName for the given urlSlug.
   * Use this when you need to find a dropped asset by its uniqueName rather than its ID.
   *
   * @keywords find, search, unique name, retrieve, locate, lookup, dropped asset
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { DroppedAsset } from "utils/topiaInit.ts";
   *
   * // Find and retrieve a dropped asset by its unique name
   * const droppedAssetInstance = await DroppedAsset.getWithUniqueName(
   *   "banner-sign-northeast",
   *   "my-world-slug",
   *   "your-interactive-secret",
   *   {
   *     apiKey: "your-api-key",
   *     interactivePublicKey: "your-public-key",
   *     // other credentials...
   *   }
   * );
   *
   * // The properties are already loaded, so you can use them immediately
   * console.log(droppedAssetInstance.position);
   * ```
   *
   * @returns {Promise<DroppedAsset>} Returns a new DroppedAsset object with all properties already fetched.
   */
  async getWithUniqueName(
    uniqueName: string,
    urlSlug: string,
    interactiveSecret: string,
    credentials: InteractiveCredentials,
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
      return new DroppedAsset(this.topia, id, urlSlug, { attributes: response.data, credentials });
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAssetFactory.getWithUniqueName" });
    }
  }

  /**
   * Drops an asset in a world and returns a new instance of DroppedAsset class with all properties.
   *
   * @remarks
   * This method places an existing Asset into a world at specified coordinates, effectively "dropping" it into the environment.
   * You can customize various properties of the dropped asset during placement, such as scale, position, interactive settings, and visual layers.
   *
   * @keywords drop, place, add, create, position, asset, deploy
   *
   * @example
   * ```ts
   * // Import the pre-initialized factories from your app's initialization file
   * import { Asset, DroppedAsset } from "utils/topiaInit.ts";
   *
   * // First get an asset instance
   * const assetInstance = Asset.create("asset-id-123", {
   *   credentials: {
   *     interactiveNonce,
   *     interactivePublicKey,
   *     assetId,
   *     urlSlug,
   *     visitorId
   *   }
   * });
   *
   * // Then drop (place) the asset in a world
   * const droppedAssetInstance = await DroppedAsset.drop(
   *   assetInstance,
   *   {
   *     // Basic positioning and appearance
   *     position: { x: 250, y: 350 },
   *     assetScale: 1.5,
   *     flipped: true,
   *     uniqueName: "welcome-sign",
   *     urlSlug: "my-world-slug",
   *
   *     // For web images (optional)
   *     layer0: "https://example.com/background.png",
   *     layer1: "https://example.com/foreground.png",
   *
   *     // For interactive assets (optional)
   *     interactivePublicKey: "your-public-key",
   *     isInteractive: true,
   *
   *     // For clickable assets (optional)
   *     clickType: "link",
   *     clickableLink: "https://example.com",
   *     clickableLinkTitle: "Visit Example"
   *   }
   * );
   *
   * // The dropped asset is ready to use
   * console.log(droppedAssetInstance.id);
   * ```
   *
   * @returns {Promise<DroppedAsset>} Returns a new DroppedAsset object representing the placed asset in the world.
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
      isTextTopLayer = false,
      layer0,
      layer1,
      position: { x, y },
      sceneDropId,
      text,
      textColor,
      textFontFamily,
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
      isTextTopLayer?: boolean;
      layer0?: string;
      layer1?: string;
      position: {
        x: number;
        y: number;
      };
      sceneDropId?: string;
      text?: string;
      textColor?: string;
      textFontFamily?: string;
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
      isTextTopLayer,
      layer0,
      layer1,
      sceneDropId,
      specialType,
      text,
      textColor,
      textFontFamily,
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
