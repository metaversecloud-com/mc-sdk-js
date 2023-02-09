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
  apiDomain: string;
  apiKey?: string;
  interactiveKey?: string;
  interactiveSecret?: jwt.Secret;

  constructor({
    apiKey,
    apiDomain,
    interactiveKey,
    interactiveSecret,
  }: {
    apiKey?: string;
    apiDomain?: string;
    interactiveKey?: string;
    interactiveSecret?: jwt.Secret;
  }) {
    getBrowserWarning();

    this.apiKey = apiKey;
    this.apiDomain = apiDomain || "api.topia.io";
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
      baseURL: `https://${this.apiDomain}/api`,
      headers,
    });
  }
}

export default Topia;
