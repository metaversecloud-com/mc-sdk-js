import { Topia, Ecosystem } from "controllers";
import { EcosystemOptionalInterface } from "interfaces";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, Ecosystem } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Ecosystem = new EcosystemFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { Ecosystem } from "utils/topiaInit.ts";
    const ecosystem = await Ecosystem.create({ credentials });
    await ecosystem.fetchDataObject();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { Ecosystem, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const Ecosystem = new EcosystemFactory(topia); // ❌ ad-hoc factory
    const ecosystem = await Ecosystem.getById(id); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * Factory for creating Ecosystem instances. Use this factory to work with ecosystem-wide data and operations.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The Ecosystem controller provides methods to interact with data shared across multiple worlds.
 *
 * @keywords ecosystem, factory, create, multi-world, global, shared data, platform
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, EcosystemFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Ecosystem = new EcosystemFactory(topia);
 * ```
 */
export class EcosystemFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of Ecosystem class for interacting with ecosystem-wide data.
   *
   * @remarks
   * This method creates a controller instance for accessing and managing data that spans multiple worlds.
   * Use this for cross-world data sharing, global data objects, and ecosystem-wide operations.
   *
   * @keywords create, instantiate, ecosystem, initialize, global, shared data, platform
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { Ecosystem } from "utils/topiaInit.ts";
   *
   * // Create an Ecosystem instance with credentials
   * const ecosystemInstance = Ecosystem.create({
   *   credentials: {
   *     interactiveNonce,
   *     interactivePublicKey,
   *     assetId,
   *     urlSlug,
   *     visitorId
   *   }
   * });
   *
   * // Work with ecosystem-wide data objects
   * await ecosystemInstance.fetchDataObject("global-leaderboard");
   * await ecosystemInstance.setDataObject("global-leaderboard", { scores: [...] });
   * ```
   *
   * @returns {Ecosystem} Returns a new Ecosystem object for interacting with ecosystem-wide data.
   */
  create(options?: EcosystemOptionalInterface): Ecosystem {
    return new Ecosystem(this.topia, options);
  }
}

export default EcosystemFactory;
