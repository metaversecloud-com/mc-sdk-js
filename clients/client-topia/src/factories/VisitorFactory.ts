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
 * @example
 * ```ts
 * const Visitor = new VisitorFactory(myTopiaInstance);
 * ```
 */
export class VisitorFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of Visitor class.
   *
   * @example
   * ```
   * const visitorInstance = await Visitor.create(id, urlSlug, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   *
   * @returns {Visitor} Returns a new Visitor object.
   */
  create(id: number, urlSlug: string, options?: VisitorOptionalInterface): Visitor {
    return new Visitor(this.topia, id, urlSlug, options);
  }

  /**
   * Instantiate a new instance of Visitor class and retrieve all properties.
   *
   * @example
   * ```
   * const visitorInstance = await Visitor.get(id, urlSlug, { credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   *
   * @returns {Promise<Visitor>} Returns a new Visitor object with all properties.
   */
  async get(id: number, urlSlug: string, options?: VisitorOptionalInterface): Promise<Visitor> {
    const visitor = new Visitor(this.topia, id, urlSlug, options);
    await visitor.fetchVisitor();
    return visitor;
  }
}

export default VisitorFactory;
