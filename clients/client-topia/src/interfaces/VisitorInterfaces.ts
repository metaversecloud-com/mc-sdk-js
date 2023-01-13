import { SDKInterface } from "./SDKInterfaces";

export interface VisitorInterface extends SDKInterface {
  moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<string>;
  color?: string;
  displayName?: string;
  gestureType?: number;
  hidden?: boolean;
  isAdmin?: boolean;
  isBackground?: boolean;
  isMobile?: boolean;
  isRecording?: boolean;
  isRecordingBot?: boolean;
  lastUpdate?: number | undefined;
  moveFrom?: object;
  movedOn?: number | undefined;
  moveTo?: { x?: number; y?: number };
  muted?: boolean;
  performer?: boolean;
  performerNear?: boolean;
  id?: number | undefined;
  shareScreen?: boolean;
  sitting?: boolean;
  urlSlug: string;
  username?: string | undefined;
}

export interface MoveVisitorInterface {
  shouldTeleportVisitor: boolean;
  x: number;
  y: number;
}
