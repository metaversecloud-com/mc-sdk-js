import axios, { AxiosInstance } from "axios";

// interfaces
import { TopiaInterface } from "interfaces";

// utils
import { getBrowserWarning } from "utils";
import jwt from "jsonwebtoken";

/**
 * Create a single instance of Topia axios used for all calls to the public API in all classes
 *
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
      "Authorization"?: string;
      "Content-Type": string;
      "Publickey"?: string;
    } = {
      "Content-Type": "application/json",
    };

    if (apiKey) headers.Authorization = apiKey;
    if (interactiveKey) headers.Publickey = interactiveKey;

    this.axios = axios.create({
      baseURL: `https://${this.apiDomain}/api`,
      headers,
    });
  }
}

export default Topia;
