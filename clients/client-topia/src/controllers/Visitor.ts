import axios from "axios";
import { VisitorType } from "types";

export class Visitor {
  apiKey: string;
  urlSlug: string;

  constructor(apiKey: string, urlSlug: string) {
    this.apiKey = apiKey;
    this.urlSlug = urlSlug;
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

      // TODO does this actually make sense here given it only works in the context of a world?
      axios
        .put(`https://api.topia.io/api/world/${this.urlSlug}/visitors/${visitor.id}/move`, requestOptions)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(reject);
    });
  }
}

export default Visitor;
