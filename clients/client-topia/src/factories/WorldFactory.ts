import { SDKController, Topia, World } from "controllers";
import { WorldOptionalInterface } from "interfaces";
import jwt from "jsonwebtoken";

/**
 * @usage
 * ```ts
 * const World = new WorldFactory(myTopiaInstance);
 * ```
 */
export class WorldFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * @summary
   * Instantiate a new instance of World class.
   *
   * @usage
   * ```
   * const worldInstance = await World.create(urlSlug, { credentials: { interactiveNonce, interactivePublicKey, visitorId } });
   * ```
   */
  create(urlSlug: string, options?: WorldOptionalInterface): World {
    return new World(this.topia, urlSlug, options);
  }

  /**
   * @summary
   * Deletes an array of Dropped Assets from within a world and returns success: true
   *
   * @usage
   * ```
   * await World.deleteDroppedAssets(urlSlug, ["exampleDroppedAssetId1", "exampleDroppedAssetId2"], interactiveSecret, credentials);
   * ```
   */
  async deleteDroppedAssets(
    urlSlug: string,
    droppedAssetIds: string[],
    interactiveSecret: string,
    credentials: {
      apiKey?: string;
      interactiveNonce?: string;
      interactivePublicKey: string;
      visitorId?: number;
    },
  ) {
    const params = { credentials, droppedAssetIds, urlSlug };

    try {
      const { apiKey, interactivePublicKey } = credentials;
      const headers: { Authorization?: string; interactiveJWT?: string; publickey?: string } = {};
      headers.publickey = interactivePublicKey;

      if (interactiveSecret) headers.interactiveJWT = jwt.sign(credentials, interactiveSecret);
      else if (apiKey) headers.Authorization = apiKey;
      else throw "An apiKey or interactive credentials are required.";

      const promiseArray = [];
      for (const id of droppedAssetIds) {
        promiseArray.push(
          this.topiaPublicApi().delete(`/world/${urlSlug}/assets/${id}`, {
            headers,
          }),
        );
      }
      await Promise.all(promiseArray);

      return { success: true };
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "WorldFactory.deleteDroppedAssets" });
    }
  }
}

export default WorldFactory;
