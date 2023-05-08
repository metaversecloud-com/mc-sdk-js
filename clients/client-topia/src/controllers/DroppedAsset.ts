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
 * await new DroppedAsset(topia, "1giFZb0sQ3X27L7uGyQX", "example", { attributes: { text: "" }, credentials: { assetId: "1giFZb0sQ3X27L7uGyQX" } } });
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
    super(topia, id, options);
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
      throw this.errorHandler({ error });
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
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Retrieves the data object for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.fetchDataObject();
   * const { dataObject } = droppedAsset;
   * ```
   */
  async fetchDataObject(): Promise<void | ResponseType> {
    return this.#fetchDroppedAssetDataObject();
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
   * const { dataObject } = droppedAsset;
   * ```
   */
  async setDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    return this.#setDroppedAssetDataObject(dataObject, options);
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
   * const { dataObject } = droppedAsset;
   * ```
   */
  // get dropped asset
  async updateDroppedAssetDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    return this.#updateDroppedAssetDataObject(dataObject, options);
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
    try {
      return this.#updateDroppedAsset({ assetBroadcast, assetBroadcastAll, broadcasterEmail }, "set-asset-broadcast");
    } catch (error) {
      throw this.errorHandler({ error });
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
    try {
      return this.#updateDroppedAsset(
        {
          clickType,
          clickableLink,
          clickableLinkTitle,
          clickableDisplayTextDescription,
          clickableDisplayTextHeadline,
          isForceLinkInIframe,
          isOpenLinkInDrawer,
          portalName,
          position,
        },
        "change-click-type",
      );
    } catch (error) {
      throw this.errorHandler({ error });
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
  updateCustomTextAsset(style: object, text: string | null | undefined): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ style, text }, "set-custom-text");
    } catch (error) {
      throw this.errorHandler({ error });
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
    try {
      return this.#updateDroppedAsset(
        { audioRadius, audioSliderVolume, isVideo, mediaLink, mediaName, mediaType, portalName, syncUserMedia },
        "change-media-type",
      );
    } catch (error) {
      throw this.errorHandler({ error });
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
      throw this.errorHandler({ error });
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
      throw this.errorHandler({ error });
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
  updatePosition(x: number, y: number): Promise<void | ResponseType> {
    try {
      return this.#updateDroppedAsset({ x, y }, "set-position");
    } catch (error) {
      throw this.errorHandler({ error });
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
    try {
      return this.#updateDroppedAsset(
        { isPrivateZone, isPrivateZoneChatDisabled, privateZoneUserCap },
        "set-private-zone",
      );
    } catch (error) {
      throw this.errorHandler({ error });
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
      throw this.errorHandler({ error });
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
      throw this.errorHandler({ error });
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
    try {
      return this.#updateDroppedAsset({ bottom, top }, "set-webimage-layers");
    } catch (error) {
      throw this.errorHandler({ error });
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
    title,
    type,
    url,
  }: {
    dataObject: object;
    description: string;
    isUniqueOnly: boolean;
    title: string;
    type: string;
    url: string;
  }): Promise<void | AxiosResponse> {
    try {
      const response = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/webhooks`,
        {
          active: true,
          assetId: this.id,
          dataObject,
          description,
          enteredBy: "",
          isUniqueOnly,
          title,
          type,
          url,
          urlSlug: this.urlSlug,
        },
        this.requestOptions,
      );
      return response.data.webhookId;
    } catch (error) {
      throw this.errorHandler({ error });
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
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/set-asset-interactive-settings`,
        {
          interactivePublicKey,
          isInteractive,
        },
        this.requestOptions,
      );
      this.isInteractive = isInteractive;
      this.interactivePublicKey = interactivePublicKey;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  // private methods
  #fetchDroppedAssetDataObject = async (): Promise<void | ResponseType> => {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/assets/${this.id}/data-object`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };

  #setDroppedAssetDataObject = async (
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> => {
    try {
      const { lock = {} } = options;
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/set-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );

      this.dataObject = dataObject || this.dataObject;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };

  #updateDroppedAssetDataObject = async (
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> => {
    try {
      const { lock = {} } = options;
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/assets/${this.id}/update-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );

      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  };

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
      throw this.errorHandler({ error });
    }
  };
}

export default DroppedAsset;
