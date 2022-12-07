import { publicAPI } from "utils";

export class Visitor {
  constructor(
    public apiKey: string,
    public color: string = "",
    public displayName: string,
    public gestureType: number = 0,
    public hidden: boolean = false,
    public isAdmin: boolean = false,
    public isBackground: boolean = false,
    public isMobile: boolean = false,
    public isRecording: boolean = false,
    public isRecordingBot: boolean = false,
    public lastUpdate: number | undefined = undefined,
    public moveFrom: object = {},
    public movedOn: number | undefined = undefined,
    public moveTo: { x: number; y: number } = { x: 0, y: 0 },
    public muted: boolean = false,
    public performer: boolean = false,
    public performerNear: boolean = false,
    public playerId: number | undefined = undefined,
    public shareScreen: boolean = false,
    public sitting: boolean = false,
    public urlSlug: string,
    public username: string | undefined = undefined,
  ) {
    this.moveVisitor;
  }

  moveVisitor(x: number, y: number): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/visitors/${this.playerId}/move`, {
          moveTo: {
            x,
            y,
          },
          teleport: true,
        })
        .then((response: any) => {
          console.log("🚀 ~ file: Visitor.ts:68 ~ Visitor ~ .then ~ response", response);
          // should this update world._visitorsMap?
          this.moveTo.x = response.data.moveTo.x;
          this.moveTo.y = response.data.moveTo.y;
          resolve("Success!");
        })
        .catch(reject);
    });
  }
}

export default Visitor;
