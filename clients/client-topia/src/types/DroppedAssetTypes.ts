export type DroppedAssetType = {
  addedOn?: string;
  assetId?: string;
  assetName?: string;
  assetScale?: number;
  assetPodium?: boolean;
  audioRadius?: number;
  assetBroadcastAll?: boolean;
  assetPrivateConversation?: boolean;
  assetPrivateZoneChannelDisabled?: boolean;
  assetPrivateConversationCap?: number;
  audioVolume?: number;
  broadcasterEmail?: string;
  clickType?: string;
  clickableLink?: string;
  clickableLinkTitle?: string;
  clickablePortal?: string;
  creationDatetime?: number;
  creatorTags?: object;
  contractAddress?: string;
  existingKey?: string;
  id?: string;
  isPublic?: boolean;
  isVideoPlayer?: boolean;
  kitId?: string;
  layer0?: string;
  layer1?: string;
  library?: string;
  mediaLink?: string;
  mediaPlayTime?: number;
  mediaType?: string;
  mediaName?: string;
  muteZone?: boolean;
  mediaUploadedId?: string;
  mediaUploadedLink?: string;
  metaName?: string;
  originalAssetId?: string;
  originalKit?: string;
  ownerId?: string;
  ownerName?: string;
  platformAsset?: boolean;
  position?: {
    x?: number;
    y?: number;
  };
  portalCoordsX?: number;
  portalCoordsY?: number;
  purchased?: boolean;
  purchaseDate?: string;
  purchasedFrom?: string;
  specialType?: string;
  transactionId?: string;
  showMediaAsIfPeer?: boolean;
  syncUserMedia?: boolean;
  tagJson?: string;
  type?: string;
  text?: string;
  textColor?: string;
  textSize?: number;
  textWidth?: number;
  textWeight?: string;
  textFont?: string;
  textFontFamily?: string;
  teleportX?: number;
  teleportY?: number;
  tokenSymbol?: string;
  tokenName?: string;
  worldId?: string;
  walletAddress?: string;
  yOrderAdjust?: number;
};

export enum DroppedAssetClickType {
  NONE = "none",
  LINK = "link",
  PORTAL = "portal",
  TELEPORT = "teleport",
}
