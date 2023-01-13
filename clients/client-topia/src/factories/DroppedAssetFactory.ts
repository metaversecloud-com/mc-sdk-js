import { DroppedAsset, Topia } from "controllers";
import { DroppedAssetOptionalInterface } from "interfaces";

export class DroppedAssetFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): DroppedAsset {
    return new DroppedAsset(this.topia, id, urlSlug, options);
  }

  async get(id: string, urlSlug: string, options?: DroppedAssetOptionalInterface): Promise<DroppedAsset> {
    const droppedAsset = new DroppedAsset(this.topia, id, urlSlug, options);

    await droppedAsset.fetchDroppedAssetById();

    return droppedAsset;
  }
}

export default DroppedAssetFactory;
