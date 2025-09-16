import { AxiosResponse } from "axios";

// controllers
import { Asset } from "controllers/Asset";
import { Topia } from "controllers/Topia";

// interfaces
import {
  DroppedAssetInterface,
  DroppedAssetOptionalInterface,
  RemoveClickableLinkInterface,
  SetClickableLinkMultiInterface,
  UpdateBroadcastInterface,
  UpdateClickableLinkMultiInterface,
  UpdateClickTypeInterface,
  UpdateDroppedAssetInterface,
  UpdateMediaTypeInterface,
  UpdatePrivateZoneInterface,
} from "interfaces";

// types
import { DroppedAssetClickType, ResponseType } from "types";
import { AnalyticType } from "types/AnalyticTypes";
import { removeUndefined } from "utils";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., DroppedAsset).
    - Consumers obtain controller instances via factory methods (e.g., DroppedAssetFactory.get).

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - Do NOT mutate controller shape or return ad-hoc fields.

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, DroppedAssetFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const DroppedAsset = new DroppedAssetFactory(topia);

    // controllers/myController.ts (consumer app)
    import { DroppedAsset } from "utils/topiaInit.ts";
    const da = await DroppedAsset.get(droppedAssetId, urlSlug, { credentials });
    await da.fetchDataObject();

============================================================================ */

/**
 * Create an instance of Dropped Asset class with a given dropped asset id, url slug, and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { DroppedAsset } from "utils/topiaInit.ts";
 *
 * const droppedAsset = await DroppedAsset.get(exampleDroppedAssetId, exampleUrlSlug, {
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
export class DroppedAsset extends Asset implements DroppedAssetInterface {
  readonly id?: string | undefined;
  dataObject?: object | null;
  isInteractive?: boolean | null;
  interactivePublicKey?: string | null;
  position: { x: number; y: number };
  text?: string | null | undefined;
  urlSlug: string;

  constructor(
    topia: Topia,
    id: string,
    urlSlug: string,
    options: DroppedAssetOptionalInterface = { attributes: {}, credentials: {} },
  ) {
    super(topia, id, { attributes: options.attributes, credentials: { assetId: id, urlSlug, ...options.credentials } });
    Object.assign(this, options.attributes);
    this.id = id;
    this.text = options.attributes?.text;
    this.urlSlug = urlSlug;
    this.position = options.attributes?.position || { x: 0, y: 0 };
  }

  /**
   * Retrieves dropped asset details and assigns response data to the instance.
   *
   * @example
   * ```ts
   * await droppedAsset.fetchDroppedAssetById();
   * const { assetName } = droppedAsset;
   * ```
   */
  async fetchDroppedAssetById(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets/${this.id}`,
        this.requestOptions,
      );
      const droppedAssetDetails = response.data;
      droppedAssetDetails.urlSlug = this.urlSlug;
      Object.assign(this, droppedAssetDetails);
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "DroppedAsset.fetchDroppedAssetById" });
    }
  }

  /**
   * Updates dropped asset details and assigns the response data to the instance. Requires Public Key to have the `canUpdateDroppedAssets` permission.
   *
   * @example
   * ```ts
   * const payload = {
   * assetScale: 1,
   * clickType: "link",
   * clickableDisplayTextDescription: "Description",
   * clickableDisplayTextHeadline: "Headline",
   * clickableLink: "https://topia.io",
   * clickableLinkTitle: "Topia",
   * flipped: false,
   * isTextTopLayer: false,
   * layer0: "https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg",
   * layer1: "https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg",
   * position: { x: 0, y: 0 },
   * specialType: "webImage",
   * text: "My Asset",
   * textColor: "#000000",
   * textSize: 20,
   * textWeight: "normal",
   * textWidth: 200,
   * uniqueName: "example",
   * yOrderAdjust: 0,
   * }
   * await droppedAsset.updateDroppedAsset();
   * const { assetName } = droppedAsset;
   * ```
   */
  async updateDroppedAsset({
    assetScale,
    audioRadius,
    audioSliderVolume,
    clickType,
    clickableLink,
    clickableLinkTitle,
    clickableDisplayTextDescription,
    clickableDisplayTextHeadline,
    flipped,
    isInteractive,
    isTextTopLayer,
    isVideo,
    interactivePublicKey,
    layer0,
    layer1,
    mediaLink,
    mediaName,
    mediaType,
    portalName,
    position,
    specialType,
    syncUserMedia,
    text,
    textColor,
    textSize,
    textWeight,
    textWidth,
    uniqueName,
    yOrderAdjust,
  }: UpdateDroppedAssetInterface): Promise<void | ResponseType> {
    const params = {
      assetScale,
      audioRadius,
      audioSliderVolume,
      clickType,
      clickableLink,
      clickableLinkTitle,
      clickableDisplayTextDescription,
      clickableDisplayTextHeadline,
      flipped,
      isInteractive,
      isTextTopLayer,
      isVideo,
      interactivePublicKey,
      layer0,
      layer1,
      mediaLink,
      mediaName,
      mediaType,
      portalName,
      position,
      specialType,
      syncUserMedia,
      text,
      textColor,
      textSize,
      textWeight,
      textWidth,
      uniqueName,
      yOrderAdjust,
    };

    const filteredParams = removeUndefined(params);

    try {
      const response: AxiosResponse = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}`,
        filteredParams,
        this.requestOptions,
      );
      const droppedAssetDetails = response.data;
      Object.assign(this, droppedAssetDetails);
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateDroppedAsset" });
    }
  }

  /**
   * Deletes the dropped asset (removes it from the world).
   *
   * @example
   * ```ts
   * await droppedAsset.deleteDroppedAsset();
   * ```
   */
  async deleteDroppedAsset(): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().delete(`/world/${this.urlSlug}/assets/${this.id}`, this.requestOptions);
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "DroppedAsset.deleteDroppedAsset" });
    }
  }

  /**
   * Retrieves the data object for a dropped asset.
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const dataObject = await droppedAsset.fetchDataObject();
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
   */
  async fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType> {
    try {
      let query = "";
      if (appPublicKey) query = `?appPublicKey=${appPublicKey}&appJWT=${appJWT}`;
      else if (sharedAppPublicKey) query = `?sharedAppPublicKey=${sharedAppPublicKey}&sharedAppJWT=${sharedAppJWT}`;
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets/${this.id}/data-object${query}`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "DroppedAsset.fetchDataObject" });
    }
  }

  /**
   * Sets the data object for a dropped asset and assigns the response data to the instance.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await droppedAsset.setDataObject(
   *   { resetCount: 0 },
   *   {
   *     analytics: [{ analyticName: "resets"} ],
   *     lock: { lockId: `${assetId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
   *   },
   * );
   *
   * const { resetCount } = droppedAsset.dataObject;
   * ```
   */
  async setDataObject(
    dataObject: object,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/set-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );

      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "DroppedAsset.setDataObject" });
    }
  }

  /**
   * Updates the data object for a dropped asset and assigns the response data to the instance.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await droppedAsset.updateDataObject({
   *   [`profiles.${profileId}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
   *   [`profileMapper.${profileId}`]: username,
   * });
   *
   * const { profiles } = droppedAsset.dataObject;
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/update-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );

      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "DroppedAsset.updateDataObject" });
    }
  }

  /**
   * Increments a specific value in the data object for a dropped asset by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await droppedAsset.incrementDataObjectValue("key", 1);
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/increment-data-object-value`,
        { path, amount, ...options },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { path, amount, options },
        sdkMethod: "DroppedAsset.incrementDataObjectValue",
      });
    }
  }

  /**
   * Updates broadcast options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateBroadcast({
   *   assetBroadcast: true,
   *   assetBroadcastAll: true,
   *   broadcasterEmail: "example@email.com"
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateBroadcast({
    assetBroadcast,
    assetBroadcastAll,
    broadcasterEmail,
  }: UpdateBroadcastInterface): Promise<void | ResponseType> {
    const params = { assetBroadcast, assetBroadcastAll, broadcasterEmail };
    try {
      return this.#updateDroppedAsset(params, "set-asset-broadcast");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateBroadcast" });
    }
  }

  /**
   * Updates click options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateClickType({
   *   "clickType": "portal",
   *   "clickableLink": "https://topia.io",
   *   "clickableLinkTitle": "My awesome link!",
   *   "clickableDisplayTextDescription": "Description",
   *   "clickableDisplayTextHeadline": "Title",
   *   "position": {
   *     "x": 0,
   *     "y": 0
   *   },
   *   "portalName": "community"
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateClickType({
    clickType = DroppedAssetClickType.LINK,
    clickableLink,
    clickableLinkTitle,
    clickableDisplayTextDescription,
    clickableDisplayTextHeadline,
    isForceLinkInIframe,
    isOpenLinkInDrawer,
    portalName,
    position,
  }: UpdateClickTypeInterface): Promise<void | ResponseType> {
    const params = {
      clickType,
      clickableLink,
      clickableLinkTitle,
      clickableDisplayTextDescription,
      clickableDisplayTextHeadline,
      isForceLinkInIframe,
      isOpenLinkInDrawer,
      portalName,
      position,
    };
    try {
      return this.#updateDroppedAsset(params, "change-click-type");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateClickType" });
    }
  }

  /**
   * Adds an array of links to an asset. Maximum is 20 links.
   *
   * @example
   * ```ts
   * await droppedAsset.setClickableLinkMulti({
   *   clickableLinks: [
   *     {
   *       clickableLink: "https://example_one.com",
   *       clickableLinkTitle: "Example One Link",
   *       isForceLinkInIframe: true,
   *       isOpenLinkInDrawer: false,
   *     },
   *     {
   *       clickableLink: "https://example two.com",
   *       clickableLinkTitle: "Example Two Link",
   *       isForceLinkInIframe: false,
   *       isOpenLinkInDrawer: false,
   *     },
   *   ],
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  setClickableLinkMulti({ clickableLinks }: SetClickableLinkMultiInterface): Promise<void | ResponseType> {
    const params = {
      clickType: DroppedAssetClickType.LINK,
      clickableLinks,
    };
    try {
      return this.#updateDroppedAsset(params, "set-clickable-link-multi");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.setClickableLinkMulti" });
    }
  }

  /**
   * Updates multiple clickable links for a dropped asset.
   *
   * @remarks
   * Pass in an 'existingLinkId' to edit an existing link.
   *
   * @example
   * ```ts
   * await droppedAsset.updateClickableLinkMulti({
   *   clickableLink: "https://example.com",
   *   clickableLinkTitle: "Example Link",
   *   isForceLinkInIframe: true,
   *   isOpenLinkInDrawer: false,
   *   existingLinkId: "abcd"
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateClickableLinkMulti({
    clickableLink,
    clickableLinkTitle,
    isForceLinkInIframe,
    isOpenLinkInDrawer,
    existingLinkId,
    linkSamlQueryParams,
  }: UpdateClickableLinkMultiInterface): Promise<void | ResponseType> {
    const params = {
      clickType: DroppedAssetClickType.LINK,
      clickableLink,
      clickableLinkTitle,
      isForceLinkInIframe,
      isOpenLinkInDrawer,
      existingLinkId,
      linkSamlQueryParams,
    };
    try {
      return this.#updateDroppedAsset(params, "update-clickable-link-multi");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateClickableLinkMulti" });
    }
  }

  /**
   * Removes a clickable link from a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.removeClickableLink({ linkId: "link-id" });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  removeClickableLink({ linkId }: RemoveClickableLinkInterface): Promise<void | ResponseType> {
    const params = {
      linkId,
    };
    try {
      return this.#updateDroppedAsset(params, "remove-clickable-link");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.removeClickableLink" });
    }
  }

  /**
   * Updates text and style of a dropped asset.
   *
   * @example
   * ```ts
   * const style = {
   *   "textColor": "#abc123",
   *   "textFontFamily": "Arial",
   *   "textSize": 40,
   *   "textWeight": "normal",
   *   "textWidth": 200
   * };
   * await droppedAsset.updateCustomTextAsset(style, "hello world");
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateCustomTextAsset(
    style: object | undefined | null,
    text: string | null | undefined,
  ): Promise<void | ResponseType> {
    const params = { style, text };
    try {
      return this.#updateDroppedAsset(params, "set-custom-text");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateCustomTextAsset" });
    }
  }

  /**
   * Updates media options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateMediaType({
   *   "mediaType": "link",
   *   "mediaLink": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
   *   "isVideo": true,
   *   "syncUserMedia": true,
   *   "audioSliderVolume: 30"
   *   "portalName": "community",
   *   "audioRadius": 0,
   *   "mediaName": "string"
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateMediaType({
    audioRadius,
    audioSliderVolume,
    isVideo,
    mediaLink,
    mediaName,
    mediaType,
    portalName,
    syncUserMedia,
  }: UpdateMediaTypeInterface): Promise<void | ResponseType> {
    const params = {
      audioRadius,
      audioSliderVolume,
      isVideo,
      mediaLink,
      mediaName,
      mediaType,
      portalName,
      syncUserMedia,
    };
    try {
      return this.#updateDroppedAsset(params, "change-media-type");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateMediaType" });
    }
  }

  /**
   * Updates mute zone options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateMuteZone(true);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateMuteZone(isMutezone: boolean): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ isMutezone }, "set-mute-zone");
    } catch (error) {
      throw this.errorHandler({ error, params: { isMutezone }, sdkMethod: "DroppedAsset.updateMuteZone" });
    }
  }

  /**
   * Updates landmark zone options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateLandmarkZone({
   *  isLandmarkZoneEnabled: true,
   *  landmarkZoneName: "Example",
   *  landmarkZoneIsVisible: true,
   *});
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateLandmarkZone({
    isLandmarkZoneEnabled,
    landmarkZoneName,
    landmarkZoneIsVisible,
  }: {
    isLandmarkZoneEnabled: boolean;
    landmarkZoneName?: string;
    landmarkZoneIsVisible?: boolean;
  }): Promise<void | ResponseType> {
    const params = { isLandmarkZoneEnabled, landmarkZoneName, landmarkZoneIsVisible };
    try {
      return this.#updateDroppedAsset(params, "set-landmark-zone");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateLandmarkZone" });
    }
  }

  /**
   * Updates webhook zone options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateWebhookZone(true);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateWebhookZone(isWebhookZoneEnabled: boolean): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ isWebhookZoneEnabled }, "set-webhook-zone");
    } catch (error) {
      throw this.errorHandler({ error, params: { isWebhookZoneEnabled }, sdkMethod: "DroppedAsset.updateWebhookZone" });
    }
  }

  /**
   * Moves a dropped asset to specified coordinates.
   *
   * @example
   * ```ts
   * await droppedAsset.updatePosition(100, 200, 100);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updatePosition(x: number, y: number, yOrderAdjust?: number): Promise<void | ResponseType> {
    const params = { x, y, yOrderAdjust };
    try {
      return this.#updateDroppedAsset(params, "set-position");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updatePosition" });
    }
  }

  /**
   * Updates private zone options for a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updatePrivateZone({
   *   "isPrivateZone": false,
   *   "isPrivateZoneChatDisabled": true,
   *   "privateZoneUserCap": 10
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updatePrivateZone({
    isPrivateZone,
    isPrivateZoneChatDisabled,
    privateZoneUserCap,
  }: UpdatePrivateZoneInterface): Promise<void | ResponseType> {
    const params = { isPrivateZone, isPrivateZoneChatDisabled, privateZoneUserCap };
    try {
      return this.#updateDroppedAsset(params, "set-private-zone");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updatePrivateZone" });
    }
  }

  /**
   * Updates the size of a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.assetScale(.5);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateScale(assetScale: number): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ assetScale }, "change-scale");
    } catch (error) {
      throw this.errorHandler({ error, params: { assetScale }, sdkMethod: "DroppedAsset.updateScale" });
    }
  }

  /**
   * Flip an dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.flip(.5);
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  flip(): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({}, "flip");
    } catch (error) {
      throw this.errorHandler({ error, params: {}, sdkMethod: "DroppedAsset.flip" });
    }
  }

  /**
   * Change or remove media embedded in a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateUploadedMediaSelected("LVWyxwNxI96eLjnXWwYO");
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateUploadedMediaSelected(mediaId: string): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ mediaId }, "change-uploaded-media-selected");
    } catch (error) {
      throw this.errorHandler({ error, params: { mediaId }, sdkMethod: "DroppedAsset.updateUploadedMediaSelected" });
    }
  }

  /**
   * Change or remove top and bottom layers of a dropped asset.
   *
   * @example
   * ```ts
   * await droppedAsset.updateWebImageLayers("","https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg");
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the updated dropped asset or an error.
   */
  updateWebImageLayers(bottom: string, top: string): Promise<void | ResponseType> {
    const params = { bottom, top };
    try {
      return this.#updateDroppedAsset(params, "set-webimage-layers");
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.updateWebImageLayers" });
    }
  }

  /**
   * Add a webhook to a dropped asset
   *
   * @example
   * ```ts
   * await droppedAsset.addWebhook({
   *   dataObject: {},
   *   description: "Webhook desc",
   *   enteredBy: "you",
   *   isUniqueOnly: false,
   *   title: "title",
   *   type: "type",
   *   url: "https://url.com",
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the new `webhookId` or an error.
   */
  async addWebhook({
    dataObject,
    description,
    isUniqueOnly,
    shouldSetClickType,
    shouldSetIsInteractive,
    title,
    type,
    url,
  }: {
    dataObject: object;
    description: string;
    isUniqueOnly: boolean;
    shouldSetClickType?: boolean;
    shouldSetIsInteractive?: boolean;
    title: string;
    type: string;
    url: string;
  }): Promise<void | AxiosResponse> {
    const params = {
      dataObject,
      description,
      isUniqueOnly,
      shouldSetClickType,
      shouldSetIsInteractive,
      title,
      type,
      url,
    };
    try {
      const response = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/webhooks`,
        {
          ...params,
          active: true,
          assetId: this.id,
          enteredBy: "",
          urlSlug: this.urlSlug,
        },
        this.requestOptions,
      );
      return response.data.webhookId;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.addWebhook" });
    }
  }

  /**
   * Set the interactive settings on a dropped asset
   *
   * @example
   * ```ts
   * await droppedAsset.setInteractiveSettings({
   *   isInteractive: true,
   *   interactivePublicKey: "xyz"
   * });
   * ```
   */
  async setInteractiveSettings({
    isInteractive = false,
    interactivePublicKey = "",
  }: {
    isInteractive?: boolean;
    interactivePublicKey: string;
  }): Promise<void | ResponseType> {
    const params = {
      interactivePublicKey,
      isInteractive,
    };
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/set-asset-interactive-settings`,
        params,
        this.requestOptions,
      );
      this.isInteractive = isInteractive;
      this.interactivePublicKey = interactivePublicKey;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAsset.setInteractiveSettings" });
    }
  }

  /**
   * Retrieve analytics for a dropped asset by day, week, month, quarter, or year
   *
   * @example
   * ```ts
   * const analytics = await droppedAsset.fetchDroppedAssetAnalytics({
   *   periodType: "quarter",
   *   dateValue: 3,
   *   year: 2023,
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns the analytics data or an error.
   */
  async fetchDroppedAssetAnalytics({
    periodType,
    dateValue,
    year,
  }: {
    periodType: "week" | "month" | "quarter" | "year";
    dateValue: number;
    year: number;
  }): Promise<void | ResponseType> {
    try {
      let query = "";
      switch (periodType) {
        case "week":
          query = `&week=W${dateValue}`;
          break;
        case "month":
          query = `&month=${dateValue}`;
          break;
        case "quarter":
          query = `&quarter=Q${dateValue}`;
          break;
        default:
          "";
      }
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/dropped-asset-analytics/${this.id}?year=${year}${query}`,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { periodType, dateValue, year },
        sdkMethod: "DroppedAsset.fetchDroppedAssetAnalytics",
      });
    }
  }

  // private methods
  #updateDroppedAsset = async (payload: object, updateType: string): Promise<void | ResponseType> => {
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/${updateType}`,
        {
          ...payload,
        },
        this.requestOptions,
      );
      Object.assign(this, response.data);
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { payload, updateType }, sdkMethod: "DroppedAsset.updateDroppedAsset" });
    }
  };
}

export default DroppedAsset;
