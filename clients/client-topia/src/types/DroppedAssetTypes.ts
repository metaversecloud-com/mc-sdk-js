export enum DroppedAssetClickType {
  NONE = "none",
  LINK = "link",
  PORTAL = "portal",
  TELEPORT = "teleport",
  WEBHOOK = "webhook",
}

export enum DroppedAssetMediaType {
  NONE = "none",
  LINK = "link",
}

export enum DroppedAssetMediaVolumeRadius {
  CLOSE = 0,
  MEDIUM = 1,
  FAR = 2,
  EVERYWHERE = 3,
}

export type DroppedAssetLinkType = {
  clickableLink: string;
  clickableLinkTitle?: string;
  isForceLinkInIframe?: boolean;
  isOpenLinkInDrawer?: boolean;
  existingLinkId?: string;
  linkSamlQueryParams?: string;
};
