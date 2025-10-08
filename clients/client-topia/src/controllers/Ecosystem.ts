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
   * @keywords get, fetch, retrieve, load, data, object, state
   *
   * @category Data Objects
   *
   * @example
   * ```ts
   * const dataObject = await ecosystem.fetchDataObject("exampleAppPublicKey", "exampleAppPublicKeyJWT");
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
   * @keywords set, assign, store, save, data, object, state
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
   * @keywords update, modify, change, edit, alter, data, object, state
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
   * @keywords increment, increase, add, count, data, object, state
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

  /**
   * Retrieves all inventory items for a given keyholder (app public key).
   *
   * @keywords get, fetch, retrieve, list, inventory, items, keyholder
   *
   * @example
   * ```ts
   * const items = await ecosystem.fetchKeyholderInventoryItems("appPublicKey", "appJWT");
   * ```
   *
   * @returns {Promise<object[]>} Returns an array of InventoryItem objects.
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
      throw this.errorHandler({ error, sdkMethod: "Ecosystem.fetchKeyholderInventoryItems" });
    }
  }

  get inventoryItems() {
    return this.#inventoryItems;
  }
}

export default Ecosystem;
