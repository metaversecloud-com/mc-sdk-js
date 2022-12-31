import { AxiosResponse } from "axios";
import { getErrorMessage, publicAPI, removeUndefined, scatterVisitors } from "utils";
import { DroppedAsset } from "controllers/DroppedAsset";
import { Visitor } from "controllers/Visitor";
import { VisitorsToMoveArrayType } from "types";
import { MoveAllVisitorsInterface, WorldDetailsInterface } from "interfaces";

export class World implements WorldDetailsInterface {
  #droppedAssetsMap: { [key: string]: DroppedAsset };
  #visitorsMap: { [key: string]: Visitor };
  apiKey: string;
  urlSlug: string;

  constructor({ apiKey, args, urlSlug }: { apiKey: string; args: WorldDetailsInterface; urlSlug: string }) {
    Object.assign(this, args);
    this.#droppedAssetsMap = {};
    this.#visitorsMap = {};
    this.apiKey = apiKey;
    this.urlSlug = urlSlug;
  }

  get droppedAssets() {
    return this.#droppedAssetsMap;
  }

  get visitors() {
    return this.#visitorsMap;
  }

  // world details
  fetchDetails(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/world-details`)
        .then((response: AxiosResponse) => {
          Object.assign(this, response.data);
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  updateDetails({
    controls,
    description,
    forceAuthOnLogin,
    height,
    name,
    spawnPosition,
    width,
  }: WorldDetailsInterface): Promise<string> {
    const payload: any = {
      controls,
      description,
      forceAuthOnLogin,
      height,
      name,
      spawnPosition,
      width,
    };
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/world-details`, payload)
        .then(() => {
          const cleanPayload = removeUndefined(payload);
          Object.assign(this, cleanPayload);
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  // visitors
  fetchVisitors(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/visitors`)
        .then((response: AxiosResponse) => {
          // create temp map and then update private property only once
          const tempVisitorsMap: { [key: string]: Visitor } = {};
          for (const playerId in response.data) {
            tempVisitorsMap[playerId] = new Visitor({
              apiKey: this.apiKey,
              args: response.data[playerId],
              urlSlug: this.urlSlug,
            });
          }
          this.#visitorsMap = tempVisitorsMap;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  async currentVisitors() {
    try {
      await this.fetchVisitors();
      return this.visitors;
    } catch (error) {
      return error;
    }
  }

  async moveAllVisitors({
    shouldFetchVisitors = true,
    shouldTeleportVisitors = true,
    scatterVisitorsBy = 0,
    x,
    y,
  }: MoveAllVisitorsInterface) {
    if (shouldFetchVisitors) await this.fetchVisitors();
    const allPromises: Array<Promise<string>> = [];
    if (!this.visitors) return;
    const objectKeys = Object.keys(this.visitors);
    objectKeys.forEach((key) =>
      allPromises.push(
        this.#visitorsMap[key].moveVisitor(
          shouldTeleportVisitors,
          scatterVisitors(x, scatterVisitorsBy),
          scatterVisitors(y, scatterVisitorsBy),
        ),
      ),
    );
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }

  async moveVisitors(visitorsToMove: VisitorsToMoveArrayType) {
    const allPromises: Array<Promise<string>> = [];
    visitorsToMove.forEach((v) => {
      allPromises.push(v.visitorObj.moveVisitor(v.shouldTeleportVisitor, v.x, v.y));
    });
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }

  // dropped assets
  fetchDroppedAssets(): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .get(`/world/${this.urlSlug}/assets`)
        .then((response: AxiosResponse) => {
          // create temp map and then update private property only once
          const tempDroppedAssetsMap: { [key: string]: DroppedAsset } = {};
          for (const id in response.data) {
            // tempDroppedAssetsMap[id] = createDroppedAsset(this.apiKey, response.data[id], this.urlSlug);
            tempDroppedAssetsMap[id] = new DroppedAsset({
              apiKey: this.apiKey,
              id,
              args: response.data[id],
              urlSlug: this.urlSlug,
            });
          }
          this.#droppedAssetsMap = tempDroppedAssetsMap;
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }

  async updateCustomTextDroppedAssets(droppedAssetsToUpdate: Array<DroppedAsset>, style: object): Promise<object> {
    // adds ability to update any styles for specified dropped assets only while preserving text
    const allPromises: Array<Promise<string>> = [];
    droppedAssetsToUpdate.forEach((a) => {
      allPromises.push(a.updateCustomText(style, a.text));
    });
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }

  // scenes
  replaceScene(sceneId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      publicAPI(this.apiKey)
        .put(`/world/${this.urlSlug}/change-scene`, { sceneId })
        .then(() => {
          resolve("Success!");
        })
        .catch((error) => {
          reject(new Error(getErrorMessage(error)));
        });
    });
  }
}

export default World;
