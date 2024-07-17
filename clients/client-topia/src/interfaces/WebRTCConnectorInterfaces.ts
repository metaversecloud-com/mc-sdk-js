import { InteractiveCredentials, ResponseType } from "types";

export interface WebRTCConnectorInterface {
  getTwilioConfig(): Promise<void | ResponseType>;
  // setTwilioConfig(twilioConfig: object): Promise<{ success: boolean }>;
}

export interface WebRTCConnectorOptionalInterface {
  credentials?: InteractiveCredentials;
  twilioConfig?: object;
}
