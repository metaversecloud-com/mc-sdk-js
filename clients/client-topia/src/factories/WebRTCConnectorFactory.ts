import { Topia, WebRTCConnector } from "controllers";
import { WebRTCConnectorOptionalInterface } from "interfaces";

/**
 * Factory for creating WebRTCConnector instances. Use this factory to establish WebRTC connections for audio/video in Topia worlds.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 * The WebRTCConnector provides methods to set up and manage real-time audio/video communication.
 *
 * @keywords webrtc, factory, create, audio, video, communication, real-time, conference
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, WebRTCConnectorFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const WebRTCConnector = new WebRTCConnectorFactory(topia);
 * ```
 */
export class WebRTCConnectorFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of WebRTCConnector class for managing audio/video communication.
   *
   * @remarks
   * This method creates a controller instance for establishing and managing WebRTC connections.
   * Use this for implementing real-time audio/video communication features in Topia worlds.
   *
   * @keywords create, instantiate, webrtc, initialize, audio, video, communication, stream
   *
   * @example
   * ```ts
   * // Import the pre-initialized factory from your app's initialization file
   * import { WebRTCConnector } from "utils/topiaInit.ts";
   *
   * // Create a WebRTCConnector instance with credentials and configuration
   * const webRTCInstance = WebRTCConnector.create(
   *   "my-world-slug",
   *   {
   *     credentials: {
   *       interactiveNonce,
   *       interactivePublicKey,
   *       assetId,
   *       urlSlug,
   *       visitorId
   *     },
   *     twilioConfig: {
   *       // Twilio configuration options
   *     }
   *   }
   * );
   *
   * // Use the instance to establish connections
   * await webRTCInstance.connect();
   * ```
   *
   * @returns {WebRTCConnector} Returns a new WebRTCConnector object for managing audio/video communication.
   */
  create(urlSlug: string, options?: WebRTCConnectorOptionalInterface): WebRTCConnector {
    return new WebRTCConnector(this.topia, urlSlug, options);
  }
}

export default WebRTCConnectorFactory;
