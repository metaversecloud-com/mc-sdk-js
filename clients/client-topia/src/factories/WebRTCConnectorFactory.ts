import { Topia, WebRTCConnector } from "controllers";
import { WebRTCConnectorOptionalInterface } from "interfaces";

/**
 * @example
 * ```ts
 * const WebRTCConnector = new WebRTCConnectorFactory(myTopiaInstance);
 * ```
 */
export class WebRTCConnectorFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of WebRTCConnector class.
   *
   * @example
   * ```
   * const webRTCInstance = await WebRTCConnector.create({ credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId }, twilioConfig: {} });
   * ```
   *
   * @returns {WebRTCConnector} Returns a new WebRTCConnector object.
   */
  create(urlSlug: string, options?: WebRTCConnectorOptionalInterface): WebRTCConnector {
    return new WebRTCConnector(this.topia, urlSlug, options);
  }
}

export default WebRTCConnectorFactory;
