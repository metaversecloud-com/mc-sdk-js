import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI } from "utils";
import { AssetInterface } from "interfaces";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ apiKey: API_KEY, args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class Asset {
  apiKey: string;

  constructor({ apiKey, args }: { apiKey: string; args: AssetInterface }) {
    this.apiKey = apiKey;
    Object.assign(this, args);
  }

  fetchPlatformAssets(): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get("/assets/topia-assets")
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default Asset;
