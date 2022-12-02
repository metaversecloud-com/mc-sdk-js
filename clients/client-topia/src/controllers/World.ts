import axios from "axios";

const API_URL = "https://api.topia.io/api";

type VisitorType = {
  visitorId: string;
  coordinates: {
    x: number;
    y: number;
  };
};

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

  async moveVisitor(visitor: VisitorType): Promise<object> {
    return new Promise((resolve, reject) => {
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
        .put(`${API_URL}/world/${this.urlSlug}/visitors/${visitor.visitorId}/move`, requestOptions)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}

export default World;
