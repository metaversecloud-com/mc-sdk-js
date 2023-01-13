import { Asset, Topia } from "controllers";
import { AssetOptions } from "types";

export class AssetFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
    this.create;
  }

  create(id: string, { options }: { options: AssetOptions }): Asset {
    return new Asset(this.topia, id, {
      options,
    });
  }
}

export default AssetFactory;
