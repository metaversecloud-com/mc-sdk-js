import axios, { AxiosInstance } from "axios";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ apiKey: API_KEY, args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class SDKController {
  apiKey: string;
  axios: AxiosInstance;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;

    this.axios = axios.create({
      baseURL: "https://api.topia.io/api",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json",
      },
    });
  }
}

export default SDKController;
