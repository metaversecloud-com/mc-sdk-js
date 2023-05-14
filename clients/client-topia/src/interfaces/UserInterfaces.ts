import { InteractiveCredentials, ResponseType } from "types";

export interface UserInterface {
  fetchAssets(): Promise<void | ResponseType>;
  fetchScenes(): Promise<void | ResponseType>;
  fetchWorldsByKey(): Promise<void | ResponseType>;
  fetchDataObject(): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
}

export interface UserOptionalInterface {
  credentials?: InteractiveCredentials | object;
  profileId?: string | null;
  visitorId?: number | null;
  urlSlug?: string;
}
