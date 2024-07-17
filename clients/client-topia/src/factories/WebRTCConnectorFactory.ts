import { Topia, WebRTCConnector } from "controllers";
import { WebRTCConnectorOptionalInterface } from "interfaces";

/**
 * @usage
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
   * @summary
   * Instantiate a new instance of WebRTCConnector class.
   *
   * @usage
   * ```
   * const userInstance = await WebRTCConnector.create({ credentials: { interactiveNonce, interactivePublicKey, urlSlug, visitorId }, twilioConfig: {} });
   * ```
   */
  create(options?: WebRTCConnectorOptionalInterface): WebRTCConnector {
    return new WebRTCConnector(this.topia, options);
  }
}

export default WebRTCConnectorFactory;
