import { AxiosResponse } from "axios";
import { getErrorMessage } from "utils";
import {
  DroppedAssetInterface,
  UpdateBroadcastInterface,
  UpdateClickTypeInterface,
  UpdateMediaTypeInterface,
  UpdatePrivateZoneInterface,
} from "interfaces";
import Asset from "./Asset";

/**
 * Create an instance of Dropped Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new DroppedAsset({ apiKey: API_KEY, id: "1giFZb0sQ3X27L7uGyQX", urlSlug: "magic" });
 * ```
 */
export class DroppedAsset extends Asset implements DroppedAssetInterface {
  dataObject: object | null | undefined;
  readonly id: string;
  text: string | null | undefined;
  urlSlug: string;

  constructor({
    apiKey,
    id,
    args,
    urlSlug,
  }: {
    apiKey: string;
    id: string;
    args: DroppedAssetInterface;
    urlSlug: string;
  }) {
    super({ apiKey, args });
    Object.assign(this, args);
    this.apiKey = apiKey;
    this.dataObject = args.dataObject;
    this.id = id;
    this.text = args.text;
    this.urlSlug = urlSlug;
    this.updateCustomText;
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
  fetchDroppedAssetById(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.axios
        .get(`/world/${this.urlSlug}/assets/${this.id}`)
        .then((response: AxiosResponse) => {
          Object.assign(this, response.data);
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  // delete dropped asset
  deleteDroppedAsset(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.axios
        .delete(`/world/${this.urlSlug}/assets/${this.id}`)
        .then(() => {
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  fetchDroppedAssetDataObject(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.axios
        .get(`/world/${this.urlSlug}/assets/${this.id}/data-object`)
        .then((response: AxiosResponse) => {
          this.dataObject = response.data;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  /**
   * @summary
   * Updates the data object for a dropped asset.
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
  updateDroppedAssetDataObject(dataObject: object): Promise<string> {
    return new Promise((resolve, reject) => {
      this.axios
        .put(`/world/${this.urlSlug}/assets/${this.id}/set-data-object`, dataObject)
        .then(() => {
          this.dataObject = dataObject;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  // update dropped assets
  #updateDroppedAsset = (payload: object, updateType: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.axios
        .put(`/world/${this.urlSlug}/assets/${this.id}/${updateType}`, {
          ...payload,
        })
        .then(() => {
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updateBroadcast({ assetBroadcast, assetBroadcastAll, broadcasterEmail }: UpdateBroadcastInterface): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ assetBroadcast, assetBroadcastAll, broadcasterEmail }, "set-asset-broadcast")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  }: UpdateClickTypeInterface): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset(
        { clickType, clickableLink, clickableLinkTitle, portalName, position },
        "change-click-type",
      )
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updateCustomText(style: object, text: string | null | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ style, text }, "set-custom-text")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  }: UpdateMediaTypeInterface): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset(
        { audioRadius, audioVolume, isVideo, mediaLink, mediaName, mediaType, portalName, syncUserMedia },
        "change-media-type",
      )
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updateMuteZone(isMutezone: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ isMutezone }, "set-mute-zone")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updatePosition(x: number, y: number): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ x, y }, "set-position")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  }: UpdatePrivateZoneInterface): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset(
        { isPrivateZone, isPrivateZoneChatDisabled, privateZoneUserCap },
        "set-private-zone",
      )
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updateScale(assetScale: number): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ assetScale }, "change-scale")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updateUploadedMediaSelected(mediaId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ mediaId }, "change-uploaded-media-selected")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
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
  updateWebImageLayers(bottom: string, top: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ bottom, top }, "set-webimage-layers")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default DroppedAsset;
