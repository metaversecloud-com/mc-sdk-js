import { Topia, UserInventoryItem } from "controllers";
// import { UserInventoryItem } from "controllers";

/**
 * Factory for creating UserInventoryItem instances. Use this factory to work with user-owned inventory items.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, UserInventoryItemFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const UserInventoryItem = new UserInventoryItemFactory(topia);
 * ```
 */
export class UserInventoryItemFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of UserInventoryItem class for a user's owned item.
   *
   * @example
   * ```ts
   * const userItem = UserInventoryItem.create("item-id-123", 42, 5, { credentials });
   * ```
   *
   * @returns {UserInventoryItem} Returns a new UserInventoryItem object for interacting with the specified item.
   */
  create(inventoryItemId: string, userId: number, quantity: number, options?: object): UserInventoryItem {
    return new UserInventoryItem(this.topia, inventoryItemId, options);
  }

  /**
   * Retrieve a user inventory item and all its properties.
   *
   * @example
   * ```ts
   * const userItem = await UserInventoryItem.get("item-id-123", 42, { credentials });
   * ```
   *
   * @returns {Promise<UserInventoryItem>} Returns a new UserInventoryItem object with all properties.
   */
  async get(inventoryItemId: string, options?: object): Promise<UserInventoryItem> {
    const userItem = new UserInventoryItem(this.topia, inventoryItemId, options);
    await userItem.fetchUserInventoryItemById();
    return userItem;
  }
}

export default UserInventoryItemFactory;
