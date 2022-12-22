import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI } from "utils";
import { AssetInterface } from "interfaces";

export class Asset {
  apiKey: string;

  constructor({ apiKey, args }: { apiKey: string; args: AssetInterface }) {
    this.apiKey = apiKey;
    Object.assign(this, args);
  }

  fetchAssetsByEmail(ownerEmail: string): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/assets/my-assets?email=${ownerEmail}`)
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
