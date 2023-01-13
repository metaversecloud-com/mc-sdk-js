import { DroppedAssetClickType, DroppedAssetMediaType } from "types";
import { AssetInterface } from "interfaces";

export interface DroppedAssetInterface extends AssetInterface {
  fetchDroppedAssetById(): Promise<string>;
  deleteDroppedAsset(): Promise<string>;
  fetchDroppedAssetDataObject(): Promise<string>;
  updateDroppedAssetDataObject(dataObject: object): Promise<string>;
  updateDroppedAsset(payload: object, updateType: string): Promise<string>;
  updateBroadcast({ assetBroadcast, assetBroadcastAll, broadcasterEmail }: UpdateBroadcastInterface): Promise<string>;
  updateClickType({
    clickType,
    clickableLink,
    clickableLinkTitle,
    portalName,
    position,
  }: UpdateClickTypeInterface): Promise<string>;
  updateCustomText(style: object, text: string): Promise<string>;
  updateMediaType({
    audioRadius,
    audioVolume,
    isVideo,
    mediaLink,
    mediaName,
    mediaType,
    portalName,
    syncUserMedia,
  }: UpdateMediaTypeInterface): Promise<string>;
  updateMuteZone(isMutezone: boolean): Promise<string>;
  updatePosition(x: number, y: number): Promise<string>;
  updatePrivateZone({
    isPrivateZone,
    isPrivateZoneChatDisabled,
    privateZoneUserCap,
  }: UpdatePrivateZoneInterface): Promise<string>;
  updateScale(assetScale: number): Promise<string>;
  updateUploadedMediaSelected(mediaId: string): Promise<string>;
  updateWebImageLayers(bottom: string, top: string): Promise<string>;
  fetchPlatformAssets(): Promise<object>;
  id?: string;
  assetId?: string;
  assetScale?: number | null;
  assetPodium?: boolean | null;
  audioRadius?: number | null;
  assetBroadcastAll?: boolean | null;
  assetPrivateConversation?: boolean | null;
  assetPrivateZoneChannelDisabled?: boolean | null;
  assetPrivateConversationCap?: number | null;
  audioVolume?: number | null;
  broadcasterEmail?: string | null;
  clickType?: string | null;
  clickableLink?: string | null;
  clickableLinkTitle?: string | null;
  clickablePortal?: string | null;
  creationDatetime?: number;
  contractAddress?: string | null;
  dataObject?: object | null;
  existingKey?: string | null;
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
  position?: {
    x?: number;
    y?: number;
  };
  portalCoordsX?: number | null;
  portalCoordsY?: number | null;
  showMediaAsIfPeer?: boolean | null;
  syncUserMedia?: boolean | null;
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
  tokenSymbol?: string | null;
  tokenName?: string | null;
  worldId?: string | null;
  walletAddress?: string | null;
  yOrderAdjust?: number | null;
}

export interface UpdateBroadcastInterface {
  assetBroadcast?: boolean;
  assetBroadcastAll?: boolean;
  broadcasterEmail?: string;
}

export interface UpdateClickTypeInterface {
  clickType: DroppedAssetClickType;
  clickableLink: string;
  clickableLinkTitle: string;
  portalName: string;
  position: { x: number; y: number };
}

export interface UpdateMediaTypeInterface {
  audioRadius: number;
  audioVolume: number;
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
