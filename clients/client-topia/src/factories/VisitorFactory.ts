import { Topia, Visitor } from "controllers";
import { VisitorOptions } from "types";

export class VisitorFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(id: number, { options, urlSlug }: { options: VisitorOptions; urlSlug: string }): Visitor {
    return new Visitor(this.topia, id, urlSlug, { options });
  }
}

export default VisitorFactory;
