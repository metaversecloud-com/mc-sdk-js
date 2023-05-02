import { AxiosResponse } from "axios";

// controllers
import { Topia } from "controllers/Topia";
import { User } from "controllers/User";

// interfaces
import {
  FireToastInterface,
  MoveVisitorInterface,
  OpenIframeInterface,
  VisitorInterface,
  VisitorOptionalInterface,
} from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of Visitor class with a given id and optional attributes and session credentials.
 *
 * @usage
 * ```ts
 * await new Visitor(topia, id, urlSlug, { attributes: { moveTo: { x: 0, y: 0 } } });
 * ```
 */
export class Visitor extends User implements VisitorInterface {
  readonly id: number;
  urlSlug: string;
  user?: User;

  constructor(
    topia: Topia,
    id: number,
    urlSlug: string,
    options: VisitorOptionalInterface = { attributes: {}, credentials: {} },
  ) {
    super(topia, { credentials: options.credentials });
    Object.assign(this, options.attributes);
    this.id = id;
    this.urlSlug = urlSlug;
  }

  /**
   * @summary
   * Get a single visitor from a world
   *
   * @usage
   * ```ts
   * await visitor.fetchVisitor();
   * ```
   *
   * @result
   * Returns details for a visitor in a world by id and urlSlug
   */
  async fetchVisitor(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.id}`,
        this.requestOptions,
      );
      if (response.data?.visitorId === this.id) {
        Object.assign(this, response.data);
      } else if (response.data[this.id]) {
        Object.assign(this, response.data[this.id]);
      } else {
        throw "This visitor is not active";
      }
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Teleport or walk a visitor currently in a world to a single set of coordinates.
   *
   * @usage
   * ```ts
   * await visitor.moveVisitor({
   *   shouldTeleportVisitor: true,
   *   x: 100,
   *   y: 100,
   * });
   * ```
   *
   * @result
   * Updates each Visitor instance and world.visitors map.
   */
  async moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/move`,
        {
          moveTo: {
            x,
            y,
          },
          teleport: shouldTeleportVisitor,
        },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Display a message via a toast to a visitor currently in a world.
   *
   * @usage
   * ```ts
   * await visitor.fireToast({
   *   groupId: "custom-message",
   *   title: "Hello World",
   *   text: "Thank you for participating!",
   * });
   * ```
   */
  async fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/fire-toast`,
        {
          groupId,
          title,
          text,
        },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Open an iframe in a drawer or modal for a visitor currently in a world.
   *
   * @usage
   * ```ts
   * await visitor.openIframe({
   *   link: "https://topia.io",
   *   shouldOpenInDrawer: true,
   *   title: "Hello World",
   * });
   * ```
   */
  async openIframe({ link, shouldOpenInDrawer, title }: OpenIframeInterface): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/open-iframe`,
        {
          link,
          shouldOpenInDrawer,
          title,
        },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }
}

export default Visitor;
