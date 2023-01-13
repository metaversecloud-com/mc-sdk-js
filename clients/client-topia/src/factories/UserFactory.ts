import { Topia, User } from "controllers";
import { UserOptions } from "types";

export class UserFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create({ email, options }: { email: string; options: UserOptions }): User {
    return new User(this.topia, {
      email,
      options,
    });
  }
}

export default UserFactory;
