import { AssetInterface, DroppedAssetInterface, VisitorInterface, WorldDetailsInterface } from "interfaces";
import { InteractiveCredentials } from "./InteractiveCredentialsTypes";

export type AssetOptions = {
  args?: AssetInterface | undefined;
  creds?: InteractiveCredentials | undefined;
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
  args?: WorldDetailsInterface | undefined;
  creds?: InteractiveCredentials | undefined;
};
