import { InteractiveCredentials, ResponseType } from "types";
import { SDKInterface } from "interfaces/SDKInterfaces";

export interface EcosystemInterface extends SDKInterface {
  fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  updateDataObject(dataObject: object, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;
}

export interface EcosystemOptionalInterface {
  credentials?: InteractiveCredentials;
}
