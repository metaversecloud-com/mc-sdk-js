import { InventoryItem, Topia } from "controllers";
import { InventoryItemInterface, UserInventoryItemInterface, UserInventoryItemOptionalInterface } from "interfaces";

/**
 * Controller for a user's owned inventory item.
 *
 * @remarks
 * This class should be instantiated via UserInventoryItemFactory only.
 *
 * @property inventoryItemId - The root inventory item's id
 */
export class UserInventoryItem extends InventoryItem implements UserInventoryItemInterface {
  userItemId: string;
  user_id: string;
  item_id: string;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  metadata?: object | null;
  grant_source: string;
  type: string;

  constructor(
    topia: Topia,
    id: string,
    options: UserInventoryItemOptionalInterface = { attributes: {}, credentials: {} },
  ) {
    const { attributes = {} } = options;
    const { item_id = "" } = attributes as UserInventoryItemInterface & InventoryItemInterface;
    super(topia, item_id, { attributes: options.attributes, credentials: options.credentials });

    Object.assign(this, options.attributes);

    this.userItemId = id;
    const {
      user_id = "",
      quantity = 0,
      grant_source = "unknown",
      type = "unknown",
      metadata = {},
      created_at = new Date(),
      updated_at = new Date(),
    } = options.attributes as UserInventoryItemInterface;
    this.item_id = item_id;
    this.quantity = quantity;
    this.grant_source = grant_source;
    this.user_id = user_id;
    this.type = type;
    this.metadata = metadata;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Fetches the user inventory item details from the platform and assigns them to this instance.
   *
   * @example
   * ```ts
   * await userInventoryItem.fetchUserInventoryItemById();
   * ```
   *
   * @returns {Promise<void>} Returns when the item has been fetched and assigned.
   */
  async fetchUserInventoryItemById(): Promise<void> {
    // TODO: Implement API call to fetch user inventory item details
    // Example:
    // const response = await this.topia.api.get(`/inventory/user-items/${this.userId}/${this.inventoryItemId}`, this.options?.credentials);
    // Object.assign(this, response.data);
  }
}

export default UserInventoryItem;
