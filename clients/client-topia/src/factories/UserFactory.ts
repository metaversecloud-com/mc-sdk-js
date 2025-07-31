import { Topia, User } from "controllers";
import { UserOptionalInterface } from "interfaces";

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
