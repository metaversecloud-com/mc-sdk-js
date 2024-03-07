import { Scene, Topia } from "controllers";
import { SceneOptionalInterface } from "interfaces";

/**
 * @usage
 * ```ts
 * const Scene = new SceneFactory(myTopiaInstance);
 * ```
 */
export class SceneFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
    this.create;
  }

  /**
   * @summary
   * Instantiate a new instance of Scene class.
   *
   * @usage
   * ```
   * const sceneInstance = await Scene.create(id, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  create(id: string, options?: SceneOptionalInterface): Scene {
    return new Scene(this.topia, id, options);
  }

  /**
   * @summary
   * Instantiate a new instance of Scene class and retrieve all properties.
   *
   * @usage
   * ```
   * const sceneInstance = await Scene.get(id, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  async get(id: string, options?: SceneOptionalInterface): Promise<Scene> {
    const scene = await new Scene(this.topia, id, options);
    await scene.fetchSceneById();
    return scene;
  }
}

export default SceneFactory;
