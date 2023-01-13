import { Topia, World } from "controllers";
import { WorldOptionalInterface } from "interfaces";

export class WorldFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(urlSlug: string, options?: WorldOptionalInterface): World {
    return new World(this.topia, urlSlug, options);
  }
}

export default WorldFactory;
