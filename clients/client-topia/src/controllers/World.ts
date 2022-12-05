import axios from "axios";
import { VisitorType } from "types";
import Visitor from "./Visitor";

const API_URL = "https://api.topia.io/api";

export class World {
  apiKey: string;
  urlSlug: string;

  constructor(apiKey: string, urlSlug: string) {
    this.apiKey = apiKey;
    this.urlSlug = urlSlug;
  }

  async fetchDetails(): Promise<object> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/world/${this.urlSlug}/world-details`, {
          headers: { Authorization: this.apiKey },
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }

  async fetchVisitors(): Promise<object> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API_URL}/world/${this.urlSlug}/visitors`, {
          headers: { Authorization: this.apiKey },
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }

  async moveVisitors(visitors: Array<VisitorType>): Promise<object> {
    const allPromises: any[] = [];
    visitors.map(async (v) => {
      const visitor = await new Visitor(this.apiKey, this.urlSlug);
      allPromises.push(visitor.moveVisitor(v));
    });
    const outcomes = await Promise.allSettled(allPromises);
    return outcomes;
  }
}

export default World;
