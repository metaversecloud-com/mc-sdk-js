import { SDKController, Topia, World } from "controllers";
import { WorldOptionalInterface } from "interfaces";
import jwt from "jsonwebtoken";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, WorldFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const World = new WorldFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { World } from "utils/topiaInit.ts";
    const world = await World.create(urlSlug, { credentials });
    await world.fetchDetails();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { World, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const World = new WorldFactory(topia); // ❌ ad-hoc factory
    const world = await World.update({}); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * @example
 * ```ts
 * const World = new WorldFactory(myTopiaInstance);
 * ```
 */
export class WorldFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * Instantiate a new instance of World class.
   *
   * @example
   * ```
   * const worldInstance = await World.create(urlSlug, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   *
   * @returns {World} Returns a new World object.
   */
  create(urlSlug: string, options?: WorldOptionalInterface): World {
    return new World(this.topia, urlSlug, options);
  }

  /**
   * Deletes an array of Dropped Assets from within a world and returns success: true
   *
   * @example
   * ```
   * await World.deleteDroppedAssets(urlSlug, ["exampleDroppedAssetId1", "exampleDroppedAssetId2"], interactiveSecret, credentials);
   * ```
   *
   * @returns {Promise<{ success: boolean }>} Returns `{ success: true }` or an error.
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
