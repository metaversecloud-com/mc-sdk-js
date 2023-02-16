import { Topia, Visitor } from "controllers";
import { VisitorOptionalInterface } from "interfaces";

export class VisitorFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  create(id: number, urlSlug: string, options?: VisitorOptionalInterface): Visitor {
    return new Visitor(this.topia, id, urlSlug, options);
  }

  async get(id: number, urlSlug: string, options?: VisitorOptionalInterface): Promise<Visitor> {
    const visitor = new Visitor(this.topia, id, urlSlug, options);
    await visitor.fetchVisitor();
    return visitor;
  }
}

export default VisitorFactory;
