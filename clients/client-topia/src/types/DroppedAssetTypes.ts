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

export type DroppedAssetLinkType = {
  clickableLink: string;
  clickableLinkTitle?: string;
  isForceLinkInIframe?: boolean;
  isOpenLinkInDrawer?: boolean;
  existingLinkId?: string;
  linkSamlQueryParams?: string;
};
