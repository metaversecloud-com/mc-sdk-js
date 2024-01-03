import { SDKController, Topia, World } from "controllers";
import { WorldOptionalInterface } from "interfaces";
import jwt from "jsonwebtoken";
export class WorldFactory extends SDKController {
  constructor(topia: Topia) {
    super(topia);
  }

  create(urlSlug: string, options?: WorldOptionalInterface): World {
    return new World(this.topia, urlSlug, options);
  }

  async deleteDroppedAssets(
    urlSlug: string,
    droppedAssetIds: string[],
    interactivePublicKey: string,
    interactiveSecret: string,
  ) {
    const params = { droppedAssetIds, urlSlug, interactivePublicKey, interactiveSecret };
    try {
      const interactiveJWT = jwt.sign(interactivePublicKey, interactiveSecret);

      const promiseArray = [];
      for (const id of droppedAssetIds) {
        promiseArray.push(
          this.topiaPublicApi().delete(`/world/${urlSlug}/assets/${id}`, {
            headers: { interactiveJWT, publickey: interactivePublicKey },
          }),
        );
      }
      const result = await Promise.all(promiseArray);
      console.log(result);

      return { success: true };
    } catch (error) {
      throw this.errorHandler({ error, params, sdkMethod: "DroppedAssetFactory.getWithUniqueName" });
    }
  }
}

export default WorldFactory;
