import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { SceneInterface, SceneOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of Scene class with a given scene id and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new Scene(topia, "sceneId", { attributes: { name: "My Scene" } });
 * ```
 */
export class Scene extends SDKController implements SceneInterface {
  readonly id: string;

  constructor(topia: Topia, id: string, options: SceneOptionalInterface = { attributes: {}, credentials: {} }) {
    super(topia, options.credentials);
    this.id = id;
    Object.assign(this, options.attributes);
  }

  async fetchSceneById(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/scenes/${this.id}`, this.requestOptions);
      Object.assign(this, response.data);
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }
}

export default Scene;
