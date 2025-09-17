import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { SceneInterface, SceneOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., Scene).
    - Consumers obtain controller instances via factory methods (e.g., SceneFactory.get).

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - Do NOT mutate controller shape or return ad-hoc fields.

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, SceneFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Scene = new SceneFactory(topia);

    // controllers/myController.ts (consumer app)
    import { Scene } from "utils/topiaInit.ts";
    const scene = await Scene.get(sceneId, { credentials });

============================================================================ */

/**
 * Create an instance of Scene class with a given scene id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { Scene } from "utils/topiaInit.ts";
 *
 * const scene = await Scene.get(exampleSceneId, {
 *   attributes: { name: "My Scene" },
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
export class Scene extends SDKController implements SceneInterface {
  readonly id: string;

  constructor(topia: Topia, id: string, options: SceneOptionalInterface = { attributes: {}, credentials: {} }) {
    super(topia, { ...options.credentials });
    this.id = id;
    Object.assign(this, options.attributes);
  }

  /**
   * Retrieves scene details and assigns response data to the instance.
   *
   * @keywords get, fetch, retrieve, load, details, info, information, scene
   *
   * @example
   * ```ts
   * await scene.fetchSceneById();
   * const { name } = scene;
   * ```
   */
  async fetchSceneById(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/scenes/${this.id}`, this.requestOptions);
      Object.assign(this, response.data);
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Scene.fetchSceneById" });
    }
  }
}

export default Scene;
