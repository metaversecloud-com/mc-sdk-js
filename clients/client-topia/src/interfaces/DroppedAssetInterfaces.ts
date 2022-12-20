import { DroppedAssetClickType, DroppedAssetMediaType } from "types";

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
