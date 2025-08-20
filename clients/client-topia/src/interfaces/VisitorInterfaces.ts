import { InteractiveCredentials, ResponseType } from "types";
import { SDKInterface } from "interfaces/SDKInterfaces";
import { FireToastInterface } from "./SharedInterfaces";

export interface VisitorInterface extends SDKInterface {
  fetchVisitor(): Promise<void | ResponseType>;
  moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType>;
  fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType>;
  openIframe({ link, shouldOpenInDrawer, title }: OpenIframeInterface): Promise<void | ResponseType>;
  closeIframe(droppedAssetId: string): Promise<void | ResponseType>;
  fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;

  color?: string;
  dataObject?: object | null | undefined;
  displayName?: string;
  gestureType?: number;
  hidden?: boolean;
  isAdmin?: boolean;
  isBackground?: boolean;
  isMobile?: boolean;
  isRecording?: boolean;
  isRecordingBot?: boolean;
  landmarkZonesString?: string;
  lastUpdate?: number | undefined;
  moveFrom?: object;
  movedOn?: number | undefined;
  moveTo?: { x?: number; y?: number };
  muted?: boolean;
  performer?: boolean;
  performerNear?: boolean;
  privateZoneId?: string;
  id?: number | undefined;
  shareScreen?: boolean;
  sitting?: boolean;
  urlSlug: string;
  username?: string | undefined;
}

export interface VisitorOptionalInterface {
  attributes?: VisitorInterface | object;
  credentials?: InteractiveCredentials;
}

export interface MoveVisitorInterface {
  shouldTeleportVisitor: boolean;
  x: number;
  y: number;
}

export interface OpenIframeInterface {
  droppedAssetId: string;
  link: string;
  shouldOpenInDrawer?: boolean;
  title?: string;
}
