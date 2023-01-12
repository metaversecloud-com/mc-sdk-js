import { AxiosResponse } from "axios";
import { getErrorMessage } from "utils";
import { AssetInterface, TopiaInterface } from "interfaces";
import { AssetOptions, InteractiveCredentials } from "types";
import jwt from "jsonwebtoken";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ apiKey: API_KEY, args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class Asset implements AssetInterface {
  topia: TopiaInterface;
  creds?: InteractiveCredentials;
  readonly id?: string;
  jwt?: string;
  requestOptions: object;

  constructor(topia: TopiaInterface, options: AssetOptions = {}) {
    const { args = {}, creds } = options;
    this.topia = topia;
    this.creds = creds;

    if (creds) {
      this.jwt = jwt.sign(creds, topia.interactiveSecret);
      this.requestOptions = { headers: { Interactivejwt: this.jwt } };
    } else {
      this.requestOptions = {};
    }

    Object.assign(this, args);
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
