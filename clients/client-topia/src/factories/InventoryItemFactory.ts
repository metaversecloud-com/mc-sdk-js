import { Topia } from "controllers";
import { InventoryItem } from "controllers";

/**
 * Factory for creating InventoryItem instances. Use this factory to work with inventory items in the Topia platform.
 *
 * @remarks
 * This factory should be instantiated once per application and reused across your codebase.
 *
 * @keywords inventory, factory, create, get, item
 *
 * @example
 * ```ts
 * // In your initialization file (e.g., utils/topiaInit.ts)
 * import { Topia, InventoryItemFactory } from "@rtsdk/topia";
 * const topia = new Topia({ config });
 * export const Inventory = new InventoryItemFactory(topia);
 * ```
 */
export class InventoryItemFactory {
  topia: Topia;

  constructor(topia: Topia) {
    this.topia = topia;
  }

  /**
   * Instantiate a new instance of InventoryItem class for an inventory item.
   *
   * @example
   * ```ts
   * const item = Inventory.create("item-id-123", { credentials });
   * ```
   *
   * @returns {InventoryItem} Returns a new InventoryItem object for interacting with the specified item.
   */
  create(id: string, options?: object): InventoryItem {
    return new InventoryItem(this.topia, id, options);
  }

  /**
   * Retrieve an inventory item and all its properties.
   *
   * @example
   * ```ts
   * const item = await Inventory.get("item-id-123", { credentials });
   * ```
   *
   * @returns {Promise<InventoryItem>} Returns a new InventoryItem object with all properties.
   */
  async get(id: string, options?: object): Promise<InventoryItem> {
    const item = new InventoryItem(this.topia, id, options);
    await item.fetchInventoryItemById();
    return item;
  }
}

export default InventoryItemFactory;
