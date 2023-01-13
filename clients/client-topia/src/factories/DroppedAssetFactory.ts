import { DroppedAsset, Topia } from "controllers";
import { DroppedAssetOptions } from "types";

export class DroppedAssetFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(
    id: string,
    {
      options,
      urlSlug,
    }: {
      options: DroppedAssetOptions;
      urlSlug: string;
    },
  ): DroppedAsset {
    return new DroppedAsset(this.topia, id, {
      options,
      urlSlug,
    });
  }

  async get(
    id: string,
    {
      options,
      urlSlug,
    }: {
      options: DroppedAssetOptions;
      urlSlug: string;
    },
  ): Promise<DroppedAsset> {
    const droppedAsset = new DroppedAsset(this.topia, id, {
      options,
      urlSlug,
    });

    await droppedAsset.fetchDroppedAssetById();

    return droppedAsset;
  }
}

export default DroppedAssetFactory;
