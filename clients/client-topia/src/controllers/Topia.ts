import axios, { AxiosInstance } from "axios";

// interfaces
import { TopiaInterface } from "interfaces";

// utils
import { getBrowserWarning } from "utils";
import jwt from "jsonwebtoken";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - Topia is the main client class that initializes the SDK.
    - This class should be instantiated ONCE in the consumer app (e.g., utils/topiaInit.ts).
    - The Topia instance is passed to all factory classes to create controllers.
    - This SDK is installed as an NPM package (@rtsdk/topia) in consumer applications.

  DO
    - Expect consumers to create ONE Topia instance at app initialization.
    - This instance is then used to instantiate all factories (WorldFactory, VisitorFactory, etc.).
    - The Topia class configures the Axios client with proper authentication.

  DO NOT
    - Do NOT suggest creating multiple Topia instances; one per app is sufficient.
    - Do NOT suggest instantiating controllers directly; always use factories.
    - Do NOT modify the Axios instance after creation; configure it through constructor.

  AVAILABLE METHODS:
    - constructor(config): Initializes the Topia client with API credentials

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts - Create ONE instance
    import { Topia, WorldFactory, VisitorFactory } from "@rtsdk/topia";

    const topia = new Topia({
      apiKey: "your-api-key",
      apiDomain: "api.topia.io",
      interactiveKey: "your-public-key",
      interactiveSecret: "your-secret-key",
    });

    export const World = new WorldFactory(topia);
    export const Visitor = new VisitorFactory(topia);

============================================================================ */

/**
 * Main Topia SDK client for configuring API access and authentication.
 *
 * @remarks
 * This class should be instantiated ONCE per application at initialization time.
 * The instance configures the Axios HTTP client with proper authentication headers
 * and base URL, and is passed to all factory classes to create controllers.
 *
 * Configuration options:
 * - apiKey: Your Topia API key for server-side authentication
 * - interactiveKey/interactiveSecret: For interactive iframe applications
 * - apiDomain: API endpoint domain (defaults to "api.topia.io")
 * - apiProtocol: HTTP protocol (defaults to "https")
 *
 * @keywords topia, client, sdk, initialization, config, setup, api
 *
 * @example
 * ```ts
 * import { Topia } from "@rtsdk/topia";
 *
 * const topia = new Topia({
 *   apiKey: "your-api-key",
 *   apiDomain: "api.topia.io",
 *   interactiveKey: "your-public-key",
 *   interactiveSecret: "your-secret-key",
 * });
 * ```
 */
export class Topia implements TopiaInterface {
  axios: AxiosInstance;
  apiDomain?: string;
  apiKey?: string;
  apiProtocol?: string;
  interactiveKey?: string;
  interactiveSecret?: jwt.Secret;
  mcAuthorizationKey?: string;

  constructor({
    apiDomain,
    apiKey,
    apiProtocol,
    interactiveKey,
    interactiveSecret,
    mcAuthorizationKey,
  }: {
    apiDomain?: string;
    apiKey?: string;
    apiProtocol?: string;
    interactiveKey?: string;
    interactiveSecret?: jwt.Secret;
    mcAuthorizationKey?: string;
  }) {
    getBrowserWarning();

    this.apiDomain = apiDomain || "api.topia.io";
    this.apiKey = apiKey;
    this.apiProtocol = apiProtocol || "https";
    this.interactiveSecret = interactiveSecret;

    const headers: {
      "ApplicationId"?: string;
      "Authorization"?: string;
      "Content-Type": string;
      "PublicKey"?: string;
      "MCAuthorizationKey"?: string;
    } = {
      "ApplicationId": "sdk-js-topia",
      "Content-Type": "application/json",
    };

    if (apiKey) headers.Authorization = apiKey;
    if (interactiveKey) headers.PublicKey = interactiveKey;
    if (mcAuthorizationKey) headers.MCAuthorizationKey = mcAuthorizationKey;

    this.axios = axios.create({
      baseURL: `${this.apiProtocol}://${this.apiDomain}/api/v1`,
      headers,
    });
  }
}

export default Topia;
