import { InventoryItem, Topia } from "controllers";
import {
  InventoryItemInterface,
  UserInventoryItemInterface,
  UserInventoryItemMetadataType,
  UserInventoryItemOptionalInterface,
} from "interfaces";

/**
 * Controller for a user's owned inventory item.
 *
 * @remarks
 * This class should be instantiated via UserInventoryItemFactory only.
 * UserInventoryItem represents an instance of an InventoryItem owned by a specific user or visitor.
 * It includes ownership details like quantity, grant_source, and user-specific metadata.
 *
 * @keywords inventory, item, user, visitor, owned, granted
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
  image_url: string;
  profile_id?: string | null;
  item: UserInventoryItemMetadataType;

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
      image_url = "",
      metadata = {},
      created_at = new Date(),
      updated_at = new Date(),
      profile_id = null,
      item = { id: "", name: "", description: "", type: "", metadata: null, image_url: "" },
    } = options.attributes as UserInventoryItemInterface;
    this.item_id = item_id;
    this.quantity = quantity;
    this.grant_source = grant_source;
    this.user_id = user_id;
    this.type = type;
    this.image_url = image_url;
    this.metadata = metadata;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.profile_id = profile_id;
    this.item = item;
  }

  /**
   * Fetches the user inventory item details from the platform and assigns them to this instance.
   *
   * @keywords get, fetch, retrieve, load, user, inventory, item, details, owned
   *
   * @category Inventory
   *
   * @example
   * ```ts
   * await userInventoryItem.fetchUserInventoryItemById();
   * const { quantity, grant_source, item } = userInventoryItem;
   * ```
   *
   * @returns {Promise<void>} Populates this UserInventoryItem instance with all properties from the platform.
   */
  async fetchUserInventoryItemById(): Promise<void> {
    // TODO: Implement API call to fetch user inventory item details
    // Example:
    // const response = await this.topia.api.get(`/inventory/user-items/${this.userId}/${this.inventoryItemId}`, this.options?.credentials);
    // Object.assign(this, response.data);
  }
}

export default UserInventoryItem;
