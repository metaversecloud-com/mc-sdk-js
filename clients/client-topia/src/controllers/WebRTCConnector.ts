import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { WebRTCConnectorInterface, WebRTCConnectorOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * Create an instance of WebRTCConnector class with optional session credentials.
 *
 * @example
 * ```ts
 * const webRTC = await new WebRTCConnector(topia, {
 *   credentials: { interactivePublicKey: "examplePublicKey", interactiveNonce: "exampleNonce", assetId: "exampleDroppedAssetId", profileId: "exampleProfileId", visitorId: 1, urlSlug: "exampleUrlSlug" }
 * });
 * ```
 */
export class WebRTCConnector extends SDKController implements WebRTCConnectorInterface {
  twilioConfig?: object | null | undefined;
  urlSlug: string;

  constructor(
    topia: Topia,
    urlSlug: string,
    options: WebRTCConnectorOptionalInterface = { twilioConfig: {}, credentials: {} },
  ) {
    super(topia, { urlSlug: options?.credentials?.urlSlug || urlSlug, ...options.credentials });
    this.twilioConfig = options?.twilioConfig;
    this.urlSlug = urlSlug;
  }

  /**
   * Get twilio
   *
   * @example
   * ```ts
   * await webRTCConnector.getTwilioConfig();
   * ```
   */
  async getTwilioConfig(): Promise<void | ResponseType> {
    try {
      const response: AxiosResponse = await this.topiaPublicApi().get(`/webrtc/twilio-config`, this.requestOptions);
      this.twilioConfig = response.data.twilioConfig;
      return response.data;
    } catch (error) {
      throw this.errorHandler({ error, sdkMethod: "WebRTCConnector.getTwilioConfig" });
    }
  }
}

export default WebRTCConnector;
