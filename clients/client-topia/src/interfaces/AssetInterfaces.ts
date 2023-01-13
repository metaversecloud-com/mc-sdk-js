import { InteractiveCredentials } from "types";
import { SDKInterface } from "interfaces/SDKInterfaces";

export interface AssetInterface extends SDKInterface {
  fetchPlatformAssets(): Promise<object>;
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
  credentials?: InteractiveCredentials | object;
};
