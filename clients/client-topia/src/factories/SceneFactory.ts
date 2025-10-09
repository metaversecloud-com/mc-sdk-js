import { Scene, Topia } from "controllers";
import { SceneOptionalInterface } from "interfaces";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, SceneFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Scene = new SceneFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { Scene } from "utils/topiaInit.ts";
    const scene = await Scene.get(sceneId, { credentials });

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { SceneFactory, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const Scene = new SceneFactory(topia); // ❌ ad-hoc factory
    const scene = await Scene.getById(sceneId);  // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * Factory for creating Scene instances. Use this factory to work with scenes in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * Scenes represent the template or blueprint for a world's design and layout.
 *
 * @keywords scene, factory, create, template, blueprint, layout, design
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, SceneFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Scene = new SceneFactory(topia);
 * ```
 */
export class SceneFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
    this.create;
  }

  /**
   * Instantiate a new instance of Scene class for an existing scene in the platform.
   *
   * @remarks
   * This method creates a controller instance for working with a scene but does not fetch its properties.
   * Use this when you need to interact with a specific scene by its id.
   *
   * @keywords create, instantiate, scene, initialize, instance, template
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { Scene } from "utils/topiaInit.ts";
   *
   * // Create a Scene instance with credentials
   * const sceneInstance = Scene.create(
   *   "scene-id-123",
   *   {
   *     credentials: {
   *       interactiveNonce,
   *       interactivePublicKey,
   *       assetId,
   *       urlSlug,
   *       visitorId
   *     }
   *   }
   * );
   *
   * // Fetch scene details if needed
   * await sceneInstance.fetchSceneById();
   * ```
   *
   * @returns {Scene} Returns a new Scene object for interacting with the specified scene.
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
   *
   * @returns {Promise<Scene>} Returns a new Scene object with all properties.
   */
  async get(id: string, options?: SceneOptionalInterface): Promise<Scene> {
    const scene = await new Scene(this.topia, id, options);
    await scene.fetchSceneById();
    return scene;
  }
}

export default SceneFactory;
