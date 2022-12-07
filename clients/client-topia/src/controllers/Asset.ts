import { publicAPI } from "utils";

export class Asset {
  apiKey: string;
  email: string;

  constructor(apiKey: string, email: string) {
    this.apiKey = apiKey;
    this.email = email;
  }

  async fetchAssetsByEmail(): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/assets/my-assets?email=${this.email}`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}

export default Asset;
