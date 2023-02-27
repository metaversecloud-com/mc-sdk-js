import { DroppedAsset, Topia, Asset, SDKController } from "controllers";
import { DroppedAssetOptionalInterface } from "interfaces";
import { AxiosResponse } from "axios";

export class DroppedAssetFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  create(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): DroppedAsset {
    return new DroppedAsset(this.topia, id, urlSlug, options);
  }

  async get(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): Promise<DroppedAsset> {
    const droppedAsset = new DroppedAsset(this.topia, id, urlSlug, options);
    await droppedAsset.fetchDroppedAssetById();
    return droppedAsset;
  }

  async drop(
    asset: Asset,
    {
      position: { x, y },
      uniqueName,
      urlSlug,
    }: {
      position: {
        x: number;
        y: number;
      };
      uniqueName?: string;
      urlSlug: string;
    },
  ): Promise<DroppedAsset> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/world/${urlSlug}/assets`,
        {
          assetId: asset.id,
          position: { x, y },
          uniqueName,
        },
        asset.requestOptions,
      );
      const { id } = response.data;
      return new DroppedAsset(this.topia, id, urlSlug, { credentials: asset.credentials });
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }
}

export default DroppedAssetFactory;
