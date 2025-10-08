import { InteractiveCredentials } from "../../dist";
import { InventoryItemInterface } from "./InventoryItemInterfaces";

/**
 * Interface for a user-owned inventory item.
 */
export interface UserInventoryItemInterface extends InventoryItemInterface {
  userItemId: string;
  user_id: string;
  item_id: string;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  metadata?: object | null;
  grant_source: string;
}

export type UserInventoryItemOptionalInterface = {
  attributes?: UserInventoryItemInterface | object;
  credentials?: InteractiveCredentials;
};
