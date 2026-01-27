import { InventoryItem } from "controllers";
import { InteractiveCredentials } from "../../dist";
import { SDKInterface } from "./SDKInterfaces";

/**
 * Interface for an inventory item.
 */
export interface InventoryItemInterface extends SDKInterface {
  fetchInventoryItemById(): Promise<InventoryItem>;

  id: string;
  name?: string;
  description?: string;
  type?: string;
  created_at?: Date;
  updated_at?: Date;
  metadata?: object | null;
  image_path?: string;
  interactive_key_id?: string;
  status?: string;
}

export type InventoryItemOptionalInterface = {
  attributes?: InventoryItemInterface | object;
  credentials?: InteractiveCredentials;
};
