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
 * @example
 * ```ts
 * const WorldActivity = new WorldActivityFactory(myTopiaInstance);
 * ```
 */
export class WorldActivityFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of WorldActivity class.
   *
   * @example
   * ```
   * const worldActivityInstance = await WorldActivity.create(urlSlug, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   *
   * @returns {WorldActivity} Returns a new WorldActivity object.
   */
  create(urlSlug: string, options?: WorldOptionalInterface): WorldActivity {
    return new WorldActivity(this.topia, urlSlug, options);
  }
}

export default WorldActivityFactory;
