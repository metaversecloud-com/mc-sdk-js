import axios from "axios";

export class Asset {
  apiKey: string;
  email: string;

  constructor(apiKey: string, email: string) {
    this.apiKey = apiKey;
    this.email = email;
  }

  async fetchMyAssets(): Promise<object> {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.topia.io/api/assets/my-assets?email=${this.email}`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}

export default Asset;
