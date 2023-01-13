import { Asset, Topia } from "controllers";
import { AssetOptionalInterface } from "interfaces";

export class AssetFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
    this.create;
  }

  create(id: string, options?: { args: AssetOptionalInterface }): Asset {
    return new Asset(this.topia, id, options);
  }
}

export default AssetFactory;
