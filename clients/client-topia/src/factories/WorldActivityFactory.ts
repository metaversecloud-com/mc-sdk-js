import { Topia, WorldActivity } from "controllers";
import { WorldOptionalInterface } from "interfaces";

export class WorldActivityFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(urlSlug: string, options?: WorldOptionalInterface): WorldActivity {
    return new WorldActivity(this.topia, urlSlug, options);
  }
}

export default WorldActivityFactory;
