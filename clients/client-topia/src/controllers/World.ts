import { createVisitor, publicAPI } from "utils";
import { DroppedAsset } from "./DroppedAsset";
import { Visitor } from "./Visitor";

export class World {
  #droppedAssetsMap!: { [key: string]: DroppedAsset };
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

  get droppedAssets() {
    return this.#droppedAssetsMap;
  }

  get visitors() {
    return this.#visitorsMap;
  }

  constructor(apiKey: string, urlSlug: string) {
    this.apiKey = apiKey;
    this.urlSlug = urlSlug;
  }

  // world details
  fetchDetails(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/world-details`)
        .then((response: any) => {
          Object.assign(this, response.data);
          resolve("Success!");
        })
        .catch(reject);
    });
  }

  updateDetails(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/world-details`)
        .then(() => {
          resolve("Success!");
        })
        .catch(reject);
    });
  }

  // visitors
  fetchVisitors(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/visitors`)
        .then((response: any) => {
          // create temp map and then update private property only once
          const tempVisitorsMap: { [key: string]: Visitor } = {};
          for (const playerId in response.data) {
            tempVisitorsMap[playerId] = createVisitor(this.apiKey, response.data[playerId], this.urlSlug);
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

  async moveVisitors(
    shouldFetchVisitors: boolean = true,
    shouldTeleportVisitors: boolean = true,
    x: number,
    y: number,
  ): Promise<object> {
    if (shouldFetchVisitors) await this.fetchVisitors();
    const allPromises: any[] = [];
    const objectKeys = Object.keys(this.visitors);
    objectKeys.forEach((key) => allPromises.push(this.#visitorsMap[key].moveVisitor(shouldTeleportVisitors, x, y)));
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }

  // dropped assets
  fetchDroppedAssets(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/assets`)
        .then((response: any) => {
          // create temp map and then update private property only once
          const tempDroppedAssetsMap: { [key: string]: DroppedAsset } = {};
          for (const id in response.data) {
            // tempDroppedAssetsMap[id] = createDroppedAsset(this.apiKey, response.data[id], this.urlSlug);
            tempDroppedAssetsMap[id] = new DroppedAsset(this.apiKey, response.data[id], this.urlSlug);
          }
          this.#droppedAssetsMap = tempDroppedAssetsMap;
          resolve("Success!");
        })
        .catch(reject);
    });
  }

  updateDroppedAssetCustomText(droppedAsset: DroppedAsset, style: object, text: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await droppedAsset.updateCustomText(style, text);
        resolve("Success!");
      } catch (error) {
        reject();
      }
    });
  }
}

export default World;
