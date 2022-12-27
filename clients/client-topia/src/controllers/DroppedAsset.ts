import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI } from "utils";
import {
  DroppedAssetInterface,
  UpdateBroadcastInterface,
  UpdateClickTypeInterface,
  UpdateMediaTypeInterface,
  UpdatePrivateZoneInterface,
} from "interfaces";
import Asset from "./Asset";

export class DroppedAsset extends Asset implements DroppedAssetInterface {
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
    this.id = id;
    this.text = args.text;
    this.urlSlug = urlSlug;
    this.updateCustomText;
  }

  // get dropped asset
  fetchDroppedAssetById(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
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
      publicAPI(this.apiKey)
        .delete(`/world/${this.urlSlug}/assets/${this.id}`)
        .then(() => {
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
      publicAPI(this.apiKey)
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

  updateBroadcast({ assetBroadcast, assetBroadcastAll, broadcasterEmail }: UpdateBroadcastInterface): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ assetBroadcast, assetBroadcastAll, broadcasterEmail }, "set-asset-broadcast")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

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

  updateCustomText(style: object, text: string | null | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ style, text }, "set-custom-text")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

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

  updateMuteZone(isMutezone: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ isMutezone }, "set-mute-zone")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  updatePosition(x: number, y: number): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ x, y }, "set-position")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

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

  updateScale(assetScale: number): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ assetScale }, "change-scale")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  updateUploadedMediaSelected(mediaId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ mediaId }, "change-uploaded-media-selected")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

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
