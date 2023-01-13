import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import Topia from "controllers/Topia";

// interfaces
import { AssetInterface } from "interfaces";

// types
import { AssetOptions } from "types";

// utils
import { getErrorMessage } from "utils";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class Asset extends SDKController implements AssetInterface {
  readonly id?: string;
  jwt?: string;

  constructor(topia: Topia, id: string, { options }: { options: AssetOptions }) {
    super(topia, { creds: options.creds });
    this.id = id;
    Object.assign(this, options.args);
  }

  fetchPlatformAssets(): Promise<object> {
    return new Promise((resolve, reject) => {
      this.topia.axios
        .get("/assets/topia-assets", this.requestOptions)
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
