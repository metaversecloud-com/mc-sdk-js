import Visitor from "../controllers/Visitor";

export type VisitorType = {
  color: string;
  displayName: string;
  gestureType: number;
  hidden: boolean;
  isAdmin: boolean;
  isBackground: boolean;
  isMobile: boolean;
  isRecording: boolean;
  isRecordingBot: boolean;
  lastUpdate: number;
  moveFrom: object;
  movedOn: number;
  moveTo: { x: number; y: number };
  muted: boolean;
  performer: boolean;
  performerNear: boolean;
  playerId: number;
  shareScreen: boolean;
  sitting: boolean;
  username: string;
};

type VisitorsToMoveType = {
  visitorObj: Visitor;
  shouldTeleportVisitor: boolean;
  x: number;
  y: number;
};

export type VisitorsToMoveArrayType = Array<VisitorsToMoveType>;
