import { Topia, User } from "controllers";
import { UserOptionalInterface } from "interfaces";

export class UserFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(options?: UserOptionalInterface): User {
    return new User(this.topia, options);
  }

  async get(options?: UserOptionalInterface): Promise<User> {
    const user = new User(this.topia, options);
    await user.fetchUserByVisitorId();
    return user;
  }
}

export default UserFactory;
