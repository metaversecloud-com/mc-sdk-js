import { AxiosResponse, AxiosError } from "axios";

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

// utils
import { getErrorResponse, getNewErrorResponse, getSuccessResponse } from "utils";

/**
 * Create an instance of Dropped Asset class with a given dropped asset id, url slug, and optional attributes and session credentials.
 *
 * ```ts
 * await new DroppedAsset(topia, "1giFZb0sQ3X27L7uGyQX", "example", { attributes: { text: "" }, credentials: { assetId: "1giFZb0sQ3X27L7uGyQX" } } });
 * ```
 */
export class DroppedAsset extends Asset implements DroppedAssetInterface {
  dataObject?: object | null;
  readonly id?: string | undefined;
  text?: string | null | undefined;
  urlSlug: string;

  constructor(
    topia: Topia,
    id: string,
    urlSlug: string,
    options: DroppedAssetOptionalInterface = { attributes: { text: "" }, credentials: {} },
  ) {
    super(topia, id, options);
    this.id = id;
    this.text = options.attributes?.text;
    this.urlSlug = urlSlug;
    Object.assign(this, options.attributes);
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
  // get dropped asset
  // fetchDroppedAssetById(): Promise<ResponseType> {
  //   return new Promise((resolve) => {
  //     this.topia.axios
  //       .get(`/world/${this.urlSlug}/assets/${this.id}`, this.requestOptions)
  //       .then((response: AxiosResponse) => {
  //         Object.assign(this, response.data);
  //         resolve(getSuccessResponse());
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         resolve(getErrorResponse({ error }));
  //       });
  //   });
  // }

  async fetchDroppedAssetById(): Promise<void | Error> {
    try {
      const response: AxiosResponse = await this.topia.axios.get(
        `/world/${this.urlSlug}/assets/${this.id}`,
        this.requestOptions,
      );
      Object.assign(this, response.data);
    } catch (error: unknown) {
      throw getNewErrorResponse({ error });
    }
  }

  // delete dropped asset
  deleteDroppedAsset(): Promise<ResponseType> {
    return new Promise((resolve) => {
      this.topia.axios
        .delete(`/world/${this.urlSlug}/assets/${this.id}`, this.requestOptions)
        .then(() => {
          resolve(getSuccessResponse());
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }

  /**
   * @summary
   * Retrieves the data object for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.fetchDroppedAssetDataObject();
   * const { dataObject } = droppedAsset;
   * ```
   */
  // get dropped asset
  fetchDroppedAssetDataObject(): Promise<ResponseType> {
    return new Promise((resolve) => {
      this.topia.axios
        .get(`/world/${this.urlSlug}/assets/${this.id}/data-object`, this.requestOptions)
        .then((response: AxiosResponse) => {
          this.dataObject = response.data;
          resolve(getSuccessResponse());
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }

  /**
   * @summary
   * Setss the data object for a dropped asset.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.setDroppedAssetDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * const { dataObject } = droppedAsset;
   * ```
   */
  // get dropped asset
  setDroppedAssetDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<ResponseType> {
    return new Promise((resolve) => {
      const { lock = {} } = options;
      this.topia.axios
        .put(`/world/${this.urlSlug}/assets/${this.id}/set-data-object`, { dataObject, lock }, this.requestOptions)
        .then(() => {
          this.dataObject = dataObject;
          resolve(getSuccessResponse());
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }

  /**
   * @summary
   * Updates the data object for a dropped asset.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await droppedAsset.updateDroppedAssetDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * const { dataObject } = droppedAsset;
   * ```
   */
  // get dropped asset
  updateDroppedAssetDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<ResponseType> {
    return new Promise((resolve) => {
      const { lock = {} } = options;
      this.topia.axios
        .put(`/world/${this.urlSlug}/assets/${this.id}/update-data-object`, { dataObject, lock }, this.requestOptions)
        .then(() => {
          this.dataObject = dataObject;
          resolve(getSuccessResponse());
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }

  // update dropped assets
  updateDroppedAsset = (payload: object, updateType: string): Promise<ResponseType> => {
    return new Promise((resolve) => {
      this.topia.axios
        .put(
          `/world/${this.urlSlug}/assets/${this.id}/${updateType}`,
          {
            ...payload,
          },
          this.requestOptions,
        )
        .then(() => {
          resolve(getSuccessResponse());
        })
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  };

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
  }: UpdateBroadcastInterface): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ assetBroadcast, assetBroadcastAll, broadcasterEmail }, "set-asset-broadcast")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
    portalName,
    position,
  }: UpdateClickTypeInterface): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset(
        { clickType, clickableLink, clickableLinkTitle, portalName, position },
        "change-click-type",
      )
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
   * await droppedAsset.updateCustomText(style, "hello world");
   * ```
   */
  updateCustomText(style: object, text: string | null | undefined): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ style, text }, "set-custom-text")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
   *   "audioVolume": -1,
   *   "portalName": "community",
   *   "audioRadius": 0,
   *   "mediaName": "string"
   * });
   * ```
   */
  updateMediaType({
    audioRadius,
    audioVolume,
    isVideo,
    mediaLink,
    mediaName,
    mediaType,
    portalName,
    syncUserMedia,
  }: UpdateMediaTypeInterface): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset(
        { audioRadius, audioVolume, isVideo, mediaLink, mediaName, mediaType, portalName, syncUserMedia },
        "change-media-type",
      )
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
  updateMuteZone(isMutezone: boolean): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ isMutezone }, "set-mute-zone")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
  updatePosition(x: number, y: number): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ x, y }, "set-position")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }

  /**
   * @summary
   * Updates private zone options for a dropped asset.
   *
   * @usage
   * ```ts
   * await droppedAsset.updateMuteZone({
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
  }: UpdatePrivateZoneInterface): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset(
        { isPrivateZone, isPrivateZoneChatDisabled, privateZoneUserCap },
        "set-private-zone",
      )
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
  updateScale(assetScale: number): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ assetScale }, "change-scale")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
  updateUploadedMediaSelected(mediaId: string): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ mediaId }, "change-uploaded-media-selected")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
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
  updateWebImageLayers(bottom: string, top: string): Promise<ResponseType> {
    return new Promise((resolve) => {
      return this.updateDroppedAsset({ bottom, top }, "set-webimage-layers")
        .then(resolve)
        .catch((error) => {
          resolve(getErrorResponse({ error }));
        });
    });
  }
}

export default DroppedAsset;
