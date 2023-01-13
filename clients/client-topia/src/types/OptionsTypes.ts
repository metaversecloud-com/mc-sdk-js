import { AssetInterface, DroppedAssetInterface, VisitorInterface, WorldInterface } from "interfaces";
import { InteractiveCredentials } from "./InteractiveCredentialsTypes";

export type AssetOptions = {
  args?: AssetInterface | object;
  creds?: InteractiveCredentials | object;
};

export type DroppedAssetOptions = {
  args?: DroppedAssetInterface | undefined;
  creds?: InteractiveCredentials | undefined;
};

export type UserOptions = {
  creds?: InteractiveCredentials | undefined;
};

export type VisitorOptions = {
  args?: VisitorInterface | undefined;
  creds?: InteractiveCredentials | undefined;
};

export type WorldOptions = {
  args?: WorldInterface | undefined;
  creds?: InteractiveCredentials | undefined;
};
