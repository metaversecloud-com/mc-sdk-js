import { InteractiveCredentials, ResponseType } from "types";
import { FireToastInterface, SDKInterface, WebhookInterface } from "interfaces";
import { DroppedAsset } from "controllers/DroppedAsset";

export interface WorldDetailsInterface {
  background?: string | null;
  controls?: {
    allowMuteAll?: boolean;
    disableHideVideo?: boolean;
    isMobileDisabled?: boolean;
    isShowingCurrentGuests?: boolean;
  };
  created?: object;
  description?: string;
  enforceWhitelistOnLogin?: boolean;
  forceAuthOnLogin?: boolean;
  height?: number;
  heroImage?: string;
  mapExists?: boolean;
  name?: string;
  redirectTo?: string | null;
  spawnPosition?: {
    x?: number;
    y?: number;
  };
  tileBackgroundEverywhere?: boolean | null;
  urlSlug: string;
  useTopiaPassword?: boolean;
  width?: number;
}

export interface WorldInterface extends SDKInterface, WorldDetailsInterface {
  fetchDetails(): Promise<void | ResponseType>;
  updateDetails({
    controls,
    description,
    forceAuthOnLogin,
    height,
    name,
    spawnPosition,
    width,
  }: WorldDetailsInterface): Promise<void | ResponseType>;
  fetchDroppedAssets(): Promise<void | ResponseType>;
  fetchDroppedAssetsWithUniqueName({
    uniqueName,
    isPartial,
    isReversed,
  }: {
    uniqueName: string;
    isPartial?: boolean;
    isReversed?: boolean;
  }): Promise<DroppedAsset[]>;
  fetchDroppedAssetsBySceneDropId({
    sceneDropId,
    uniqueName,
  }: {
    sceneDropId: string;
    uniqueName?: string;
  }): Promise<DroppedAsset[]>;
  updateCustomTextDroppedAssets(droppedAssetsToUpdate: Array<DroppedAsset>, style: object): Promise<object>;
  dropScene({
    assetSuffix,
    position,
    sceneId,
  }: {
    assetSuffix: string;
    position: object;
    sceneId: string;
  }): Promise<object | ResponseType>;
  replaceScene(sceneId: string): Promise<void | ResponseType>;
  fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType>;
  fetchDataObject(appPublicKey?: string, appPublicKeyJWT?: string): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
  dataObject?: object | null;
}

export interface WorldOptionalInterface {
  attributes?: WorldDetailsInterface | object;
  credentials?: InteractiveCredentials;
}

export interface WorldWebhooksInterface {
  webhooks: Array<WebhookInterface>;
}
