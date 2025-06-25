import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { EcosystemOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";
import { AnalyticType } from "types/AnalyticTypes";

/**
 * @summary
 * Create an instance of Ecosystem class with optional session credentials
 *
 * @usage
 * ```ts
 * await new Ecosystem(topia, {
 *   credentials: { interactiveNonce: "exampleNonce", assetId: "droppedAssetId", visitorId: 1, urlSlug: "exampleWorld" }
 * });
 * ```
 */
export class Ecosystem extends SDKController {
  dataObject?: object | null | undefined;

  constructor(topia: Topia, options: EcosystemOptionalInterface = { credentials: {} }) {
    super(topia, options.credentials);
    this.dataObject = {};
  }

  /**
   * @summary
   * Retrieves the data object for a Topia ecosystem. Requires canUpdateEcosystemDataObjects permission to be set to true for the public key.
   *
   * @usage
   * ```ts
   * const dataObject = await ecosystem.fetchDataObject("exampleAppPublicKey", "exampleAppPublicKeyJWT");
   * ```
   */
  async fetchDataObject(appPublicKey?: string, appPublicKeyJWT?: string): Promise<void | ResponseType> {
    try {
      let query = "";
      if (appPublicKey) query = `?appPublicKey=${appPublicKey}&appPublicKeyJWT=${appPublicKeyJWT}`;
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
   * @summary
   * Sets the data object for a Topia ecosystem.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await ecosystem.setDataObject({ "exampleKey": "exampleValue" }, {
   *   appPublicKey: "exampleAppPublicKey",
   *   appPublicKeyJWT: "exampleAppPublicKeyJWT",}
   * });
   * ```
   */
  async setDataObject(
    dataObject: object | null | undefined,
    options: {
      appPublicKey?: string;
      appPublicKeyJWT?: string;
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
   * @summary
   * Updates the data object for a Topia ecosystem.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await ecosystem.updateDataObject({ "exampleKey": "exampleValue" }, {
   *   appPublicKey: "exampleAppPublicKey",
   *   appPublicKeyJWT: "exampleAppPublicKeyJWT",}
   * });
   * ```
   */
  async updateDataObject(
    dataObject: object,
    options: {
      appPublicKey?: string;
      appPublicKeyJWT?: string;
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
   * @summary
   * Increments a specific value in the data object for a Topia ecosystem by the amount specified. Must have valid interactive credentials from a visitor in the world.
   *
   * Optionally, a lock can be provided with this request to ensure only one update happens at a time between all updates that share the same lock id
   *
   * @usage
   * ```ts
   * await ecosystem.incrementDataObjectValue("key", 1, {
   *   appPublicKey: "exampleAppPublicKey",
   *   appPublicKeyJWT: "exampleAppPublicKeyJWT",}
   * });
   * ```
   */
  async incrementDataObjectValue(
    path: string,
    amount: number,
    options: {
      appPublicKey?: string;
      appPublicKeyJWT?: string;
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
}

export default Ecosystem;
