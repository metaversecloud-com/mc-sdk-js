import { Topia, User } from "controllers";
import { UserOptionalInterface } from "interfaces";

/* ============================================================================
  AI RULES for code assistants

  - Consumers MUST create a single Topia client in their app (e.g. utils/topiaInit.ts).
  - Consumers MUST instantiate this factory ONCE using that client and RE-USE it.
  - Controllers/services MUST import the app’s exported factory instance.
  - Use ONLY methods defined in this file’s types and TSDoc.
  - Methods that DO NOT exist and MUST NOT be suggested.

  RIGHT ✅ Correct usage pattern (consumer app):
    // utils/topiaInit.ts
    import { Topia, UserFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const User = new UserFactory(topia);

  RIGHT ✅ Correct usage pattern (controller):
    // controllers/myController.ts
    import { User } from "utils/topiaInit.ts";
    const user = await User.create({ credentials });
    await user.fetchDataObject();

  WRONG ❌ Incorrect usage pattern (controller):
    // controllers/myController.ts
    import { UserFactory, Topia } from "@rtsdk/topia";
    const topia = new Topia(config); // ❌ new client per request
    const User = new UserFactory(topia); // ❌ ad-hoc factory
    const user = await User.getById(userId); // ❌ method does not exist

  Do NOT instantiate factories in controllers. Do NOT invent methods.
============================================================================ */

/**
 * @example
 * ```ts
 * const User = new UserFactory(myTopiaInstance);
 * ```
 */
export class UserFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of User class.
   *
   * @example
   * ```
   * const userInstance = await User.create({ credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   *
   * @returns {User} Returns a new User object.
   */
  create(options?: UserOptionalInterface): User {
    return new User(this.topia, options);
  }
}

export default UserFactory;
