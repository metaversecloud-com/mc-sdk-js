import { getErrorMessage, publicAPI } from "utils";
import { VisitorInterface } from "interfaces";

export class Visitor {
  apiKey: string;
  moveTo: { x: number; y: number };
  playerId: number;
  urlSlug: string;

  constructor({ apiKey, args, urlSlug }: { apiKey: string; args: VisitorInterface; urlSlug: string }) {
    Object.assign(this, args);
    this.apiKey = apiKey;
    this.moveTo = args.moveTo;
    this.playerId = args.playerId;
    this.urlSlug = urlSlug;
    this.moveVisitor;
  }

  moveVisitor(shouldTeleportVisitor: boolean, x: number, y: number): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/visitors/${this.playerId}/move`, {
          moveTo: {
            x,
            y,
          },
          teleport: shouldTeleportVisitor,
        })
        .then(() => {
          this.moveTo = { x, y };
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default Visitor;
