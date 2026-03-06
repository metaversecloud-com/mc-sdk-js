import { InventoryItem } from "controllers";
import { SDKInterface } from "./SDKInterfaces";
import { InteractiveCredentials } from "types";

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
  image_url?: string;
  interactive_key_id?: string;
  status?: string;
}

export type InventoryItemOptionalInterface = {
  attributes?: InventoryItemInterface | object;
  credentials?: InteractiveCredentials;
};
