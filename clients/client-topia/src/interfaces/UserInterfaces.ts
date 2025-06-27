import { InteractiveCredentials, ResponseType } from "types";

export interface UserInterface {
  fetchAssets(): Promise<void | ResponseType>;
  fetchPlatformAssets(): Promise<object | ResponseType>;
  fetchScenes(): Promise<void | ResponseType>;
  fetchWorldsByKey(): Promise<void | ResponseType>;
  fetchDataObject(appPublicKey?: string, appJWT?: string): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
  dataObject?: object | null;
}

export interface UserOptionalInterface {
  credentials?: InteractiveCredentials;
  profileId?: string | null;
  visitorId?: number | null;
  urlSlug?: string;
}
