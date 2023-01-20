// controllers
import { Topia } from "controllers/Topia";

// interfaces
import { SDKInterface } from "interfaces";

// types
import { InteractiveCredentials } from "types";

// utils
import jwt from "jsonwebtoken";

/**
 * @summary
 * Create an instance of SDKController class with credentials.
 *
 * @usage
 * ```ts
 * const credentials = {
 *   assetId: "exampleAsset",
 *   interactiveNonce: "exampleNonce"
 *   interactivePublicKey: "examplePublicKey",
 *   playerId: 1,
 *   url: "https://topia.io",
 * }
 * const topia = await new Topia({
 *   apiDomain: "api.topia.io",
 *   apiKey: "exampleKey",
 *   interactiveKey: "key",
 *   interactiveSecret: "secret",
 * }
 * await new SDKController({ credentials, topia });
 * ```
 */
export class SDKController implements SDKInterface {
  credentials: InteractiveCredentials | undefined;
  jwt?: string;
  requestOptions: object;
  topia: Topia;

  constructor(topia: Topia, credentials: InteractiveCredentials = {}) {
    const { assetId, interactiveNonce, visitorId, apiKey } = credentials;
    this.topia = topia;
    this.credentials = credentials;
    this.requestOptions = {};

    let payload = {};
    const headers: any = {};
    if (visitorId && assetId && interactiveNonce) {
      payload = {
        interactiveNonce,
        visitorId,
        assetId,
      };
      this.jwt = jwt.sign(payload, topia.interactiveSecret as string);
      headers.Interactivejwt = this.jwt;
    }
    if (apiKey) {
      headers.Authorization = apiKey;
    }
    this.requestOptions = { headers };
  }
}

export default SDKController;
