import { InteractiveCredentials, ResponseType } from "types";

export interface WebRTCConnectorInterface {
  getTwilioConfig(): Promise<void | ResponseType>;
}

export interface WebRTCConnectorOptionalInterface {
  credentials?: InteractiveCredentials;
  twilioConfig?: object;
}
