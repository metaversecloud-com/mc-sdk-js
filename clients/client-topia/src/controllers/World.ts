import { publicAPI } from "utils";
import Visitor from "./Visitor";

export class World {
  #visitorsMap!: { [key: string]: Visitor };
  apiKey: string;
  background!: string;
  controls!: object;
  created!: object;
  description!: string;
  enforceWhitelistOnLogin!: boolean;
  forceAuthOnLogin!: boolean;
  height!: number;
  heroImage!: string;
  mapExists!: boolean;
  name!: string;
  redirectTo!: string;
  spawnPosition!: object;
  tileBackgroundEverywhere!: boolean;
  urlSlug: string;
  useTopiaPassword!: boolean;
  width!: number;

  get visitors() {
    return this.#visitorsMap;
  }

  constructor(apiKey: string, urlSlug: string) {
    this.apiKey = apiKey;
    this.urlSlug = urlSlug;
  }

  async fetchDetails(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/world-details`, {
          headers: { Authorization: this.apiKey },
        })
        .then((response: any) => {
          const data = response.data;
          this.background = data.background;
          this.controls = data.controls;
          this.created = data.created;
          this.description = data.description;
          this.enforceWhitelistOnLogin = data.enforceWhitelistOnLogin;
          this.forceAuthOnLogin = data.forceAuthOnLogin;
          this.height = data.height;
          this.heroImage = data.heroImage;
          this.mapExists = data.mapExists;
          this.name = data.name;
          this.redirectTo = data.redirectTo;
          this.spawnPosition = data.spawnPosition;
          this.tileBackgroundEverywhere = data.tileBackgroundEverywhere;
          this.useTopiaPassword = data.useTopiaPassword;
          this.width = data.width;
          resolve("Success!");
        })
        .catch(reject);
    });
  }

  async updateDetails(): Promise<object> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/world-details`, {
          headers: { Authorization: this.apiKey },
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }

  async fetchVisitors(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/visitors`, {
          headers: { Authorization: this.apiKey },
        })
        .then((response: any) => {
          // create temp map and then update private property only once
          const tempVisitorsMap: { [key: string]: Visitor } = {};
          for (const playerId in response.data) {
            const data = response.data[playerId];
            const visitor = new Visitor(
              this.apiKey,
              data.color,
              data.displayName,
              data.gestureType,
              data.hidden,
              data.isAdmin,
              data.isBackground,
              data.isMobile,
              data.isRecording,
              data.isRecordingBot,
              data.lastUpdate,
              data.moveFrom,
              data.movedOn,
              data.moveTo,
              data.muted,
              data.performer,
              data.performerNear,
              data.playerId,
              data.shareScreen,
              data.sitting,
              this.urlSlug,
              data.username,
            );
            tempVisitorsMap[playerId] = visitor;
          }
          this.#visitorsMap = tempVisitorsMap;
          resolve("Success!");
        })
        .catch(reject);
    });
  }

  currentVisitors(): Promise<object> {
    return new Promise(async (resolve, reject) => {
      await this.fetchVisitors();
      resolve(this.visitors);
    });
  }

  async moveVisitors(shouldFetchVisitors: boolean = true, x: number, y: number): Promise<object> {
    if (shouldFetchVisitors) await this.fetchVisitors();
    const allPromises: any[] = [];
    const objectKeys = Object.keys(this.visitors);
    objectKeys.forEach((key) => allPromises.push(this.#visitorsMap[key].moveVisitor(x, y)));
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }
}

export default World;
