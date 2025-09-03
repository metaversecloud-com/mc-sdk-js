import { InteractiveCredentials, ResponseType, WorldActivityType } from "types";
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
  updateCloseWorldSettings({
    closeWorldDescription,
    isWorldClosed,
  }: {
    closeWorldDescription: string;
    isWorldClosed: boolean;
  }): Promise<void | ResponseType>;
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
  fetchLandmarkZones(landmarkZoneName?: string, sceneDropId?: string): Promise<DroppedAsset[]>;
  fetchSceneDropIds(): Promise<object | ResponseType>;
  fetchScenes(): Promise<object | ResponseType>;
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
  getAllParticles(): Promise<ResponseType>;
  triggerParticle({
    id,
    name,
    duration,
    position,
  }: {
    id?: string;
    name?: string;
    duration?: number;
    position?: object;
  }): Promise<ResponseType | string>;
  triggerActivity({
    type,
    assetId,
    excludeFromNotification,
  }: {
    type: WorldActivityType;
    assetId: string;
    excludeFromNotification?: (string | number)[];
  }): Promise<ResponseType | string>;
  fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType>;
  fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
  fetchWebhooks(): Promise<void | ResponseType>;
  fetchWorldAnalytics({
    periodType,
    dateValue,
    year,
  }: {
    periodType: "week" | "month" | "quarter" | "year";
    dateValue: number;
    year: number;
  }): Promise<void | ResponseType>;

  dataObject?: object | null;
}

export interface WorldOptionalInterface {
  attributes?: WorldDetailsInterface | object;
  credentials?: InteractiveCredentials;
}

export interface WorldWebhooksInterface {
  webhooks: Array<WebhookInterface>;
}
