import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { EcosystemOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";
import { AnalyticType } from "types/AnalyticTypes";
import InventoryItem from "./InventoryItem";

// utils
import { BannedStringMatcher, createBannedStringMatcher } from "utils";

// The banned lists change rarely and the API already caches them for 24 hours, so a
// cached matcher spares every check an HTTP round trip. Module level rather than per
// instance because apps create an Ecosystem per request; keyed by API domain so an app
// talking to more than one Topia instance never reads another instance's lists.
const BANNED_STRINGS_CACHE_MS = 720 * 60 * 1000; // 12 hours
const bannedStringsCache = new Map<string, { matcher: BannedStringMatcher; expiresAt: number }>();
const bannedStringsRequests = new Map<string, Promise<BannedStringMatcher>>();

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., Ecosystem).
    - Consumers obtain controller instances via factory methods (e.g., EcosystemFactory.get).

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - Do NOT mutate controller shape or return ad-hoc fields.

  AVAILABLE METHODS:
    - fetchDataObject(appPublicKey?, appJWT?, sharedAppPublicKey?, sharedAppJWT?): Retrieves ecosystem-wide data object
    - setDataObject(dataObject, options?): Sets entire ecosystem data object
    - updateDataObject(dataObject, options?): Updates specific fields in ecosystem data object
    - incrementDataObjectValue(path, amount, options?): Increments a numeric value in ecosystem data
    - fetchInventoryItems(): Retrieves all inventory items for the app's keyholder
    - checkIsBannedString(text): Returns true when text matches a platform banned word, sentence or emoji

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, Ecosystem } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const Ecosystem = new EcosystemFactory(topia);

    // controllers/myController.ts (consumer app)
    import { Ecosystem } from "utils/topiaInit.ts";
    const ecosystem = await Ecosystem.create({ credentials });
    await ecosystem.fetchDataObject();

============================================================================ */

/**
 * Create an instance of Ecosystem class with optional session credentials
 *
 * @example
 * ```ts
 * import { Ecosystem } from "utils/topiaInit.ts";
 *
 * const ecosystem = await Ecosystem.create({
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
export class Ecosystem extends SDKController {
  dataObject?: object | null | undefined;

  #inventoryItems: InventoryItem[];

  constructor(topia: Topia, options: EcosystemOptionalInterface = { credentials: {} }) {
    super(topia, options.credentials);
    this.dataObject = {};
    this.#inventoryItems = [];
  }

  /**
   * Retrieves the data object for a Topia ecosystem. Requires canUpdateEcosystemDataObjects permission to be set to true for the public key.
   *
   * @keywords get, fetch, retrieve, load, ecosystem, data, object, state, global, platform
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const dataObject = await ecosystem.fetchDataObject("exampleAppPublicKey", "exampleAppPublicKeyJWT");
   * ```
   *
   * @returns {Promise<void | ResponseType>} Populates the dataObject property with ecosystem-wide data, or returns an error response.
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
        `/ecosystem/data-object${query}`,
        this.requestOptions,
      );
      this.dataObject = response.data;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Ecosystem.fetchDataObject" });
    }
  }

  /**
   * Sets the data object for a Topia ecosystem.
   *
   * @remarks
   * This method also allows you to set a data object on behalf of another Public Key. It requires `canUpdateEcosystemDataObjects` permission to be set to true for the Public Key.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @keywords set, assign, store, save, ecosystem, data, object, state, global, platform
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await ecosystem.setDataObject({ "exampleKey": "exampleValue" }, {
   *   sharedAppPublicKey: "exampleAppPublicKey",
   *   sharedAppJWT: "exampleAppPublicKeyJWT",}
   * });
   * const { exampleKey } = ecosystem.dataObject;
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns success or an error response.
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
      await this.topiaPublicApi().post(
        `/ecosystem/data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );

      this.dataObject = dataObject || this.dataObject;
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "Ecosystem.setDataObject" });
    }
  }

  /**
   * Updates the data object for a Topia ecosystem.
   *
   * @remarks
   * This method also allows you to update a data object on behalf of another Public Key. It requires `canUpdateEcosystemDataObjects` permission to be set to true for the Public Key.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @keywords update, modify, change, edit, alter, ecosystem, data, object, state, global, platform
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await ecosystem.updateDataObject({
   *    [`profiles.${profileId}.itemsCollectedByUser`]: { [dateKey]: { count: 1 }, total: 1 },
   *    [`profileMapper.${profileId}`]: username,
   *  }, {
   *    sharedAppPublicKey: "exampleAppPublicKey",
   *    sharedAppJWT: "exampleAppPublicKeyJWT",
   *    analytics: [{ analyticName: "itemCollected", profileId, uniqueKey: profileId, urlSlug } ],
   *    lock: { lockId: `${assetId}-${resetCount}-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}` },
   *  }
   * });
   * const { exampleKey } = ecosystem.dataObject;
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns success or an error response.
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
        `/ecosystem/data-object`,
        { ...options, dataObject: dataObject || this.dataObject },
        this.requestOptions,
      );
      this.dataObject = { ...(this.dataObject || {}), ...(dataObject || {}) };
    } catch (error) {
      throw this.errorHandler({ error, params: { dataObject, options }, sdkMethod: "Ecosystem.updateDataObject" });
    }
  }

  /**
   * Increments a specific value in the data object for a Topia ecosystem by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * @remarks
   * This method also allows you to increment a data object value on behalf of another Public Key. It requires `canUpdateEcosystemDataObjects` permission to be set to true for the Public Key.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @keywords increment, increase, add, count, ecosystem, data, object, state, global, platform
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * await ecosystem.incrementDataObjectValue("key", 1, {
   *   sharedAppPublicKey: "exampleAppPublicKey",
   *   sharedAppJWT: "exampleAppPublicKeyJWT",}
   * });
   * ```
   *
   * @returns {Promise<void | ResponseType>} Returns success or an error response.
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
        `/ecosystem/increment-data-object-value`,
        { path, amount, ...options },
        this.requestOptions,
      );
    } catch (error) {
      throw this.errorHandler({
        error,
        params: { path, amount, options },
        sdkMethod: "Ecosystem.incrementDataObjectValue",
      });
    }
  }

  // Returns a matcher built from the platform's banned lists, fetching them only when
  // nothing valid is cached. Concurrent callers share one in-flight request instead of
  // each firing their own.
  async #fetchBannedStrings(): Promise<BannedStringMatcher> {
    const key = this.topia.apiDomain || "";

    const cached = bannedStringsCache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.matcher;

    const inFlight = bannedStringsRequests.get(key);
    if (inFlight) return inFlight;

    const request = (async () => {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/ecosystem/banned-strings`, this.requestOptions);
      const matcher = createBannedStringMatcher(response.data || {});
      bannedStringsCache.set(key, { matcher, expiresAt: Date.now() + BANNED_STRINGS_CACHE_MS });
      return matcher;
    })().finally(() => bannedStringsRequests.delete(key));

    bannedStringsRequests.set(key, request);
    return request;
  }

  /**
   * Checks a string against the platform's banned words, sentences and emojis.
   *
   * @remarks
   * Use this to screen user generated content — a display name, a chat line, a submitted answer — before sending it on, so the app can give immediate feedback instead of having the platform reject it later.
   *
   * This applies the same matcher the server uses, so a result here should agree with the platform's own check. It is still a courtesy check, not a replacement: the server screens independently and remains the authority.
   *
   * Matching is by whole word, not substring, so `classic` is not flagged by a banned `ass`. Leetspeak (`d4rn`), spelled-out words (`d.a.r.n`) and padded endings (`go awayyy`) are all caught.
   *
   * The lists are fetched once and cached on first use, so calling this per keystroke costs nothing after the first call. The platform caches them for up to 24 hours, so a change made in HQ may take that long to appear.
   *
   * @keywords check, test, validate, screen, filter, banned, blocked, profanity, moderation, words, strings, ecosystem, platform
   *
   * @category Moderation
   *
   * @example
   * ```ts
   * if (await ecosystem.checkIsBannedString(displayName)) {
   *   return res.status(400).json({ message: "Please choose a different name." });
   * }
   * ```
   *
   * @returns {Promise<boolean>} True when the text matches a banned word, sentence or emoji. Empty input is never banned.
   */
  async checkIsBannedString(text: string): Promise<boolean> {
    try {
      if (!text) return false;

      const matcher = await this.#fetchBannedStrings();
      return matcher.test(text);
    } catch (error) {
      throw this.errorHandler({ error, params: { text }, sdkMethod: "Ecosystem.checkIsBannedString" });
    }
  }

  /**
   * Retrieves all inventory items for a given keyholder (app public key).
   *
   * @keywords get, fetch, retrieve, list, inventory, items, keyholder, ecosystem, catalog
   *
   * @category Inventory
   *
   * @example
   * ```ts
   * await ecosystem.fetchInventoryItems();
   * const items = ecosystem.inventoryItems;
   * ```
   *
   * @returns {Promise<void>} Populates the inventoryItems property with an array of InventoryItem objects.
   */
  async fetchInventoryItems(): Promise<void> {
    try {
      // const query = appJWT ? `?appPublicKey=${appPublicKey}&appJWT=${appJWT}` : `?appPublicKey=${appPublicKey}`;
      const response = await this.topiaPublicApi().get(`/inventory/`, this.requestOptions);
      // TODO: Replace 'object' with InventoryItem and instantiate InventoryItem objects if needed
      // create temp map and then update private property only once
      const tempItems: InventoryItem[] = [];
      for (const index in response.data) {
        tempItems.push(
          new InventoryItem(this.topia, response.data[index].id, {
            attributes: response.data[index],
            credentials: this.credentials,
          }),
        );
      }
      this.#inventoryItems = tempItems;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "Ecosystem.fetchInventoryItems" });
    }
  }

  get inventoryItems() {
    return this.#inventoryItems;
  }
}

export default Ecosystem;
