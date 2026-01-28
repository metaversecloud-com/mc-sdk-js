import { InteractiveCredentials, ResponseType } from "types";
import { SDKInterface } from "interfaces/SDKInterfaces";

export interface AssetInterface extends SDKInterface {
  fetchAssetById(): Promise<object | ResponseType>;
  updateAsset({
    assetName,
    bottomLayerURL,
    creatorTags,
    isPublic,
    shouldUploadImages,
    tagJson,
    topLayerURL,
  }: {
    assetName: string;
    bottomLayerURL?: string;
    creatorTags: object;
    isPublic: boolean;
    shouldUploadImages?: boolean;
    tagJson: string;
    topLayerURL?: string;
  }): Promise<object | ResponseType>;

  addedOn?: string;
  assetName?: string;
  creatorTags?: object;
  readonly id?: string;
  isPublic?: boolean;
  library?: string;
  originalAssetId?: string;
  originalKit?: string;
  ownerId?: string;
  ownerName?: string;
  platformAsset?: boolean;
  purchased?: boolean;
  purchaseDate?: string;
  purchasedFrom?: string;
  specialType?: string | null;
  transactionId?: string;
  type?: string;
}

export type AssetOptionalInterface = {
  attributes?: AssetInterface | object;
  credentials?: InteractiveCredentials;
};
