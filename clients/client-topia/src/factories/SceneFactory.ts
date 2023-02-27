import { Scene, Topia } from "controllers";
import { SceneOptionalInterface } from "interfaces";

export class SceneFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
    this.create;
  }

  create(id: string, options?: SceneOptionalInterface): Scene {
    return new Scene(this.topia, id, options);
  }

  async get(id: string, options?: SceneOptionalInterface): Promise<Scene> {
    const scene = await new Scene(this.topia, id, options);
    await scene.fetchSceneById();
    return scene;
  }
}

export default SceneFactory;
