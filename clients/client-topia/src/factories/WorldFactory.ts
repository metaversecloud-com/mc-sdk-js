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
 * Factory for creating World instances. Use this factory to interact with Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The World controller provides methods to manage world settings, retrieve world details, and perform world-level operations.
 *
 * @keywords world, factory, create, virtual space, environment, room, topia
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, WorldFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const World = new WorldFactory(topia);
 * ```
 */
export class WorldFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  /**
   * Instantiate a new instance of World class for interacting with a specific Topia world.
   *
   * @remarks
   * This method creates a controller instance for a world identified by its URL slug.
   * The world controller can be used to fetch details, update world settings, and perform other world-level operations.
   *
   * @keywords create, instantiate, world, initialize, virtual space, environment, room
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { World } from "utils/topiaInit.ts";
   *
   * // Create a World instance with credentials
   * const worldInstance = World.create(
   *   "my-world-slug",
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
   * // Fetch world details
   * await worldInstance.fetchDetails();
   * console.log(worldInstance.name);
   * ```
   *
   * @returns {World} Returns a new World object for interacting with the specified world.
   */
  create(urlSlug: string, options?: WorldOptionalInterface): World {
    return new World(this.topia, urlSlug, options);
  }

  /**
   * Deletes multiple dropped assets from a world in a single operation.
   *
   * @remarks
   * This method provides a convenient way to delete multiple dropped assets at once rather than
   * deleting them one by one. Requires appropriate permissions via interactive credentials.
   *
   * @keywords delete, remove, dropped assets, multiple, batch, cleanup, world
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { World } from "utils/topiaInit.ts";
   *
   * // Delete multiple dropped assets from a world
   * const result = await World.deleteDroppedAssets(
   *   "my-world-slug",
   *   ["asset-id-123", "asset-id-456", "asset-id-789"],
   *   "your-interactive-secret",
   *   {
   *     apiKey: "your-api-key",
   *     interactivePublicKey: "your-public-key",
   *     visitorId: 12345
   *   }
   * );
   *
   * if (result.success) {
   *   console.log("Assets successfully deleted");
   * }
   * ```
   *
   * @returns {Promise<{ success: boolean }>} Returns `{ success: true }` if all assets were deleted successfully.
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
      await Promise.allSettled(promiseArray);

      return { success: true };
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "WorldFactory.deleteDroppedAssets" });
    }
  }
}

export default WorldFactory;
