import { Topia, World } from "controllers";
import { WorldOptions } from "types";

export class WorldFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(urlSlug: string, { options }: { options: WorldOptions }): World {
    return new World(this.topia, urlSlug, { options });
  }

  async get(urlSlug: string, { options }: { options: WorldOptions }): Promise<World> {
    const world = new World(this.topia, urlSlug, { options });

    await world.fetchDetails();

    return world;
  }
}

export default WorldFactory;
