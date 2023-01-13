import { SDKInterface } from "./SDKInterfaces";

export interface WorldDetailsInterface extends SDKInterface {
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

export interface MoveAllVisitorsInterface {
  shouldFetchVisitors?: boolean;
  shouldTeleportVisitors?: boolean;
  scatterVisitorsBy?: number;
  x: number;
  y: number;
}
