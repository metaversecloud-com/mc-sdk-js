import { AnalyticType, InteractiveCredentials, ResponseType } from "types";
import { SDKInterface, FireToastInterface, UserInventoryItemInterface, InventoryItemInterface } from "./index.js";
import { UserInventoryItem, Visitor } from "controllers";

export interface VisitorInterface extends SDKInterface {
  fetchVisitor(): Promise<void | ResponseType>;
  moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType>;
  fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType>;
  openIframe({ link, shouldOpenInDrawer, title }: OpenIframeInterface): Promise<void | ResponseType>;
  reloadIframe(droppedAssetId: string): Promise<void | ResponseType>;
  closeIframe(droppedAssetId: string): Promise<void | ResponseType>;
  turnAVOff(): Promise<void | ResponseType>;
  getExpressions({ name, getUnlockablesOnly }: { name?: string; getUnlockablesOnly?: boolean }): Promise<ResponseType>;
  grantExpression({ id, name }: { id?: string; name?: string }): Promise<ResponseType>;
  getAllParticles(): Promise<ResponseType>;
  fetchInventoryItems(): Promise<void>;
  inventoryItems: UserInventoryItem[];
  grantInventoryItem(item: InventoryItemInterface, quantity: number): Promise<UserInventoryItem>;
  modifyInventoryItemQuantity(
    item: UserInventoryItemInterface | InventoryItemInterface,
    quantity: number,
  ): Promise<UserInventoryItem>;
  fetchInventoryItem(item: InventoryItemInterface): Promise<UserInventoryItem>;
  createNpc(userInventoryItemId: string, options?: { showNameplate?: boolean }): Promise<Visitor>;
  deleteNpc(): Promise<void>;
  getNpc(): Promise<Visitor | null>;
  startNpcVoiceSession(config: NpcVoiceConfigInterface): Promise<void | ResponseType>;
  stopNpcVoiceSession(): Promise<void | ResponseType>;

  triggerParticle({
    id,
    name,
    duration,
  }: {
    id?: string;
    name?: string;
    duration?: number;
  }): Promise<ResponseType | string>;
  fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
  updatePublicKeyAnalytics(analytics?: AnalyticType[]): Promise<void | ResponseType>;
  sendSignalToVisitor(signal: any): Promise<void | (ResponseType & { answerSignal: any })>;

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

export interface NpcVoiceConfigInterface {
  /** OpenAI ephemeral key (ek_*). Generated server-side, used once to establish WebRTC connection. */
  ephemeralKey: string;
  /** OpenAI voice ID (e.g., "alloy", "echo", "shimmer"). */
  voice: string;
  /** System prompt including curriculum context and behavioral instructions. */
  instructions: string;
  /** OpenAI model ID. Defaults to "gpt-4o-realtime-preview". */
  model?: string;
  /** Voice activity detection configuration. */
  turnDetection?: {
    type: "server_vad";
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
}
