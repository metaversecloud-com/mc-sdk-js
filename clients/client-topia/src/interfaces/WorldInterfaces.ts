import { InteractiveCredentials } from "types";
import { SDKInterface } from "interfaces/SDKInterfaces";

export interface WorldInterface extends SDKInterface {
  background?: string | null;
  controls?: {
    allowMuteAll?: boolean;
    disableHideVideo?: boolean;
    isMobileDisabled?: boolean;
    isShowingCurrentGuests?: boolean;
  };
  created?: object;
  description?: string;
  enforceWhitelistOnLogin?: boolean;
  forceAuthOnLogin?: boolean;
  height?: number;
  heroImage?: string;
  mapExists?: boolean;
  name?: string;
  redirectTo?: string | null;
  spawnPosition?: {
    x?: number;
    y?: number;
  };
  tileBackgroundEverywhere?: boolean | null;
  urlSlug: string;
  useTopiaPassword?: boolean;
  width?: number;
}

export interface WorldOptionalInterface {
  attributes?: WorldInterface | object;
  credentials?: InteractiveCredentials | object;
}

export interface MoveAllVisitorsInterface {
  shouldFetchVisitors?: boolean;
  shouldTeleportVisitors?: boolean;
  scatterVisitorsBy?: number;
  x: number;
  y: number;
}
