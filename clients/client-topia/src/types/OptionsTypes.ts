import { AssetInterface, DroppedAssetInterface } from "interfaces";
import { InteractiveCredentials } from "./InteractiveCredentialsTypes";

export type DroppedAssetOptions = {
  args?: DroppedAssetInterface;
  creds?: InteractiveCredentials;
};

export type AssetOptions = {
  args?: AssetInterface;
  creds?: InteractiveCredentials;
};
