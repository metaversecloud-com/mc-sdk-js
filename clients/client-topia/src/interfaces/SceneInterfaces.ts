import { InteractiveCredentials, ResponseType } from "types";

export interface SceneInterface {
  fetchSceneById(): Promise<void | ResponseType>;
  id: string;
  background?: null;
  description?: string;
  created?: {
    _seconds?: number;
    _nanoseconds?: number;
  };
  height?: number;
  kitWorldOwner?: string;
  name?: string;
  price?: number;
  spawnPosition?: {
    radius?: number;
    y?: number;
    x?: number;
  };
  timesUsed?: number;
  urlSlug?: string;
  width?: number;
  worldCenteredAtZero?: boolean;
}

export type SceneOptionalInterface = {
  attributes?: SceneInterface | object;
  credentials?: InteractiveCredentials | object;
};
