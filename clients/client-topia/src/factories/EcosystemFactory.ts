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
 * @example
 * ```ts
 * const Ecosystem = new EcosystemFactory(myTopiaInstance);
 * ```
 */
export class EcosystemFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of Ecosystem class.
   *
   * @example
   * ```
   * const ecosystemInstance = await Ecosystem.create({ credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId }});
   * ```
   *
   * @returns {Ecosystem} Returns a new Ecosystem object.
   */
  create(options?: EcosystemOptionalInterface): Ecosystem {
    return new Ecosystem(this.topia, options);
  }
}

export default EcosystemFactory;
