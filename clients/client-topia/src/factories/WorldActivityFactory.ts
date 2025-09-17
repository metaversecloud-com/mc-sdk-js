import { Topia, WorldActivity } from "controllers";
import { WorldOptionalInterface } from "interfaces";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, WorldActivityFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const WorldActivity = new WorldActivityFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { WorldActivity } from "utils/topiaInit.ts";
    const activity = await WorldActivity.create(urlSlug, { credentials });
    await activity.currentVisitors();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { WorldActivity, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const WorldActivity = new WorldActivityFactory(topia); // ❌ ad-hoc factory
    const activity = await WorldActivity.getAllVisitors(); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * Factory for creating WorldActivity instances. Use this factory to monitor and manage visitor activity in Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The WorldActivity controller provides methods to interact with real-time visitor activities and movements.
 *
 * @keywords world activity, factory, create, visitors, movement, tracking, presence, real-time
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, WorldActivityFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const WorldActivity = new WorldActivityFactory(topia);
 * ```
 */
export class WorldActivityFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of WorldActivity class for monitoring visitor activity in a specific world.
   *
   * @remarks
   * This method creates a controller instance for tracking and managing visitor activity in a world.
   * Use this to fetch current visitors, move visitors, or monitor specific zones within a world.
   *
   * @keywords create, instantiate, world activity, initialize, visitors, tracking, presence
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { WorldActivity } from "utils/topiaInit.ts";
   *
   * // Create a WorldActivity instance with credentials
   * const worldActivityInstance = WorldActivity.create(
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
   * // Get current visitors in the world
   * const visitors = await worldActivityInstance.currentVisitors();
   * console.log(`There are ${visitors.length} visitors in the world`);
   *
   * // Check visitors in a specific zone
   * const zoneVisitors = await worldActivityInstance.fetchVisitorsInZone("stage-area");
   * ```
   *
   * @returns {WorldActivity} Returns a new WorldActivity object for tracking and managing visitor activity.
   */
  create(urlSlug: string, options?: WorldOptionalInterface): WorldActivity {
    return new WorldActivity(this.topia, urlSlug, options);
  }
}

export default WorldActivityFactory;
