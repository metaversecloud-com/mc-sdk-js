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

  constructor(topia: Topia, credentials: InteractiveCredentials = {}) {
    const {
      apiKey = null,
      assetId = null,
      interactiveNonce = null,
      profileId = null,
      urlSlug = null,
      visitorId = null,
    } = credentials;
    this.topia = topia;
    this.credentials = credentials;
    this.requestOptions = {};

    let payload = {};
    const headers: any = {};

    try {
      if (topia.interactiveSecret && (profileId || assetId || urlSlug || visitorId)) {
        payload = {
          interactiveNonce,
          visitorId,
          assetId,
          date: new Date(),
        };
        this.jwt = jwt.sign(payload, topia.interactiveSecret as string);
        headers.InteractiveJWT = this.jwt;
      }
      if (apiKey) {
        headers.Authorization = apiKey;
      }
      this.requestOptions = { headers };
    } catch (error) {
      this.errorHandler({ error });
    }
  }

  topiaPublicApi() {
    return this.topia.axios;
  }

  errorHandler({
    error,
    message = "Something went wrong. Please try again or contact support.",
    params = {},
    sdkMethod,
  }: {
    error?: Error | AxiosError | unknown;
    message?: string;
    params?: object;
    sdkMethod?: string;
  }) {
    const stackTrace = new Error("Thrown here:");
    let data = {},
      errorMessage = message,
      method = "unknown",
      stack = "empty",
      status = 500,
      url = "unknown";

    if (error instanceof AxiosError) {
      errorMessage = error?.message || message;
      if (error.response) {
        status = error.response.status;
        data = error.response.data;
        if (error.response.data.errors) errorMessage = error.response.data.errors[0].message;
      }
      if (error?.config?.url) url = error.config.url;
      if (error?.config?.method) method = error.config.method;
      stack = `${error.stack}\n${stackTrace.stack}`;
    } else if (error instanceof Error) {
      errorMessage = error?.message || message;
      stack = `${error.stack}\n${stackTrace.stack}`;
    }

    return {
      data,
      message: errorMessage,
      method,
      params,
      sdkMethod,
      stack,
      stackTrace,
      status,
      success: false,
      url,
    };
  }
}

export default SDKController;
