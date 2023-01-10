import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI } from "utils";
import { AssetInterface } from "interfaces";
import { SDKController } from "controllers";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ apiKey: API_KEY, args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class Asset extends SDKController {
  constructor({ apiKey, args }: { apiKey: string; args: AssetInterface }) {
    super({ apiKey });

    Object.assign(this, args);
  }

  fetchPlatformAssets(): Promise<object> {
    return new Promise((resolve, reject) => {
      this.axios
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
