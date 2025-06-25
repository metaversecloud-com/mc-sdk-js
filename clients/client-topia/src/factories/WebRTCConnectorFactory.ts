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
   * const webRTCInstance = await WebRTCConnector.create({ credentials: { interactiveNonce, interactivePublicKey, assetId, urlSlug, visitorId }, twilioConfig: {} });
   * ```
   */
  create(urlSlug: string, options?: WebRTCConnectorOptionalInterface): WebRTCConnector {
    return new WebRTCConnector(this.topia, urlSlug, options);
  }
}

export default WebRTCConnectorFactory;
