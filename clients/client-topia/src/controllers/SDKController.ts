// controllers
import { Topia } from "controllers/Topia";

// interfaces
import { SDKInterface } from "interfaces";

// types
import { InteractiveCredentials } from "types";

// utils
import jwt from "jsonwebtoken";

/**
 * Create an instance of SDKController class with credentials.
 *
 * ```ts
 * const creds = {
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
 * await new SDKController({ creds, topia });
 * ```
 */
export class SDKController implements SDKInterface {
  creds: InteractiveCredentials | undefined;
  jwt?: string;
  requestOptions: object;
  topia: Topia;

  constructor(topia: Topia, creds: InteractiveCredentials = {}) {
    this.topia = topia;
    const { assetId, interactiveNonce, playerId } = creds;

    let payload = {};
    if (playerId && assetId && interactiveNonce) {
      payload = {
        interactiveNonce,
        playerId,
        assetId,
      };
      this.jwt = jwt.sign(payload, topia.interactiveSecret as string);
      this.requestOptions = { headers: { Interactivejwt: this.jwt } };
    } else {
      this.requestOptions = {};
    }
  }
}

export default SDKController;
