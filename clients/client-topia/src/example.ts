import { Topia, DroppedAssetFactory, TopiaWorldFactory } from "@rtsdk/topia";

const myTopiaInstance = new Topia({
  domain: process.env.INSTANCE_DOMAIN || "https://api.topia.io/",
  apiKey: process.env.API_KEY,
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET,
});

const DroppedAsset = new DroppedAssetFactory(myTopiaInstance);
const World = new TopiaWorldFactory(myTopiaInstance);

export default { myTopiaInstance, DroppedAsset };

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

import { DroppedAsset } from "./";

const setTextOnAsset = async (req: any, res: any) => {
  const asset = await DroppedAsset.get(req.body.assetId, req.body.urlSlug, { creds: req.body });

  await asset.setAssetText(req.body.text);
};
