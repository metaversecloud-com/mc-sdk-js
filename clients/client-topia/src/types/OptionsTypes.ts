import { AssetInterface, DroppedAssetInterface, VisitorInterface, WorldInterface } from "interfaces";
import { InteractiveCredentials } from "./InteractiveCredentialsTypes";

export type AssetOptions = {
  attributes?: AssetInterface | object;
  credentials?: InteractiveCredentials | object;
};

export type DroppedAssetOptions = {
  attributes?: DroppedAssetInterface | undefined;
  credentials?: InteractiveCredentials | undefined;
};

export type UserOptions = {
  credentials?: InteractiveCredentials | undefined;
};

export type VisitorOptions = {
  attributes?: VisitorInterface | undefined;
  credentials?: InteractiveCredentials | undefined;
};

export type WorldOptions = {
  attributes?: WorldInterface | undefined;
  credentials?: InteractiveCredentials | undefined;
};
