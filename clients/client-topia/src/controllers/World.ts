import axios from "axios";
import { VisitorType } from "types";

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
    visitors.map(async (visitor) => {
      const promise = new Promise((resolve, reject) => {
        const requestOptions = {
          headers: { Authorization: this.apiKey },
          body: {
            moveTo: {
              x: visitor.coordinates.x,
              y: visitor.coordinates.y,
            },
            teleport: true,
          },
        };

        axios
          .put(`${API_URL}/world/${this.urlSlug}/visitors/${visitor.id}/move`, requestOptions)
          .then((response: any) => {
            resolve(response.data);
          })
          .catch(reject);
      });
      allPromises.push(promise);
    });

    const outcomes = await Promise.allSettled(allPromises);
    // const succeeded = outcomes.filter((o) => o.status === "fulfilled");
    // const failed = outcomes.filter((o) => o.status === "rejected");
    return outcomes;
  }
}

export default World;
