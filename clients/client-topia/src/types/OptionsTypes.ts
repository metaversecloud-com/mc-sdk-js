import { AssetInterface, DroppedAssetInterface, VisitorInterface, WorldDetailsInterface } from "interfaces";
import { InteractiveCredentials } from "./InteractiveCredentialsTypes";

export type AssetOptions = {
  attributes?: AssetInterface | undefined;
  credentials?: InteractiveCredentials | undefined;
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
  attributes?: WorldDetailsInterface | undefined;
  credentials?: InteractiveCredentials | undefined;
};
