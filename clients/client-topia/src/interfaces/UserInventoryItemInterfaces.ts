import { InteractiveCredentials } from "../../dist";
import { InventoryItemInterface } from "./InventoryItemInterfaces";

/**
 * Interface for a user-owned inventory item.
 */
export interface UserInventoryItemInterface extends InventoryItemInterface {
  user_id: string;
  item_id: string;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  grant_source: string;
  profile_id?: string | null;
  item: UserInventoryItemMetadataType;
}

export type UserInventoryItemOptionalInterface = {
  attributes?: UserInventoryItemInterface | object;
  credentials?: InteractiveCredentials;
};

export type UserInventoryItemMetadataType = {
  id: string;
  name: string;
  description: string;
  type: string;
  metadata: object | null;
  image_url: string;
};
