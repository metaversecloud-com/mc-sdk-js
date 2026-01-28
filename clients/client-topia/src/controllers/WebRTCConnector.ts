import { AxiosResponse } from "axios";

// controllers
import { SDKController } from "controllers/SDKController";
import { Topia } from "controllers/Topia";

// interfaces
import { WebRTCConnectorInterface, WebRTCConnectorOptionalInterface } from "interfaces";

// types
import { ResponseType } from "types";

/* ============================================================================
AI RULES for code assistants

  CONTEXT
    - "Controllers" expose operations on domain objects (e.g., WebRTCConnector).
    - Consumers obtain controller instances via factory methods (e.g., WebRTCConnectorFactory.create).
    - This SDK is installed as an NPM package (@rtsdk/topia) in consumer applications.

  DO
    - Expect consumers to import a pre-instantiated factory from their app (e.g., utils/topiaInit.ts).
    - Use ONLY the methods defined & documented in this file's types/TSDoc.

  DO NOT
    - Do NOT suggest creating Topia clients or factories inside controllers.
    - Do NOT suggest non-existent methods: getById, fetch, find
    - Do NOT mutate controller shape or return ad-hoc fields.

  AVAILABLE METHODS:
    - getTwilioConfig(): Retrieves Twilio configuration for WebRTC video/audio

  CANONICAL USAGE (consumer app):
    // utils/topiaInit.ts
    import { Topia, WebRTCConnectorFactory } from "@rtsdk/topia";
    const topia = new Topia({ config });
    export const WebRTC = new WebRTCConnectorFactory(topia);

    // controllers/myController.ts (consumer app)
    import { WebRTC } from "utils/topiaInit.ts";
    const webrtc = await WebRTC.create(urlSlug, { credentials });
    await webrtc.getTwilioConfig();

============================================================================ */

/**
 * WebRTC connector for managing real-time video and audio connections in Topia worlds.
 *
 * @remarks
 * This class should NOT be instantiated directly. Use WebRTCConnectorFactory to create instances.
 * The WebRTCConnector provides access to Twilio configuration needed for establishing
 * peer-to-peer video and audio connections between visitors in a world.
 *
 * @see WebRTCConnectorFactory for proper instantiation
 *
 * @keywords webrtc, video, audio, twilio, real-time, communication, voice, peer
 *
 * @example
 * ```ts
 * import { WebRTC } from "utils/topiaInit.ts";
 *
 * const webrtc = await WebRTC.create(urlSlug, { credentials });
 * const config = await webrtc.getTwilioConfig();
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
   * Retrieves the Twilio configuration for WebRTC connections in a world.
   *
   * @remarks
   * This method fetches the Twilio room configuration needed to establish peer-to-peer
   * video and audio connections between visitors. The configuration includes authentication
   * tokens and room settings. Call this before initializing WebRTC connections.
   *
   * @keywords get, fetch, retrieve, webrtc, twilio, configuration, video, audio, connection
   *
   * @category WebRTC
   *
   * @example
   * ```ts
   * await webRTCConnector.getTwilioConfig();
   * const { twilioConfig } = webRTCConnector;
   * console.log(twilioConfig); // Use for WebRTC setup
   * ```
   *
   * @returns {Promise<void | ResponseType>} Populates twilioConfig property with Twilio room configuration, or returns an error response.
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
