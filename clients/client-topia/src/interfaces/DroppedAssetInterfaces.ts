import {
  DroppedAssetClickType,
  DroppedAssetLinkType,
  DroppedAssetMediaType,
  DroppedAssetMediaVolumeRadius,
  InteractiveCredentials,
  ResponseType,
} from "types";
import { AssetInterface } from "interfaces";
import { AxiosResponse } from "axios";

export interface DroppedAssetInterface extends AssetInterface {
  fetchDroppedAssetById(): Promise<void | ResponseType>;
  deleteDroppedAsset(): Promise<void | ResponseType>;
  fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType>;
  setDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
  updateBroadcast({
    assetBroadcast,
    assetBroadcastAll,
    broadcasterEmail,
  }: UpdateBroadcastInterface): Promise<void | ResponseType>;
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
  }: UpdateClickTypeInterface): Promise<void | ResponseType>;
  updateCustomTextAsset(
    style: object | undefined | null,
    text: string | null | undefined,
  ): Promise<void | ResponseType>;
  updateMediaType({
    audioRadius,
    audioSliderVolume,
    isVideo,
    mediaLink,
    mediaName,
    mediaType,
    portalName,
    syncUserMedia,
  }: UpdateMediaTypeInterface): Promise<void | ResponseType>;
  updateMuteZone(isMutezone: boolean): Promise<void | ResponseType>;
  updateLandmarkZone({
    isLandmarkZoneEnabled,
    landmarkZoneName,
    landmarkZoneIsVisible,
  }: {
    isLandmarkZoneEnabled: boolean;
    landmarkZoneName?: string;
    landmarkZoneIsVisible?: boolean;
  }): Promise<void | ResponseType>;
  updateWebhookZone(isWebhookZoneEnabled: boolean): Promise<void | ResponseType>;
  updatePosition(x: number, y: number, yOrderAdjust?: number): Promise<void | ResponseType>;
  updatePrivateZone({
    isPrivateZone,
    isPrivateZoneChatDisabled,
    privateZoneUserCap,
  }: UpdatePrivateZoneInterface): Promise<void | ResponseType>;
  updateScale(assetScale: number): Promise<void | ResponseType>;
  flip(): Promise<void | ResponseType>;
  updateUploadedMediaSelected(mediaId: string): Promise<void | ResponseType>;
  updateWebImageLayers(bottom: string, top: string): Promise<void | ResponseType>;
  addWebhook({
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
  }): Promise<void | AxiosResponse>;
  setInteractiveSettings({
    isInteractive,
    interactivePublicKey,
  }: {
    isInteractive?: boolean;
    interactivePublicKey: string;
  }): Promise<void | ResponseType>;
  setClickableLinkMulti({ clickableLinks }: SetClickableLinkMultiInterface): Promise<void | ResponseType>;
  updateClickableLinkMulti({
    clickableLink,
    clickableLinkTitle,
    isForceLinkInIframe,
    isOpenLinkInDrawer,
    existingLinkId,
    linkSamlQueryParams,
  }: UpdateClickableLinkMultiInterface): Promise<void | ResponseType>;
  removeClickableLink({ linkId }: RemoveClickableLinkInterface): Promise<void | ResponseType>;
  fetchDroppedAssetAnalytics({
    periodType,
    dateValue,
    year,
  }: {
    periodType: "week" | "month" | "quarter" | "year";
    dateValue: number;
    year: number;
  }): Promise<void | ResponseType>;

  id?: string;
  assetId?: string;
  assetScale?: number | null;
  assetPodium?: boolean | null;
  audioRadius?: DroppedAssetMediaVolumeRadius | number | null;
  assetBroadcastAll?: boolean | null;
  assetPrivateConversation?: boolean | null;
  assetPrivateZoneChannelDisabled?: boolean | null;
  assetPrivateConversationCap?: number | null;
  audioSliderVolume?: number | null;
  bottomLayerURL?: string | null;
  broadcasterEmail?: string | null;
  clickableLinks?: Array<DroppedAssetClickType> | null;
  clickType?: string | null;
  clickableLink?: string | null;
  clickableLinkTitle?: string | null;
  clickablePortal?: string | null;
  creationDatetime?: number;
  contractAddress?: string | null;
  dataObject?: object | null;
  clickableDisplayTextDescription?: string | null;
  clickableDisplayTextHeadline?: string | null;
  existingKey?: string | null;
  interactivePublicKey?: string | null;
  isInteractive?: boolean | null;
  isLandmarkZoneEnabled?: boolean | null;
  isPrivateZone?: boolean | null;
  isVideoPlayer?: boolean | null;
  kitId?: string | null;
  layer0?: string | null;
  layer1?: string | null;
  mediaLink?: string | null;
  mediaPlayTime?: number | null;
  mediaType?: string | null;
  mediaName?: string | null;
  muteZone?: boolean | null;
  mediaUploadedId?: string | null;
  mediaUploadedLink?: string | null;
  metaName?: string | null;
  position: {
    x: number;
    y: number;
  };
  portalCoordsX?: number | null;
  portalCoordsY?: number | null;
  showMediaAsIfPeer?: boolean | null;
  syncUserMedia?: boolean | null;
  uniqueName?: string | null;
  urlSlug: string;
  tagJson?: string | null;
  text?: string | null;
  textColor?: string | null;
  textSize?: number | null;
  textWidth?: number | null;
  textWeight?: string | null;
  textFont?: string | null;
  textFontFamily?: string | null;
  teleportX?: number | null;
  teleportY?: number | null;
  topLayerURL?: string | null;
  tokenSymbol?: string | null;
  tokenName?: string | null;
  worldId?: string | null;
  walletAddress?: string | null;
  yOrderAdjust?: number | null;
}

export interface DroppedAssetOptionalInterface {
  attributes?: DroppedAssetInterface | { position?: { x: number; y: number }; text?: string; urlSlug?: string };
  credentials?: InteractiveCredentials | object;
}

export interface UpdateBroadcastInterface {
  assetBroadcast?: boolean;
  assetBroadcastAll?: boolean;
  broadcasterEmail?: string;
}

export interface UpdateDroppedAssetInterface {
  assetScale?: number;
  audioRadius?: DroppedAssetMediaVolumeRadius | number;
  audioSliderVolume?: number;
  clickType?: DroppedAssetClickType;
  clickableLink?: string;
  clickableLinkTitle?: string;
  clickableDisplayTextDescription?: string;
  clickableDisplayTextHeadline?: string;
  flipped?: boolean;
  isInteractive?: boolean;
  isTextTopLayer?: boolean;
  isVideo?: boolean;
  interactivePublicKey?: string;
  layer0?: string;
  layer1?: string;
  mediaLink?: string;
  mediaName?: string;
  mediaType?: DroppedAssetMediaType;
  position?: { x: number; y: number };
  portalName?: string;
  specialType?: string;
  syncUserMedia?: boolean;
  text?: string | null;
  textColor?: string | null;
  textSize?: number | null;
  textWidth?: number | null;
  textWeight?: string | null;
  uniqueName?: string;
  yOrderAdjust?: number;
}

export interface UpdateClickTypeInterface {
  clickType?: DroppedAssetClickType;
  clickableLink?: string;
  clickableLinkTitle?: string;
  clickableDisplayTextDescription?: string;
  clickableDisplayTextHeadline?: string;
  isForceLinkInIframe?: boolean;
  isOpenLinkInDrawer?: boolean;
  portalName?: string;
  position?: { x: number; y: number };
}

export interface SetClickableLinkMultiInterface {
  clickableLinks: DroppedAssetLinkType[];
}

export interface UpdateClickableLinkMultiInterface {
  clickableLink: string;
  clickableLinkTitle?: string;
  isForceLinkInIframe?: boolean;
  isOpenLinkInDrawer?: boolean;
  existingLinkId?: string;
  linkSamlQueryParams?: string;
}

export interface RemoveClickableLinkInterface {
  linkId: string;
}

export interface UpdateMediaTypeInterface {
  audioRadius: DroppedAssetMediaVolumeRadius | number;
  audioSliderVolume: number;
  isVideo: boolean;
  mediaLink: string;
  mediaName: string;
  mediaType: DroppedAssetMediaType;
  portalName: string;
  syncUserMedia: boolean;
}

export interface UpdatePrivateZoneInterface {
  isPrivateZone: boolean;
  isPrivateZoneChatDisabled: boolean;
  privateZoneUserCap: number;
}
