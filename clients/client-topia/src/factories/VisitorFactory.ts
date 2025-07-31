import { Topia, Visitor } from "controllers";
import { VisitorOptionalInterface } from "interfaces";

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
   */
  async get(id: number, urlSlug: string, options?: VisitorOptionalInterface): Promise<Visitor> {
    const visitor = new Visitor(this.topia, id, urlSlug, options);
    await visitor.fetchVisitor();
    return visitor;
  }
}

export default VisitorFactory;
