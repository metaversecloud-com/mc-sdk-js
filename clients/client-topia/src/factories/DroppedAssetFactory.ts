import { DroppedAsset } from "controllers";
import { DroppedAssetInterface, TopiaInterface } from "interfaces";
import { DroppedAssetOptions } from "types";

/**
 * Create an instance of Asset class with a given apiKey and optional arguments.
 *
 * ```ts
 * await new Asset({ apiKey: API_KEY, args: { assetName: "My Asset", isPublic: false } });
 * ```
 */
export class DroppedAssetFactory {
  topia: TopiaInterface;

  constructor(topia: TopiaInterface) {
    this.topia = topia;
  }

  create(id: string, urlSlug: string, options?: DroppedAssetOptions): DroppedAssetInterface {
    return new DroppedAsset(this.topia, id, urlSlug, options);
  }

  async get(id: string, urlSlug: string, options?: DroppedAssetOptions): Promise<DroppedAssetInterface> {
    const droppedAsset = new DroppedAsset(this.topia, id, urlSlug, options);

    await droppedAsset.fetchDroppedAssetById();

    return droppedAsset;
  }
}

export default DroppedAssetFactory;
