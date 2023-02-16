import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { WorldInterface, WorldOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

// utils
import { removeUndefined } from "utils";

/**
 * @summary
 * Create an instance of World class with a given url slug and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new World(topia, "exampleWorld", { attributes: { name: "Example World" } });
 * ```
 */
export class World extends SDKController implements WorldInterface {
  urlSlug: string;

  constructor(topia: Topia, urlSlug: string, options: WorldOptionalInterface = { attributes: {}, credentials: {} }) {
    super(topia, options.credentials);
    Object.assign(this, options.attributes);
    this.urlSlug = urlSlug;
  }

  //////// world details
  /**
   * @summary
   * Retrieves details of a world.
   *
   * @usage
   * ```ts
   * await world.fetchDetails();
   * const { name } = world;
   * ```
   */
  async fetchDetails(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/world-details`,
        this.requestOptions,
      );
      Object.assign(this, response.data);
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Update details of a world.
   *
   * @usage
   * ```ts
   * await world.updateDetails({
   *   controls: {
   *     allowMuteAll: true,
   *     disableHideVideo: true,
   *     isMobileDisabled: false,
   *     isShowingCurrentGuests: false,
   *   },
   *   description: 'Welcome to my world.',
   *   forceAuthOnLogin: false,
   *   height: 2000,
   *   name: 'Example',
   *   spawnPosition: { x: 100, y: 100 },
   *   width: 2000
   * });
   * ```
   */
  async updateDetails({
    controls,
    description,
    forceAuthOnLogin,
    height,
    name,
    spawnPosition,
    width,
  }: WorldInterface): Promise<void | ResponseType> {
    const payload = {
      controls,
      description,
      forceAuthOnLogin,
      height,
      name,
      spawnPosition,
      width,
    };
    try {
      await this.topiaPublicApi().put(`/world/${this.urlSlug}/world-details`, payload, this.requestOptions);
      const cleanPayload = removeUndefined(payload);
      Object.assign(this, cleanPayload);
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }
}

export default World;
