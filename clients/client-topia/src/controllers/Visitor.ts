import { AxiosResponse } from "axios";

// controllers
import { Topia } from "controllers/Topia";
import { User } from "controllers/User";

// interfaces
import {
  FireToastInterface,
  InventoryItemInterface,
  MoveVisitorInterface,
  OpenIframeInterface,
  UserInventoryItemInterface,
  VisitorInterface,
  VisitorOptionalInterface,
} from "interfaces";

// types
import { ResponseType } from "types";
import { AnalyticType } from "types/AnalyticTypes";
import InventoryItem from "./InventoryItem";
import UserInventoryItem from "./UserInventoryItem";
import { UserInventoryItemFactory } from "factories";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., Visitor).
    - Consumers obtain controller instances via factory methods (e.g., VisitorFactory.get).
    - This SDK is installed as an NPM package (@rtsdk/topia) in consumer applications.

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - DO NOT mutate controller shape or return ad-hoc fields.

  AVAILABLE METHODS:
    - fetchVisitor(): Retrieves visitor details from the world
    - fetchDataObject(): Gets visitor's data object
    - setDataObject(dataObject, options?): Sets visitor's entire data object
    - updateDataObject(dataObject, options?): Updates specific fields in visitor data
    - incrementDataObjectValue(path, amount, options?): Increments numeric value
    - moveVisitor(options): Moves or teleports visitor to coordinates
    - sendMessage(message): Sends chat message as the visitor
    - openIframe(options): Opens iframe for this visitor
    - closeIframe(): Closes visitor's open iframe
    - fireToast(options): Shows toast notification to visitor
    - getNpc(): Gets visitor's NPC if one exists
    - createNpc(userInventoryItemId, options?): Creates NPC follower
    - deleteNpc(): Removes visitor's NPC
    - fetchInventoryItems(): Gets all inventory items owned by visitor
    - grantInventoryItem(item, quantity?): Grants inventory item to visitor
    - modifyInventoryItemQuantity(item, quantity): Updates inventory item quantity

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, VisitorFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Visitor = new VisitorFactory(topia);

    // controllers/myController.ts (consumer app)
    import { Visitor } from "utils/topiaInit.ts";
    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });
    await visitor.fetchDataObject();

============================================================================ */

/**
 * Create an instance of Visitor class with a given id and optional attributes and session credentials.
 *
 * @example
 * ```ts
 * import { Visitor } from "utils/topiaInit.ts";
 *
 * const visitor = await Visitor.get(visitorId, urlSlug, { attributes: { moveTo: { x: 0, y: 0 } }, credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", profileId: "exampleProfileId", visitorId: 1, urlSlug: "exampleUrlSlug" } });
 * ```
 */
export class Visitor extends User implements VisitorInterface {
  readonly id: number;
  urlSlug: string;
  user?: User;
  #visitorInventoryItems: UserInventoryItem[];

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
    this.#visitorInventoryItems = [];
  }

  /**
   * Get a single visitor from a world
   *
   * @keywords get, fetch, retrieve, load, visitor, details
   *
   * @example
   * ```ts
   * await visitor.fetchVisitor();
   * ```
   *
   * @returns
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
   * Teleport or walk a visitor currently in a world to a single set of coordinates.
   *
   * @keywords move, teleport, walk, position, coordinate, location, place
   *
   * @example
   * ```ts
   * await visitor.moveVisitor({
   *   shouldTeleportVisitor: true,
   *   x: 100,
   *   y: 100,
   * });
   * ```
   *
   * @returns
   * Returns `{ success: true }` if the visitor was moved successfully.
   */
  async moveVisitor({ shouldTeleportVisitor, x, y }: MoveVisitorInterface): Promise<void | ResponseType> {
    try {
      const response = await this.topiaPublicApi().put(
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
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { shouldTeleportVisitor, x, y }, sdkMethod: "Visitor.moveVisitor" });
    }
  }

  /**
   * Display a message via a toast to a visitor currently in a world.
   *
   * @keywords toast, message, notification, alert, display, show, popup
   *
   * @example
   * ```ts
   * await visitor.fireToast({
   *   groupId: "custom-message",
   *   title: "Hello World",
   *   text: "Thank you for participating!",
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async fireToast({ groupId, title, text }: FireToastInterface): Promise<void | ResponseType> {
    const params = {
      groupId,
      title,
      text,
    };
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/fire-toast`,
        params,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "Visitor.fireToast" });
    }
  }

  /**
   * Open an iframe in a drawer or modal for a visitor currently in a world.
   *
   * @keywords open, iframe, drawer, modal, link, url, website, web page
   *
   * @category iframes
   *
   * @example
   * ```ts
   * await visitor.openIframe({
   *   droppedAssetId: "droppedAssetId",
   *   link: "https://topia.io",
   *   shouldOpenInDrawer: true,
   *   title: "Hello World",
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
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
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/open-iframe`,
        params,
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "Visitor.openIframe" });
    }
  }

  /**
   * Reload an iframe for a visitor currently in a world.
   *
   * @keywords reload, iframe, drawer, modal, link, url, website, web page
   *
   * @category iframes
   *
   * @example
   * ```ts
   * await visitor.reloadIframe("droppedAssetId");
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async reloadIframe(droppedAssetId: string): Promise<void | ResponseType> {
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/reload-iframe`,
        { droppedAssetId },
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { droppedAssetId }, sdkMethod: "Visitor.reloadIframe" });
    }
  }

  /**
   * Close an iframe for a visitor currently in a world.
   *
   * @keywords close, iframe, drawer, modal
   *
   * @category iframes
   *
   * @example
   * ```ts
   * await visitor.closeIframe("droppedAssetId");
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async closeIframe(droppedAssetId: string): Promise<void | ResponseType> {
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/close-iframe`,
        { droppedAssetId },
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { droppedAssetId }, sdkMethod: "Visitor.closeIframe" });
    }
  }

  /**
   * Mute and turn video off for a visitor currently in a world.
   *
   * @keywords mute, video, av, turn off, disable
   *
   * @example
   * ```ts
   * await visitor.turnAVOff();
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns `{ success: true }` or an error.
   */
  async turnAVOff(): Promise<void | ResponseType> {
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/turn-av-off`,
        {},
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.turnAVOff" });
    }
  }

  /**
   * Get expressions
   *
   * @keywords get, fetch, retrieve, list, expressions, emotes
   *
   * @category Expressions
   *
   * @example
   * ```ts
   * await visitor.getExpressions({ getUnlockablesOnly: true, });
   * ```
   * @returns {Promise<ResponseType>} Returns an array of expressions or an error response.
   */
  async getExpressions({
    name,
    getUnlockablesOnly,
  }: {
    name?: string;
    getUnlockablesOnly?: boolean;
  }): Promise<ResponseType> {
    try {
      let query = `?getUnlockablesOnly=${getUnlockablesOnly}`;
      if (name) query += `&name=${name}`;

      const result = await this.topiaPublicApi().get(`/expressions${query}`, this.requestOptions);
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { name, getUnlockablesOnly }, sdkMethod: "Visitors.getExpressions" });
    }
  }

  /**
   * Grant expression to a visitor by id or name.
   *
   * @keywords grant, give, add, expression, emote
   *
   * @category Expressions
   *
   * @example
   * ```ts
   * await visitor.grantExpression({ id: "exampleExpressionId" });
   * await visitor.grantExpression({ name: "exampleExpressionName" });
   * ```
   *
   * @returns {Promise<ResponseType>} Returns `{ success: true }` if the expression was granted successfully or an error response.
   */
  async grantExpression({ id, name }: { id?: string; name?: string }): Promise<ResponseType> {
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
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { id, name }, sdkMethod: "Visitor.grantExpression" });
    }
  }

  /**
   * Get all particles available
   *
   * @keywords get, fetch, retrieve, list, particles, effects
   *
   * @category Particle Effects
   *
   * @example
   * ```ts
   * await visitor.getAllParticles();
   * ```
   *
   * @returns {Promise<ResponseType>} Returns an array of particles or an error response.
   */
  async getAllParticles(): Promise<ResponseType> {
    try {
      const result = await this.topiaPublicApi().get(`/particles`, this.requestOptions);
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: {}, sdkMethod: "Visitor.getAllParticles" });
    }
  }

  /**
   * Trigger a particle effect on a visitor
   *
   * @keywords trigger, particle, effect, spawn, start, play
   *
   * @category Particle Effects
   *
   * @example
   * ```ts
   * await visitor.triggerParticle({ name: "Flame" });
   * ```
   *
   * @returns {Promise<ResponseType | string>} Returns `{ success: true }` or a message if no particleId is found.
   */
  async triggerParticle({
    id,
    name,
    duration = 10,
  }: {
    id?: string;
    name?: string;
    duration?: number;
  }): Promise<ResponseType | string> {
    if (!id && !name) throw "A particle name is required.";
    try {
      let particleId = id;
      if (name) {
        const response = await this.topiaPublicApi().get(`/particles?name=${name}`, this.requestOptions);
        particleId = response?.data[0]?.id;
      }
      if (!particleId) return "No particleId found.";

      const result = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/particles`,
        { particleId, position: { x: 1, y: 1 }, duration, followPlayerId: this.id },
        this.requestOptions,
      );
      return result.data;
    } catch (error) {
      throw this.errorHandler({ error, params: { id, name }, sdkMethod: "Visitor.triggerParticle" });
    }
  }

  /**
   * Retrieves the data object for a visitor.
   *
   * @keywords get, fetch, retrieve, load, data, object, state
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const dataObject = await visitor.fetchDataObject();
   * ```
   *
   * @returns {Promise<object | ResponseType>} Returns the data object or an error response.
   */
  async fetchDataObject(
    appPublicKey?: string,
    appJWT?: string,
    sharedAppPublicKey?: string,
    sharedAppJWT?: string,
  ): Promise<void | ResponseType> {
    try {
      let query = "";
      if (appPublicKey) query = `?appPublicKey=${appPublicKey}&appJWT=${appJWT}`;
      else if (sharedAppPublicKey) query = `?sharedAppPublicKey=${sharedAppPublicKey}&sharedAppJWT=${sharedAppJWT}`;

      const response: AxiosResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.id}/get-data-object${query}`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.fetchDataObject" });
    }
  }

  /**
   * Sets the data object for a visitor.
   *
   * @keywords set, assign, store, save, data, object, state
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await visitor.setDataObject(
   *   { itemsCollected: 0 },
   *   {
   *     analytics: [{ analyticName: "resets"} ],
   *     lock: { lockId: `${assetId}-${itemsCollected}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
   *   },
   * );
   *
   * const { itemsCollected } = visitor.dataObject;
   * ```
   */
  async setDataObject(
    dataObject: object | null | undefined,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
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
   * Updates the data object for a visitor.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @keywords update, modify, change, edit, alter, data, object, state
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const theme = "exampleTheme";
   *
   * await visitor.updateDataObject({
   *   [`${theme}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
   * });
   *
   * const { exampleTheme } = visitor.dataObject;
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
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
   * Increments a specific value in the data object for a visitor by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @keywords increment, increase, add, count, data, object, state
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await visitor.incrementDataObjectValue("key", 1);
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: {
      appPublicKey?: string;
      appJWT?: string;
      sharedAppPublicKey?: string;
      sharedAppJWT?: string;
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
   * Update analytics for a given public key. Must have valid interactive credentials from a visitor in the world.
   *
   * @keywords update, modify, change, edit, analytics, analytic, stats, statistics, data
   *
   * @example
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

  /**
   * Setup signal to visitor
   *
   * @keywords signal, webrtc, answer, connect, p2p
   *
   * @example
   * ```ts
   * await visitor.sendSignalToVisitor(iceServers);
   * ```
   */
  async sendSignalToVisitor(signal: any): Promise<void | (ResponseType & { answerSignal: any })> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/send-signal-to-visitor`,
        { signal },
        this.requestOptions,
      );
      return response.data;
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { signal },
        sdkMethod: "Visitor.sendSignalToVisitor",
      });
    }
  }

  /**
   * Retrieves all inventory items owned by this visitor and app's key.
   *
   * @keywords get, fetch, retrieve, list, inventory, items, visitor
   *
   * @example
   * ```ts
   * const items = await visitor.fetchInventoryItems();
   * ```
   *
   * @returns {Promise<void>} Returns a new instance of InventoryItem.
   */
  async fetchInventoryItem(item: InventoryItem): Promise<UserInventoryItem> {
    try {
      const response = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.id}/get-visitor-inventory-items/${item.id}`,
        this.requestOptions,
      );

      return new UserInventoryItem(this.topia, response.data.id, {
        attributes: response.data,
        credentials: this.credentials,
      });
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.fetchInventoryItems" });
    }
  }

  /**
   * Retrieves the NPC (Non-Player Character) associated with this visitor, if one exists.
   *
   * @remarks
   * Each visitor can have one NPC per application public key. NPCs are AI-controlled
   * characters that follow the visitor around the world. They are created using inventory
   * items of type "npc" and appear as additional avatars that track the visitor's position.
   * If no NPC exists for this visitor and app, returns null.
   *
   * @keywords get, fetch, retrieve, npc, bot, follower, character, assistant, companion
   *
   * @category NPCs
   *
   * @example
   * ```ts
   * const npc = await visitor.getNpc();
   * if (npc) {
   *   console.log(`NPC position: ${npc.position}`);
   *   console.log(`NPC ID: ${npc.id}`);
   * } else {
   *   console.log('No NPC found for this visitor');
   * }
   * ```
   *
   * @returns {Promise<Visitor | null>} Returns a Visitor object representing the NPC, or null if none exists.
   */
  async getNpc(): Promise<Visitor | null> {
    try {
      const visitorResponse = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.id}/get-npc`,
        this.requestOptions,
      );
      if (visitorResponse.data)
        return new Visitor(this.topia, visitorResponse.data.playerId, this.urlSlug, {
          attributes: visitorResponse.data,
          credentials: this.credentials,
        });
      return null;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.getNpc" });
    }
  }

  /**
   * Creates an NPC (Non-Player Character) that follows this visitor using an inventory item the visitor owns.
   *
   * @remarks
   * One NPC is allowed per visitor, per application public key. NPCs are AI-controlled
   * characters that automatically follow the visitor around the world. They appear as
   * additional avatars and can be useful for companions, guides, or assistant characters.
   *
   * Requirements:
   * - The visitor must own a user inventory item of type "npc"
   * - The item must have been granted to the visitor before calling this method
   * - Only one NPC can exist per visitor per app at a time
   *
   * @keywords create, spawn, add, npc, bot, follower, character, assistant, companion
   *
   * @category NPCs
   *
   * @param userInventoryItemId - The ID of the user's inventory item (must be an NPC type item owned by this visitor)
   * @param options - Optional configuration for the NPC
   * @param options.showNameplate - Whether to display a nameplate above the NPC (default: true)
   *
   * @example
   * ```ts
   * // First, grant the NPC item to the visitor
   * const userItem = await visitor.grantInventoryItem(npcInventoryItem, 1);
   *
   * // Then create the NPC using the granted item
   * const npc = await visitor.createNpc(userItem.id);
   *
   * // Or create without a nameplate
   * const npc = await visitor.createNpc(userItem.id, { showNameplate: false });
   * ```
   *
   * @returns {Promise<Visitor>} Returns a Visitor object representing the created NPC. The NPC will automatically follow the visitor.
   */
  async createNpc(userInventoryItemId: string, options?: { showNameplate?: boolean }): Promise<Visitor> {
    try {
      const response = await this.topiaPublicApi().post(
        `/world/${this.urlSlug}/visitors/${this.id}/create-npc`,
        { userInventoryItemId, showNameplate: options?.showNameplate },
        this.requestOptions,
      );
      return new Visitor(this.topia, response.data.player.playerId, this.urlSlug, {
        attributes: response.data,
        credentials: this.credentials,
      });
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.createNpc" });
    }
  }

  /**
   * Deletes the NPC (Non-Player Character) this app has assigned to this visitor.
   *
   * @remarks
   * This method removes the NPC associated with this visitor for the current application.
   * The NPC will immediately disappear from the world. The underlying inventory item
   * is not consumed and can be used to create a new NPC later.
   *
   * @keywords delete, remove, destroy, dismiss, despawn, npc, bot, follower, character
   *
   * @category NPCs
   *
   * @example
   * ```ts
   * // Check if NPC exists before deleting
   * const npc = await visitor.getNpc();
   * if (npc) {
   *   await visitor.deleteNpc();
   *   console.log('NPC removed successfully');
   * }
   * ```
   *
   * @returns {Promise<void>} Returns nothing if successful.
   */
  async deleteNpc(): Promise<void> {
    try {
      await this.topiaPublicApi().delete(`/world/${this.urlSlug}/visitors/${this.id}/delete-npc`, this.requestOptions);
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.deleteNpc" });
    }
  }

  /**
   * Retrieves all inventory items owned by this visitor and app's key.
   *
   * @keywords get, fetch, retrieve, list, inventory, items, visitor
   *
   * @example
   * ```ts
   * const items = await visitor.fetchInventoryItems();
   * ```
   *
   * @returns {Promise<void>} Returns an array of InventoryItem objects.
   */
  async fetchInventoryItems(): Promise<void> {
    try {
      const response = await this.topiaPublicApi().get(
        `/world/${this.urlSlug}/visitors/${this.id}/get-visitor-inventory-items`,
        this.requestOptions,
      );
      // TODO: Replace 'object' with InventoryItem and instantiate InventoryItem objects if needed
      const tempItems: UserInventoryItem[] = [];
      for (const index in response.data) {
        tempItems.push(
          new UserInventoryItem(this.topia, response.data[index].id, {
            attributes: response.data[index],
            credentials: this.credentials,
          }),
        );
      }
      this.#visitorInventoryItems = tempItems;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.fetchInventoryItems" });
    }
  }

  get inventoryItems() {
    return this.#visitorInventoryItems;
  }

  /**
   * Grants an inventory item to this visitor.
   *
   * @remarks
   * This method requires that the inventory item is already defined in your application's inventory system.
   * Each visitor can only be granted an item once. Use modifyInventoryItemQuantity() to adjust quantities
   * for items the visitor already owns. The grant_source will be set to track where the item came from.
   *
   * Important: This method will throw an error if the visitor already owns this inventory item.
   * Check visitorInventoryItems first or use modifyInventoryItemQuantity() to update existing items.
   *
   * @keywords grant, give, add, inventory, item, visitor, award, reward
   *
   * @category Inventory
   *
   * @param item - The InventoryItem to grant to the visitor
   * @param quantity - The quantity to grant (default: 1)
   *
   * @example
   * ```ts
   * // First create or fetch the inventory item
   * const item = await InventoryItem.get("item-id-123");
   *
   * // Grant it to the visitor
   * const userItem = await visitor.grantInventoryItem(item, 2);
   * console.log(`Granted ${userItem.quantity} items to visitor`);
   * ```
   *
   * @returns {Promise<UserInventoryItem>} Returns the granted UserInventoryItem with quantity and metadata.
   */
  async grantInventoryItem(item: InventoryItemInterface, quantity = 1): Promise<UserInventoryItem> {
    // Error if item already exists in #visitorInventoryItems
    const exists = this.#visitorInventoryItems?.some((visitorItem) => visitorItem.id === item.id);
    if (exists) {
      throw new Error(`Inventory item with id '${item.id}' already exists in visitorInventoryItems.`);
    }
    try {
      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/grant-visitor-inventory-item`,
        { itemId: item.id, quantity },
        this.requestOptions,
      );
      const userInventoryItemFactory = new UserInventoryItemFactory(this.topia);
      const { inventoryItem, user_id, quantity: newQuantity } = response.data;
      return userInventoryItemFactory.create(inventoryItem, user_id, newQuantity as number, {
        attributes: response.data,
        credentials: this.credentials,
      });
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.grantInventoryItem" });
    }
  }

  /**
   * Modifies the quantity of an inventory item in this visitor's inventory.
   * Supports upsert behavior - if the visitor doesn't own the item yet, it will be granted first.
   *
   * @param item Either a UserInventoryItem (for owned items) or an InventoryItem (for upsert).
   * @param quantity The quantity delta to apply (positive to add, negative to subtract).
   *
   * @example
   * ```ts
   * // Modify an existing user inventory item
   * await visitor.modifyInventoryItemQuantity(userItem, 5);
   *
   * // Upsert: grant if not owned, or modify if already owned
   * await visitor.modifyInventoryItemQuantity(inventoryItem, 1);
   * ```
   *
   * @returns {Promise<UserInventoryItem>} Returns the updated inventory item or a response object.
   */
  async modifyInventoryItemQuantity(
    item: UserInventoryItemInterface | InventoryItemInterface,
    quantity: number,
  ): Promise<UserInventoryItem> {
    try {
      // Determine if item is a UserInventoryItem (has userItemId) or InventoryItem (only has id)
      const isUserItem = "userItemId" in item && item.userItemId;

      const body = isUserItem
        ? { userItemId: (item as UserInventoryItem).userItemId, itemId: (item as UserInventoryItem).item_id, quantity }
        : { itemId: item.id, quantity };

      const response = await this.topiaPublicApi().put(
        `/world/${this.urlSlug}/visitors/${this.id}/update-visitor-inventory-item-quantity`,
        body,
        this.requestOptions,
      );
      const userInventoryItemFactory = new UserInventoryItemFactory(this.topia);
      const { inventoryItem, user_id, quantity: newQuantity } = response.data;
      return userInventoryItemFactory.create(inventoryItem, user_id, newQuantity as number, {
        attributes: response.data,
        credentials: this.credentials,
      });
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Visitor.modifyInventoryItemQuantity" });
    }
  }
}

export default Visitor;
