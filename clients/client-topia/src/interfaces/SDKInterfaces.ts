import { InteractiveCredentials } from "types";
import { Topia } from "controllers";

export interface SDKInterface {
  creds?: InteractiveCredentials;
  jwt?: string;
  requestOptions: object;
  topia: Topia;
}
