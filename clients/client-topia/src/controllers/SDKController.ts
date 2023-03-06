// controllers
import { Topia } from "controllers/Topia";

// interfaces
import { SDKInterface } from "interfaces";

// types
import { InteractiveCredentials } from "types";

// utils
import jwt from "jsonwebtoken";
import { AxiosError } from "axios";

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
 *   visitorId: 1,
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
  stackTrace?: Error;

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
      headers.InteractiveJWT = this.jwt;
    }
    if (apiKey) {
      headers.Authorization = apiKey;
    }
    this.requestOptions = { headers };
  }

  topiaPublicApi() {
    this.stackTrace = new Error("Thrown here:");
    return this.topia.axios;
  }

  errorHandler({
    error,
    message = "Something went wrong. Please try again or contact support.",
  }: {
    error?: Error | AxiosError | unknown;
    message?: string;
  }) {
    let data = {},
      errorMessage = message,
      status = 500,
      url = "unknown",
      method = "unknown",
      stack = "empty";

    if (error instanceof AxiosError) {
      errorMessage = error?.message || message;
      if (error.response) {
        status = error.response.status;
        data = error.response.data;
      }
      if (error?.config?.url) url = error.config.url;
      if (error?.config?.method) method = error.config.method;
      if (this.stackTrace?.stack) stack = `${error.stack}\n${this.stackTrace.stack}`;
    } else if (error instanceof Error) {
      errorMessage = error?.message || message;
      if (this.stackTrace?.stack) stack = `${error.stack}\n${this.stackTrace.stack}`;
    }

    return { success: false, status, url, method, message: errorMessage, data, stack };
  }
}

export default SDKController;
