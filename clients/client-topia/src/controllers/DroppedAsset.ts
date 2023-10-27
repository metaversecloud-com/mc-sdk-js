import { AxiosResponse } from "axios";

// controllers
import { Asset } from "controllers/Asset";
import { Topia } from "controllers/Topia";

// interfaces
import {
  DroppedAssetInterface,
  DroppedAssetOptionalInterface,
  UpdateBroadcastInterface,
  UpdateClickTypeInterface,
  UpdateMediaTypeInterface,
  UpdatePrivateZoneInterface,
} from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of Dropped Asset class with a given dropped asset id, url slug, and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new DroppedAsset(topia, "1giFZb0sQ3X27L7uGyQX", "example", {
 *   attributes: { text: "My Asset" },
 *   credentials: { apiKey: "exampleKey", interactiveNonce: "exampleNonce", visitorId: 1 }
 * });
 * ```
 */
export class DroppedAsset extends Asset implements DroppedAssetInterface {
  dataObject?: object | null;
  readonly id?: string | undefined;
  text?: string | null | undefined;
  urlSlug: string;
  isInteractive?: boolean | null;
  interactivePublicKey?: string | null;

  constructor(
    topia: Topia,
    id: string,
    urlSlug: string,
    options: DroppedAssetOptionalInterface = { attributes: { text: "" }, credentials: {} },
  ) {
    super(topia, id, { attributes: options.attributes, credentials: { ...options.credentials, assetId: id, urlSlug } });
    Object.assign(this, options.attributes);
    this.id = id;
    this.text = options.attributes?.text;
    this.urlSlug = urlSlug;
  }

  /**
   * @summary
   * Retrieves dropped asset details.
   *
   * @usage
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
   * @summary
   * Delete dropped asset.
   *
   * @usage
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
   * @summary
   * Retrieves the data object for a dropped asset.
   *
   * @usage
   * ```ts
   * const dataObject = await droppedAsset.fetchDataObject();
   * ```
   */
  async fetchDataObject(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets/${this.id}/data-object`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "DroppedAsset.fetchDataObject" });
    }
  }

  /**
   * @summary
   * Sets the data object for a dropped asset.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.setDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * ```
   */
  async setDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/set-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );

      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "DroppedAsset.setDataObject" });
    }
  }

  /**
   * @summary
   * Updates the data object for a dropped asset.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.updateDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * ```
   */
  // get dropped asset
  async updateDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/update-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );

      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "DroppedAsset.updateDataObject" });
    }
  }

  /**
   * @summary
   * Increments a specific value in the data object for a dropped asset by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.incrementDataObjectValue(
   *   "path": "key",
   *   "amount": 1,
   * );
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/increment-data-object-value`,
        { path, amount, lock },
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

  // update dropped assets
  /**
   * @summary
   * Updates broadcast options for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updateBroadcast({
   *   assetBroadcast: true,
   *   assetBroadcastAll: true,
   *   broadcasterEmail: "example@email.com"
   * });
   * ```
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
   * @summary
   * Updates click options for a dropped asset.
   *
   * @usage
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
   */
  updateClickType({
    clickType,
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
   * @summary
   * Updates text and style of a dropped asset.
   *
   * @usage
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
   * @summary
   * Updates media options for a dropped asset.
   *
   * @usage
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
   * @summary
   * Updates mute zone options for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updateMuteZone(true);
   * ```
   */
  updateMuteZone(isMutezone: boolean): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ isMutezone }, "set-mute-zone");
    } catch (error) {
      throw this.errorHandler({ error, params: { isMutezone }, sdkMethod: "DroppedAsset.updateMuteZone" });
    }
  }

  /**
   * @summary
   * Updates webhook zone options for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updateWebhookZone(true);
   * ```
   */
  updateWebhookZone(isWebhookZoneEnabled: boolean): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ isWebhookZoneEnabled }, "set-webhook-zone");
    } catch (error) {
      throw this.errorHandler({ error, params: { isWebhookZoneEnabled }, sdkMethod: "DroppedAsset.updateWebhookZone" });
    }
  }

  /**
   * @summary
   * Moves a dropped asset to specified coordinates.
   *
   * @usage
   * ```ts
   * await droppedAsset.updatePosition(100,200);
   * ```
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
   * @summary
   * Updates private zone options for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updatePrivateZone({
   *   "isPrivateZone": false,
   *   "isPrivateZoneChatDisabled": true,
   *   "privateZoneUserCap": 10
   * });
   * ```
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
   * @summary
   * Updates the size of a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.assetScale(.5);
   * ```
   */
  updateScale(assetScale: number): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ assetScale }, "change-scale");
    } catch (error) {
      throw this.errorHandler({ error, params: { assetScale }, sdkMethod: "DroppedAsset.updateScale" });
    }
  }

  /**
   * @summary
   * Change or remove media embedded in a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updateUploadedMediaSelected("LVWyxwNxI96eLjnXWwYO");
   * ```
   */
  updateUploadedMediaSelected(mediaId: string): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ mediaId }, "change-uploaded-media-selected");
    } catch (error) {
      throw this.errorHandler({ error, params: { mediaId }, sdkMethod: "DroppedAsset.updateUploadedMediaSelected" });
    }
  }

  /**
   * @summary
   * Change or remove top and bottom layers of a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updateWebImageLayers("","https://www.shutterstock.com/image-vector/colorful-illustration-test-word-260nw-1438324490.jpg");
   * ```
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
   * @summary
   * Add a webhook to a dropped asset
   *
   * @usage
   * ```ts
   * await droppedAsset.addWebhook({
   *   active: true,
   *   dataObject: {},
   *   description: "Webhook desc",
   *   enteredBy: "you",
   *   isUniqueOnly: false,
   *   title: "title",
   *   type: "type",
   *   url: "https://url.com",
   *   urlSlug: "world",
   * });
   * ```
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
   * @summary
   * Set the interactive settings on a dropped asset
   *
   * @usage
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

  ////////// analytics
  /**
   * @summary
   * Retrieve analytics for a dropped asset by day, week, month, quarter, or year
   *
   * @usage
   * ```ts
   * const analytics = await droppedAsset.fetchDroppedAssetAnalytics({
   *   periodType: "quarter",
   *   dateValue: 3,
   *   year: 2023,
   * });
   * ```
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
        case "month":
          query = `&month=${dateValue}`;
        case "quarter":
          query = `&quarter=Q${dateValue}`;
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
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/${updateType}`,
        {
          ...payload,
        },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { payload, updateType }, sdkMethod: "DroppedAsset.updateDroppedAsset" });
    }
  };
}

export default DroppedAsset;
