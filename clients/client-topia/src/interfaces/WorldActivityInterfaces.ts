import { InteractiveCredentials } from "types";

export interface WorldActivityOptionalInterface {
  credentials?: InteractiveCredentials | object;
}

export interface MoveAllVisitorsInterface {
  shouldFetchVisitors?: boolean;
  shouldTeleportVisitors?: boolean;
  scatterVisitorsBy?: number;
  x: number;
  y: number;
}
