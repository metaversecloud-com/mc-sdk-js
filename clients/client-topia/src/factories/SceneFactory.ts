import { Scene, Topia } from "controllers";
import { SceneOptionalInterface } from "interfaces";

/**
 * @example
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
   * Instantiate a new instance of Scene class.
   *
   * @example
   * ```
   * const sceneInstance = await Scene.create(id, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   */
  create(id: string, options?: SceneOptionalInterface): Scene {
    return new Scene(this.topia, id, options);
  }

  /**
   * Instantiate a new instance of Scene class and retrieve all properties.
   *
   * @example
   * ```
   * const sceneInstance = await Scene.get(id, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   */
  async get(id: string, options?: SceneOptionalInterface): Promise<Scene> {
    const scene = await new Scene(this.topia, id, options);
    await scene.fetchSceneById();
    return scene;
  }
}

export default SceneFactory;
