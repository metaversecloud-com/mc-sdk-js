import Asset from "./Asset";
import { DroppedAssetType } from "types";
import { getErrorMessage, publicAPI } from "utils";

export class DroppedAsset extends Asset {
  // TODO: should we explicitly declare each or simplify with Object.assign for all optional properties? (kinda breaks the ts rules but looks so much nicer!)
  constructor(public apiKey: string, args: DroppedAssetType, public text: string, public urlSlug: string) {
    super(
      args.addedOn,
      apiKey,
      args.assetName,
      args.creatorTags,
      args.id,
      args.isPublic,
      args.kitId,
      args.layer0,
      args.layer1,
      args.library,
      args.originalAssetId,
      args.originalKit,
      args.ownerId,
      args.ownerName,
      args.platformAsset,
      args.purchased,
      args.purchaseDate,
      args.purchasedFrom,
      args.specialType,
      args.transactionId,
      args.type,
      urlSlug,
    );
    Object.assign(this, args);
    this.updateCustomText;
  }

  // get dropped asset
  fetchDroppedAssetById(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/assets/${this.id}`)
        .then((response: any) => {
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

  changeScale(assetScale: number): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ assetScale }, "change-scale")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  setPosition(x: number, y: number): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ x, y }, "set-position")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  updateCustomText(style: object, text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.#updateDroppedAsset({ style, text }, "set-custom-text")
        .then(resolve)
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default Asset;
