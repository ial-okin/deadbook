from typing import List

from backend.models.inventory import SurvivorInventory, InventoryItem
from backend.models.item import ItemBase
from backend.services.trade.trade_utils import calculate_trade_points, check_inventory_equality, has_enough_items

mock_item_ids = {
    1: "b7a8cdfd-5d04-446a-9707-703cef2f28ce",
    2: "8f1aa690-e366-4494-a3c0-e7b4bee13f9b",
    3: "d435ca29-0390-43db-9208-f1b8d0908efc",
    4: "c9f27505-7241-44b0-8389-c6540d58eaa4"
}

db_items: List[ItemBase] = [
        ItemBase(id=mock_item_ids[1], name="Water", points=4),
        ItemBase(id=mock_item_ids[2], name="Food", points=3),
        ItemBase(id=mock_item_ids[3], name="Medication", points=2),
        ItemBase(id=mock_item_ids[4], name="Ammunition", points=1)
    ]

def test_calculate_trade_points():
    user_inventory: List[SurvivorInventory] = [
        SurvivorInventory(item_id=mock_item_ids[1], quantity=1, name="something"),
        SurvivorInventory(item_id=mock_item_ids[2], quantity=1, name="something"),
        SurvivorInventory(item_id=mock_item_ids[3], quantity=1, name="something")
    ]

    result = calculate_trade_points(user_inventory, db_items)

    # should be 9 because 4 + 3 + 2 = 9
    assert result == 9


def test_has_enough_items_returns_true():
    user_inventory: List[SurvivorInventory] = [
        SurvivorInventory(item_id=mock_item_ids[1], quantity=1, name="something"),
        SurvivorInventory(item_id=mock_item_ids[2], quantity=1, name="something")
    ]

    trade_items:List[InventoryItem] = [
        InventoryItem(item_id=mock_item_ids[1], quantity=1),
        InventoryItem(item_id=mock_item_ids[2], quantity=1)
    ] 

    result = has_enough_items(user_inventory, trade_items)

    assert result == True

def test_has_enough_items_returns_false_when_not_enough_points():
    user_inventory: List[SurvivorInventory] = [
        SurvivorInventory(item_id=mock_item_ids[1], quantity=1, name="something"),
        SurvivorInventory(item_id=mock_item_ids[2], quantity=1, name="something")
    ]

    trade_items:List[InventoryItem] = [
        InventoryItem(item_id=mock_item_ids[1], quantity=1),
        InventoryItem(item_id=mock_item_ids[2], quantity=2)
    ] 

    result = has_enough_items(user_inventory, trade_items)

    assert result == False

def test_has_enough_items_returns_false_when_not_existing_item():
    user_inventory: List[SurvivorInventory] = [
        SurvivorInventory(item_id=mock_item_ids[1], quantity=1, name="something"),
        SurvivorInventory(item_id=mock_item_ids[2], quantity=1, name="something")
    ]

    trade_items:List[InventoryItem] = [
        InventoryItem(item_id=mock_item_ids[3], quantity=1),
    ] 

    result = has_enough_items(user_inventory, trade_items)

    assert result == False

def test_if_trade_items_are_equal():
    inventory: List[InventoryItem] = [
        InventoryItem(item_id=mock_item_ids[1], quantity=1),
        InventoryItem(item_id=mock_item_ids[2], quantity=1)
    ]
    
    result = check_inventory_equality(inventory, inventory)
    assert result == True

    inventory2: List[InventoryItem] = [
        InventoryItem(item_id=mock_item_ids[1], quantity=1),
        InventoryItem(item_id=mock_item_ids[2], quantity=2)
    ]

     
    result = check_inventory_equality(inventory, inventory2)
    assert result == False