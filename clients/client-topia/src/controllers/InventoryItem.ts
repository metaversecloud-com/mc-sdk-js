import { SDKController, Topia } from "controllers";
import { InventoryItemInterface, InventoryItemOptionalInterface } from "interfaces";
// TODO: Define InventoryItemInterface and InventoryItemOptionalInterface

/**
 * InventoryItem represents an item in a user's inventory.
 *
 * @remarks
 * This class should be instantiated via InventoryFactory only.
 *
 * @keywords inventory, item, asset, object
 */
export class InventoryItem extends SDKController implements InventoryItemInterface {
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
  // Add more properties as needed (e.g., name, quantity, metadata)

  constructor(topia: Topia, id: string, options: InventoryItemOptionalInterface = { attributes: {}, credentials: {} }) {
    super(topia, { ...options.credentials });
    this.id = id;

    Object.assign(this, options.attributes);
    const {
      name = "",
      description = "",
      type = "",
      created_at = new Date(),
      updated_at = new Date(),
      metadata = null,
      image_path = "",
      interactive_key_id = "",
      status = "",
    } = options.attributes as InventoryItemInterface;
    this.name = name;
    this.description = description;
    this.type = type;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.metadata = metadata;
    this.image_path = image_path;
    this.interactive_key_id = interactive_key_id;
    this.status = status;
  }

  /**
   * Fetches the inventory item details from the platform and assigns them to this instance.
   *
   * @keywords get, fetch, retrieve, load, inventory, item, details
   *
   * @category Inventory
   *
   * @example
   * ```ts
   * await item.fetchInventoryItemById();
   * const { name, description, type } = item;
   * ```
   *
   * @returns {Promise<InventoryItem>} Returns this InventoryItem instance with all properties populated from the platform.
   */
  async fetchInventoryItemById(): Promise<InventoryItem> {
    const response = await this.topiaPublicApi().get(`/inventory/${this.id}`, this.requestOptions);
    Object.assign(this, response.data);
    return this;
  }
}

export default InventoryItem;
