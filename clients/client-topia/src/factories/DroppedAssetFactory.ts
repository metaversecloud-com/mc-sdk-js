import { DroppedAsset, Topia, Asset, SDKController } from "controllers";
import { DroppedAssetOptionalInterface } from "interfaces";
import { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";

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

  async getWithUniqueName(
    uniqueName: string,
    urlSlug: string,
    interactivePublicKey: string,
    interactiveSecret: string,
  ): Promise<DroppedAsset> {
    const params = { uniqueName, urlSlug, interactivePublicKey, interactiveSecret };
    const interactiveJWT = jwt.sign(interactivePublicKey, interactiveSecret);
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${urlSlug}/asset-by-unique-name/${uniqueName}`,
        { headers: { interactiveJWT, publickey: interactivePublicKey } },
      );
      const { id } = response.data;
      return new DroppedAsset(this.topia, id, urlSlug, { attributes: response.data });
    } catch (error) {
      throw this.errorHandler({ error, params });
    }
  }

  async drop(
    asset: Asset,
    {
      interactivePublicKey,
      position: { x, y },
      sceneDropId,
      uniqueName,
      urlSlug,
      yOrderAdjust,
    }: {
      interactivePublicKey?: string;
      position: {
        x: number;
        y: number;
      };
      sceneDropId?: string;
      uniqueName?: string;
      urlSlug: string;
      yOrderAdjust?: number;
    },
  ): Promise<DroppedAsset> {
    const params = { interactivePublicKey, sceneDropId, uniqueName, urlSlug, yOrderAdjust };
    try {
      const response: AxiosResponse = await this.topiaPublicApi().post(
        `/world/${urlSlug}/assets`,
        {
          assetId: asset.id,
          interactivePublicKey,
          position: { x, y },
          sceneDropId,
          uniqueName,
          yOrderAdjust,
        },
        asset.requestOptions,
      );
      const { id } = response.data;
      return new DroppedAsset(this.topia, id, urlSlug, { credentials: asset.credentials });
    } catch (error) {
      throw this.errorHandler({ error, params });
    }
  }
}

export default DroppedAssetFactory;
