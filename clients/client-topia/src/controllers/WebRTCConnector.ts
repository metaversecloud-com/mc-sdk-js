import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { WebRTCConnectorInterface, WebRTCConnectorOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/**
 * @summary
 * Create an instance of WebRTCConnector class with optional session credentials.
 *
 * @usage
 * ```ts
 * await new WebRTCConnector(topia, {
 *   credentials: { interactiveNonce: "exampleNonce", urlSlug: "exampleWorld", visitorId: 1 }
 * });
 * ```
 */
export class WebRTCConnector extends SDKController implements WebRTCConnectorInterface {
  twilioConfig?: object | null | undefined;

  constructor(topia: Topia, options: WebRTCConnectorOptionalInterface = { twilioConfig: {}, credentials: {} }) {
    super(topia, {
      interactiveNonce: options?.credentials?.interactiveNonce,
      urlSlug: options?.credentials?.urlSlug,
      visitorId: options?.credentials?.visitorId,
    });
    this.twilioConfig = options?.twilioConfig;
  }

  /**
   * @summary
   * Get twilio
   *
   * @usage
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
