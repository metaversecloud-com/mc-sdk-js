import axios, { AxiosInstance } from "axios";
import { TopiaInterface } from "interfaces";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ apiKey: API_KEY, args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class Topia implements TopiaInterface {
  axios: AxiosInstance;
  apiDomain: string;
  apiKey?: string;
  interactiveKey?: string;
  interactiveSecret?: string;

  constructor({
    apiKey,
    apiDomain,
    interactiveKey,
    interactiveSecret,
  }: {
    apiKey?: string;
    apiDomain?: string;
    interactiveKey?: string;
    interactiveSecret?: string;
  }) {
    this.apiKey = apiKey;
    this.apiDomain = apiDomain || "api.topia.io";
    this.interactiveSecret = interactiveSecret;

    const headers: any = {
      "Content-Type": "application/json",
    };

    if (apiKey) headers.Authorization = apiKey;
    if (interactiveKey) headers.Publickey = interactiveKey;

    this.axios = axios.create({
      baseURL: `https://${apiDomain}/api`,
      headers,
    });
  }
}

export default Topia;
