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
import { AnalyticType } from "types/AnalyticTypes";

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
    super(topia, { credentials: { urlSlug, ...options.credentials } });
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
      throw this.errorHandler({ error, sdkMethod: "Visitor.fetchVisitor" });
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
      throw this.errorHandler({ error, params: { shouldTeleportVisitor, x, y }, sdkMethod: "Visitor.moveVisitor" });
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
      throw this.errorHandler({ error, params, sdkMethod: "Visitor.fireToast" });
    }
  }

  /**
   * @summary
   * Open an iframe in a drawer or modal for a visitor currently in a world.
   *
   * @usage
   * ```ts
   * await visitor.openIframe({
   *   droppedAssetId: "droppedAssetId",
   *   link: "https://topia.io",
   *   shouldOpenInDrawer: true,
   *   title: "Hello World",
   * });
   * ```
   */
  async openIframe({
    droppedAssetId,
    link,
    shouldOpenInDrawer,
    title,
  }: OpenIframeInterface): Promise<void | ResponseType> {
    const params = {
      droppedAssetId,
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
      throw this.errorHandler({ error, params, sdkMethod: "Visitor.openIframe" });
    }
  }

  /**
   * @summary
   * Reload an iframe for a visitor currently in a world.
   *
   * @usage
   * ```ts
   * await visitor.reloadIframe("droppedAssetId");
   * ```
   */
  async reloadIframe(droppedAssetId: string): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/reload-iframe`,
        { droppedAssetId },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { droppedAssetId }, sdkMethod: "Visitor.reloadIframe" });
    }
  }

  /**
   * @summary
   * Close an iframe for a visitor currently in a world.
   *
   * @usage
   * ```ts
   * await visitor.closeIframe("droppedAssetId");
   * ```
   */
  async closeIframe(droppedAssetId: string): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/close-iframe`,
        { droppedAssetId },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({ error, params: { droppedAssetId }, sdkMethod: "Visitor.closeIframe" });
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
      throw this.errorHandler({ error, sdkMethod: "Visitor.turnAVOff" });
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
        const response = await this.topiaPublicApi().get(`/expressions?name=${name}`, this.requestOptions);
        expressionId = response.data[0].id;
      }
      const result = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/grant-expression/${expressionId}`,
        {},
        this.requestOptions,
      );
      return result;
    } catch (error) {
      throw this.errorHandler({ error, params: { id, name }, sdkMethod: "Visitor.grantExpression" });
    }
  }

  /**
   * @summary
   * Get all particles available
   *
   * @usage
   * ```ts
   * await visitor.getAllParticles();
   * ```
   */
  async getAllParticles(): Promise<object | ResponseType> {
    try {
      const result = await this.topiaPublicApi().get(`/particles`, this.requestOptions);
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: {}, sdkMethod: "Visitor.getAllParticles" });
    }
  }

  /**
   * @summary
   * Trigger a particle effect on a visitor
   *
   * @usage
   * ```ts
   * await visitor.triggerParticle({ name: "Flame" });
   * ```
   */
  async triggerParticle({
    id,
    name,
    duration = 10,
  }: {
    id?: string;
    name?: string;
    duration?: number;
  }): Promise<object | ResponseType> {
    if (!id && !name) throw "A particle name is required.";
    try {
      let particleId = id;
      if (name) {
        const response = await this.topiaPublicApi().get(`/particles?name=${name}`, this.requestOptions);
        particleId = response.data[0].id;
      }
      const result = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/particles`,
        { particleId, position: { x: 1, y: 1 }, duration, followPlayerId: this.id },
        this.requestOptions,
      );
      return result;
    } catch (error) {
      throw this.errorHandler({ error, params: { id, name }, sdkMethod: "Visitor.triggerParticle" });
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
      throw this.errorHandler({ error, sdkMethod: "Visitor.fetchDataObject" });
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
    options: {
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/set-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "Visitor.setDataObject" });
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
    options: {
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/update-data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );
      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "Visitor.updateDataObject" });
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
   * await visitor.incrementDataObjectValue("key", 1);
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: {
      analytics?: AnalyticType[];
      lock?: { lockId: string; releaseLock?: boolean };
    } = {},
  ): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/increment-data-object-value`,
        { path, amount, ...options },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { path, amount, options },
        sdkMethod: "Visitor.incrementDataObjectValue",
      });
    }
  }

  /**
   * @summary
   * Update analytics for a given public key. Must have valid interactive credentials from a visitor in the world.
   *
   * @usage
   * ```ts
   * await visitor.updatePublicKeyAnalytics([{ analyticName: "joins", profileId, uniqueKey: profileId, urlSlug }]);
   * ```
   */
  async updatePublicKeyAnalytics(analytics?: AnalyticType[]): Promise<void | ResponseType> {
    try {
      await this.topiaPublicApi().put(`/analytics/public-key-analytics`, { analytics }, this.requestOptions);
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { analytics },
        sdkMethod: "Visitor.updatePublicKeyAnalytics",
      });
    }
  }
}

export default Visitor;
