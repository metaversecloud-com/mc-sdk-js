import { VisitorType } from "types";

export const createVisitor = (Visitor: any, apiKey: string, data: VisitorType, urlSlug: string) => {
  return new Visitor(
    apiKey,
    data.color,
    data.displayName,
    data.gestureType,
    data.hidden,
    data.isAdmin,
    data.isBackground,
    data.isMobile,
    data.isRecording,
    data.isRecordingBot,
    data.lastUpdate,
    data.moveFrom,
    data.movedOn,
    data.moveTo,
    data.muted,
    data.performer,
    data.performerNear,
    data.playerId,
    data.shareScreen,
    data.sitting,
    urlSlug,
    data.username,
  );
};
