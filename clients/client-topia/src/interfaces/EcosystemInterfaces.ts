import { InteractiveCredentials, ResponseType } from "types";

export interface EcosystemInterface {
  fetchDataObject(appPublicKey?: string, appPublicKeyJWT?: string): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
}

export interface EcosystemOptionalInterface {
  credentials?: InteractiveCredentials;
}
