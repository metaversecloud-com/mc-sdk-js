import { Topia, Visitor } from "controllers";
import { VisitorOptionalInterface } from "interfaces";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, VisitorFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Visitor = new VisitorFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { Visitor } from "utils/topiaInit.ts";
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    await visitor.fetchDataObject();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { VisitorFactory, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const Visitor = new VisitorFactory(topia); // ❌ ad-hoc factory
    const visitor = await Visitor.getById(visitorId); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * Factory for creating Visitor instances. Use this factory to work with visitors in Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The Visitor controller represents a specific visitor/avatar instance in a world.
 *
 * @keywords visitor, factory, create, get, avatar, user, participant
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, VisitorFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Visitor = new VisitorFactory(topia);
 * ```
 */
export class VisitorFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of Visitor class for an existing visitor in a world.
   *
   * @remarks
   * This method creates a controller instance for a visitor but does not fetch its properties.
   * Use this when you need a lightweight instance and will fetch properties separately or when you already have the properties.
   *
   * @keywords create, instantiate, visitor, initialize, avatar, instance
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { Visitor } from "utils/topiaInit.ts";
   *
   * // Create a Visitor instance with credentials
   * const visitorInstance = Visitor.create(
   *   12345, // visitor id
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
   * // Later fetch visitor properties if needed
   * await visitorInstance.fetchVisitor();
   * ```
   *
   * @returns {Visitor} Returns a new Visitor object without fetching its properties.
   */
  create(id: number, urlSlug: string, options?: VisitorOptionalInterface): Visitor {
    return new Visitor(this.topia, id, urlSlug, options);
  }

  /**
   * Instantiate a new instance of Visitor class and automatically fetch all its properties.
   *
   * @remarks
   * This method creates a controller instance and immediately fetches all properties of the visitor.
   * It's a convenience method that combines creating an instance and calling fetchVisitor().
   *
   * @keywords get, fetch, retrieve, visitor, load, avatar, instance
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { Visitor } from "utils/topiaInit.ts";
   *
   * // Get a fully populated Visitor instance
   * const visitorInstance = await Visitor.get(
   *   12345, // visitor id
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
   * // The properties are already loaded, so you can use them immediately
   * console.log(visitorInstance.username);
   * console.log(visitorInstance.position);
   * ```
   *
   * @returns {Promise<Visitor>} Returns a new Visitor object with all properties already fetched.
   */
  async get(id: number, urlSlug: string, options?: VisitorOptionalInterface): Promise<Visitor> {
    const visitor = new Visitor(this.topia, id, urlSlug, options);
    await visitor.fetchVisitor();
    return visitor;
  }
}

export default VisitorFactory;
