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
 * Factory for creating User instances. Use this factory to work with user data in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The User controller allows you to interact with user-specific information and operations.
 *
 * @keywords user, factory, create, account, profile, member, visitor
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, UserFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const User = new UserFactory(topia);
 * ```
 */
export class UserFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of User class for working with user data.
   *
   * @remarks
   * This method creates a controller instance for interacting with user-specific operations.
   * The User controller doesn't require an id since it represents the currently authenticated user.
   *
   * @keywords create, instantiate, user, initialize, account, profile, member
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { User } from "utils/topiaInit.ts";
   *
   * // Create a User instance with credentials
   * const userInstance = User.create({
   *   credentials: {
   *     interactiveNonce,
   *     interactivePublicKey,
   *     assetId,
   *     urlSlug,
   *     visitorId
   *   }
   * });
   *
   * // Use methods on the user instance
   * await userInstance.checkInteractiveCredentials();
   * const avatars = await userInstance.fetchAvatars();
   * ```
   *
   * @returns {User} Returns a new User object for interacting with user data.
   */
  create(options?: UserOptionalInterface): User {
    return new User(this.topia, options);
  }
}

export default UserFactory;
