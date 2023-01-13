// @ts-nocheck
// Initialization... on backend
import { Topia, DroppedAssetFactory, TopiaWorldFactory } from "@rtsdk/topia";

const myTopiaInstance = new Topia({
  apiDomain: process.env.INSTANCE_DOMAIN || "api.topia.io/",
  apiKey: process.env.API_KEY,
  interactiveKey: process.env.INTERACTIVE_KEY,
  interactiveSecret: process.env.INTERACTIVE_SECRET,
});

const DroppedAsset = new DroppedAssetFactory(myTopiaInstance);
const TopiaWorld = new TopiaWorldFactory(myTopiaInstance);

export default { myTopiaInstance, DroppedAsset, TopiaWorld };

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// route definition for setTextOnAsset

import { DroppedAsset } from "./src";

const setTextOnAsset = async (req: any, res: any) => {
  const asset = await DroppedAsset.get(req.body.assetId, req.body.urlSlug, { creds: req.body });

  await asset.setAssetText(req.body.text);
};

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

import { DroppedAssetFactory } from "@rtsdk/topia";
import { myTopiaInterface } from "./src";

const setTextOnAsset = async (req: any, res: any) => {
  const asset = await new DroppedAssetFactory(myTopiaInterface).get(req.body.assetId, req.body.urlSlug, {
    creds: req.body,
  });

  await asset.setAssetText(req.body.text);
};