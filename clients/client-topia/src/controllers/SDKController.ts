// controllers
import { Topia } from "controllers/Topia";

// interfaces
import { SDKInterface } from "interfaces";

// types
import { InteractiveCredentials } from "types";

// utils
import jwt from "jsonwebtoken";
import { AxiosError } from "axios";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - SDKController is the abstract base class for all SDK controllers.
    - All controllers (World, Visitor, User, etc.) extend this class.
    - This class provides common functionality: authentication, API access, and error handling.
    - This SDK is installed as an NPM package (@rtsdk/topia) in consumer applications.

  DO
    - Understand that all controllers inherit these base methods and properties.
    - Use the error handling pattern defined in errorHandler() for all SDK errors.
    - Access the Topia Public API through topiaPublicApi() method.

  DO NOT
    - Do NOT instantiate SDKController directly; it's an abstract class.
    - Do NOT bypass the error handler; all errors should flow through errorHandler().
    - Do NOT access this.topia.axios directly; use topiaPublicApi() instead.

  AVAILABLE METHODS:
    - topiaPublicApi(): Returns configured Axios instance for API calls
    - errorHandler(options): Standardized error handling for all SDK operations

  INHERITED BY:
    All controllers inherit from this base class, including:
    - World, Visitor, User, Asset, DroppedAsset, Scene, WorldActivity, Ecosystem

============================================================================ */

/**
 * Abstract base controller that provides common functionality for all SDK controllers.
 *
 * @remarks
 * This class should NOT be instantiated directly. It serves as the base class for all
 * SDK controllers (World, Visitor, User, etc.) and provides:
 * - Authentication and credential management
 * - Axios instance configuration for API calls
 * - Standardized error handling
 * - JWT token generation for interactive credentials
 *
 * @keywords base, controller, sdk, authentication, api, abstract
 *
 * @example
 * ```ts
 * // This class is extended by all controllers
 * export class World extends SDKController implements WorldInterface {
 *   // World-specific implementation
 * }
 * ```
 */
export abstract class SDKController implements SDKInterface {
  credentials: InteractiveCredentials | undefined;
  jwt?: string;
  requestOptions: object;
  topia: Topia;

  constructor(topia: Topia, credentials: InteractiveCredentials = {}) {
    const {
      apiKey = null,
      assetId = null,
      interactiveNonce = null,
      profileId = null,
      urlSlug = null,
      visitorId = null,
      iframeId = null,
      gameEngineId = null,
    } = credentials;
    this.topia = topia;
    this.credentials = credentials;
    this.requestOptions = {};

    let payload = {};
    const headers: {
      Authorization?: string;
      InteractiveJWT?: string;
      publickey?: string;
      iframeId?: string;
      gameEngineId?: string;
    } = {};

    try {
      if (topia.interactiveSecret && (profileId || assetId || urlSlug || visitorId)) {
        payload = {
          interactiveNonce,
          visitorId,
          assetId,
          urlSlug,
          profileId,
          date: new Date(),
        };
        this.jwt = jwt.sign(payload, topia.interactiveSecret as string);
        headers.InteractiveJWT = this.jwt;
      }
      if (apiKey) {
        headers.Authorization = apiKey;
      }
      if (iframeId) {
        headers.iframeId = iframeId;
      }
      if (gameEngineId) {
        headers.gameEngineId = gameEngineId;
      }
      this.requestOptions = { headers };
    } catch (error) {
      this.errorHandler({ error });
    }
  }

  /**
   * Returns the configured Axios instance for making API calls to Topia's Public API.
   *
   * @remarks
   * All HTTP requests to the Topia API should use this method to ensure proper
   * authentication headers and base URL configuration are applied.
   *
   * @keywords api, axios, http, request, client, public api
   *
   * @returns {AxiosInstance} The configured Axios client instance with authentication headers.
   */
  topiaPublicApi() {
    return this.topia.axios;
  }

  /**
   * Standardized error handler for all SDK operations.
   *
   * @remarks
   * This method processes errors from API calls and formats them consistently across the SDK.
   * It extracts relevant error information including:
   * - HTTP status codes and response data
   * - Error messages from API responses
   * - Stack traces for debugging
   * - Request details (URL, method, parameters)
   *
   * All errors thrown by SDK methods flow through this handler to ensure consistent error format.
   *
   * @keywords error, exception, handler, debugging, api error, http error
   *
   * @returns {object} Standardized error object with properties: data, message, method, params, sdkMethod, stack, status, success, url
   */
  errorHandler({
    error,
    message = "Something went wrong. Please try again or contact support.",
    params = {},
    sdkMethod,
  }: {
    error?: Error | AxiosError | unknown;
    message?: string;
    params?: object;
    sdkMethod?: string;
  }) {
    const stackTrace = new Error("Thrown here:");
    let data = {},
      errorMessage = message,
      method = "unknown",
      stack = "empty",
      status = 500,
      url = "unknown";

    if (error instanceof AxiosError) {
      errorMessage = error?.message || message;
      if (error.response) {
        status = error.response.status;
        data = error.response.data;
        if (error.response.data.errors) errorMessage = error.response.data.errors[0].message;
      }
      if (error?.config?.url) url = error.config.url;
      if (error?.config?.method) method = error.config.method;
      stack = `${error.stack}\n${stackTrace.stack}`;
    } else if (error instanceof Error) {
      errorMessage = error?.message || message;
      stack = `${error.stack}\n${stackTrace.stack}`;
    }

    return {
      data,
      message: errorMessage,
      method,
      params,
      sdkMethod,
      stack,
      stackTrace,
      status,
      success: false,
      url,
    };
  }
}

export default SDKController;
