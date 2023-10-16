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
    super(topia, { credentials: { ...options.credentials, urlSlug } });
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
      if (this.profile?.profileId) this.profileId = this.profile.profileId;
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
      throw this.errorHandler({ error, params: { shouldTeleportVisitor, x, y } });
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
    const params = {
      groupId,
      title,
      text,
    };
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/fire-toast`,
        params,
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params });
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
    const params = {
      link,
      shouldOpenInDrawer,
      title,
    };
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/open-iframe`,
        params,
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params });
    }
  }

  /**
   * @summary
   * Mute and turn video off for a visitor currently in a world.
   *
   * @usage
   * ```ts
   * await visitor.turnAVOff();
   * ```
   */
  async turnAVOff(): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/turn-av-off`,
        {},
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Grant expression to a visitor by id or name.
   *
   * @usage
   * ```ts
   * await visitor.grantExpression({ name: "Eyes" });
   * ```
   */
  async grantExpression({ id, name }: { id?: string; name?: string }): Promise<object | ResponseType> {
    if (!id && !name) throw "An expression id or name is required.";
    try {
      let expressionId = id;
      if (name) {
        expressionId = await this.topiaPublicApi().get(`/expressions?name=${name}`, this.requestOptions);
      }
      const result = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/grant-expression/${expressionId}`,
        {},
        this.requestOptions,
      );
      return result;
    } catch (error) {
      throw this.errorHandler({ error, params: { id, name } });
    }
  }

  /**
   * @summary
   * Retrieves the data object for a visitor.
   *
   * @usage
   * ```ts
   * const dataObject = await visitor.fetchDataObject();
   * ```
   */
  async fetchDataObject(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.id}/get-data-object`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error });
    }
  }

  /**
   * @summary
   * Sets the data object for a visitor.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await visitor.setDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * ```
   */
  async setDataObject(
    dataObject: object | null | undefined,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/set-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options } });
    }
  }

  /**
   * @summary
   * Updates the data object for a visitor.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await visitor.updateDataObject({
   *   "exampleKey": "exampleValue",
   * });
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/update-data-object`,
        { dataObject: dataObject || this.dataObject, lock },
        this.requestOptions,
      );
      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options } });
    }
  }

  /**
   * @summary
   * Increments a specific value in the data object for a visitor by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await visitor.incrementDataObjectValue(
   *   "path": "key",
   *   "amount": 1,
   * );
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: { lock?: { lockId: string; releaseLock?: boolean } } = {},
  ): Promise<void | ResponseType> {
    try {
      const { lock = {} } = options;
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/increment-data-object-value`,
        { path, amount, lock },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { path, amount, options } });
    }
  }
}

export default Visitor;
