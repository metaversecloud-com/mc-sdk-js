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
   * await World.deleteDroppedAssets(urlSlug, ["exampleDroppedAssetId1", "exampleDroppedAssetId2"], { interactivePublicKey, interactiveSecret });
   * ```
   */
  async deleteDroppedAssets(
    urlSlug: string,
    droppedAssetIds: string[],
    credentials: {
      apiKey?: string;
      interactivePublicKey?: string;
      interactiveSecret?: string;
    },
  ) {
    const { apiKey, interactivePublicKey, interactiveSecret } = credentials;
    const params = { apiKey, droppedAssetIds, interactivePublicKey, interactiveSecret, urlSlug };

    try {
      const headers: any = {};
      if (apiKey) {
        headers.Authorization = apiKey;
      } else if (interactivePublicKey && interactiveSecret) {
        headers.interactiveJWT = jwt.sign(interactivePublicKey, interactiveSecret);
        headers.publickey = interactivePublicKey;
      }

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
