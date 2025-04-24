import { Topia, User } from "controllers";
import { UserOptionalInterface } from "interfaces";

/**
 * @usage
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
   * @summary
   * Instantiate a new instance of User class.
   *
   * @usage
   * ```
   * const userInstance = await User.create({ credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId } });
   * ```
   */
  create(options?: UserOptionalInterface): User {
    return new User(this.topia, options);
  }
}

export default UserFactory;
