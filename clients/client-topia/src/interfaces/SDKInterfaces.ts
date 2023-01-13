import { InteractiveCredentials } from "types";
import { Topia } from "controllers";

export interface SDKInterface {
  credentials?: InteractiveCredentials;
  jwt?: string;
  requestOptions: object;
  topia: Topia;
}
