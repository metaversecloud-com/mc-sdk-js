import { DroppedAssetClickType, DroppedAssetMediaType, InteractiveCredentials } from "types";
import { AssetInterface } from "interfaces";

export interface DroppedAssetInterface extends AssetInterface {
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

export interface DroppedAssetOptionalInterface {
  attributes?: DroppedAssetInterface | { text: string };
  credentials?: InteractiveCredentials | object;
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
