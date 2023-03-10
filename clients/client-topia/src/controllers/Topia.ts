import axios, { AxiosInstance } from "axios";

// interfaces
import { TopiaInterface } from "interfaces";

// utils
import { getBrowserWarning } from "utils";
import jwt from "jsonwebtoken";

/**
 * @summary
 * Create a single instance of Topia axios used for all calls to the public API in all classes
 *
 * @usage
 * ```ts
 * const topia = await new Topia({
 *   apiDomain: "api.topia.io",
 *   apiKey: "exampleKey",
 *   interactiveKey: "key",
 *   interactiveSecret: "secret",
 * });
 * ```
 */
export class Topia implements TopiaInterface {
  axios: AxiosInstance;
  apiDomain?: string;
  apiKey?: string;
  apiProtocol?: string;
  interactiveKey?: string;
  interactiveSecret?: jwt.Secret;

  constructor({
    apiDomain,
    apiKey,
    apiProtocol,
    interactiveKey,
    interactiveSecret,
  }: {
    apiDomain?: string;
    apiKey?: string;
    apiProtocol?: string;
    interactiveKey?: string;
    interactiveSecret?: jwt.Secret;
  }) {
    getBrowserWarning();

    this.apiDomain = apiDomain || "api.topia.io";
    this.apiKey = apiKey;
    this.apiProtocol = apiProtocol || "https";
    this.interactiveSecret = interactiveSecret;

    const headers: {
      "ApplicationId"?: string;
      "Authorization"?: string;
      "Content-Type": string;
      "PublicKey"?: string;
    } = {
      "ApplicationId": "sdk-js-topia",
      "Content-Type": "application/json",
    };

    if (apiKey) headers.Authorization = apiKey;
    if (interactiveKey) headers.PublicKey = interactiveKey;

    this.axios = axios.create({
      baseURL: `${this.apiProtocol}://${this.apiDomain}/api/v1`,
      headers,
    });
  }
}

export default Topia;
