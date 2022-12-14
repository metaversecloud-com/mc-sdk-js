import { publicAPI } from "utils";

export class Asset {
  constructor(
    public addedOn: string = "",
    public apiKey: string,
    public assetName: string = "",
    public creatorTags: object = {},
    readonly id: string = "",
    public isPublic: boolean = false,
    public kitId: string = "",
    public layer0: string = "",
    public layer1: string = "",
    public library: string = "",
    public originalAssetId: string = "",
    public originalKit: string = "",
    public ownerId: string = "",
    public ownerName: string = "",
    public platformAsset: boolean = false,
    public purchased: boolean = false,
    public purchaseDate: string = "",
    public purchasedFrom: string = "",
    public specialType: string = "",
    public transactionId: string = "",
    public type: string = "",
    public urlSlug: string = "",
  ) {}

  fetchAssetsByEmail(ownerEmail: string): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/assets/my-assets?email=${ownerEmail}`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}

export default Asset;
