from typing import List

from backend.models.inventory import SurvivorInventory, InventoryItem
from backend.models.item import ItemBase

def calculate_trade_points(trade_items:List[InventoryItem], db_items:List[ItemBase]):
    db_item_map = {item.id: item for item in db_items}
    points = 0
    for item in trade_items:
        points += item.quantity * db_item_map.get(item.item_id).points
        
    return points

# Function to check if a survivor has enough items to trade
def has_enough_items(inventory: List[SurvivorInventory], trade_items: List[InventoryItem]):
    # If inventory is a list of dictionaries, you should use the dictionary keys
    inventory_dict = {inv.item_id: inv.quantity for inv in inventory}

    for trade_item in trade_items:
        if inventory_dict.get(trade_item.item_id, 0) < trade_item.quantity:
            return False
    return True

# Function to get unique ids of trade items
def get_unique_item_ids(items: List[InventoryItem]):
    return set([item.item_id for item in items])

def check_inventory_equality(inventory1: List[InventoryItem], inventory2: List[InventoryItem]) -> bool:
    # Sort both inventories by item_id to ensure comparison is order-independent
    inventory1_sorted = sorted(inventory1, key=lambda x: x.item_id)
    inventory2_sorted = sorted(inventory2, key=lambda x: x.item_id)
    
    # Check if the inventories are of the same length
    if len(inventory1_sorted) != len(inventory2_sorted):
        return False
    
    # Check if each item in the inventories is equal
    for item1, item2 in zip(inventory1_sorted, inventory2_sorted):
        if item1.item_id != item2.item_id or item1.quantity != item2.quantity:
            return False
    
    return True