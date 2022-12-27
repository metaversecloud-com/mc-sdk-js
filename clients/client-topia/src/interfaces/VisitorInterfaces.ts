export interface VisitorInterface {
  color: string;
  displayName: string;
  gestureType: number;
  hidden: boolean;
  isAdmin: boolean;
  isBackground: boolean;
  isMobile: boolean;
  isRecording: boolean;
  isRecordingBot: boolean;
  lastUpdate: number | undefined;
  moveFrom: object;
  movedOn: number | undefined;
  moveTo: { x: number; y: number };
  muted: boolean;
  performer: boolean;
  performerNear: boolean;
  playerId: number;
  shareScreen: boolean;
  sitting: boolean;
  username: string | undefined;
}
