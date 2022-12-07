import { DroppedAssetType } from "types";
import { publicAPI } from "utils";
import Asset from "./Asset";

export class DroppedAsset extends Asset {
  // TODO: should we explicitly declare each or simplify with Object.assign for all optional properties? (kinda breaks the ts rules but looks so much nicer!)
  constructor(public apiKey: string, args: DroppedAssetType, public urlSlug: string) {
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

  fetchDroppedAssetById(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/assets/${this.id}`)
        .then((response: any) => {
          Object.assign(this, response.data);
          resolve("Success!");
        })
        .catch(reject);
    });
  }

  updateCustomText(style: object, text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/assets/${this.id}/set-custom-text`, {
          style,
          text,
        })
        .then(() => {
          resolve("Success!");
        })
        .catch(reject);
    });
  }
}

export default Asset;
