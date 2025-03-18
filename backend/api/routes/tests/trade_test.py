import json
from typing import List
import uuid

from sqlalchemy.orm import Session

from backend.data.survivors import register as register_survivor
from backend.models.inventory import InventoryItem
from backend.models.survivor import SurvivorResponse, SurvivorsTrade
from backend.tests.helpers import get_db_items, get_quantity, get_survivor_mock, inventory_array_to_map


def test_should_not_trade_when_not_existing_survivor(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    survivor_1_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
    ]
    survivor_2_items = []

    data = seed_data(db, survivor_1_items, survivor_2_items)

    survivor1 = data["survivor_1"]
    
    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=uuid.uuid4(), # Use a random UUID to simulate a non-existing survivor
        survivor_1_items=survivor_1_items,
        survivor_2_items=survivor_2_items
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 404 
    assert response_data["detail"] == "Survivor 2 cannot be found"

def test_should_not_trade_when_survivor_has_no_items(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    survivor_1_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=3),
        InventoryItem(item_id=items_name_map["Medication"]["id"], quantity=1),
        InventoryItem(item_id=items_name_map["Ammunition"]["id"], quantity=10)
    ]
    survivor_2_items = []

    data = seed_data(db, survivor_1_items, survivor_2_items)

    survivor1 = data["survivor_1"]
    survivor2 = data["survivor_2"]
    
    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=survivor2.id,
        survivor_1_items=survivor_1_items,
        survivor_2_items=survivor_2_items
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 409 
    assert response_data["detail"] == "Survivor 2 has no items to trade"

def test_should_not_trade_when_survivor_has_tries_to_trade_mode_items_than_he_has(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    survivor_1_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=3),
    ]
    survivor_2_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
    ]

    data = seed_data(db, survivor_1_items, survivor_2_items)

    survivor1 = data["survivor_1"]
    survivor2 = data["survivor_2"]

    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=survivor2.id,
        survivor_1_items=survivor_1_items,
        survivor_2_items=[
            # Try to trade more items than survivor 2 has
            InventoryItem(item_id=items_name_map["Water"]["id"], quantity=5)
        ]
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 409 
    assert response_data["detail"] == "Trade rejected: Survivor 2 lacks sufficient items"

def test_should_not_trade_when_survivor_has_tries_to_trade_mode_items_than_he_has(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    survivor_1_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=3),
    ]
    survivor_2_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
    ]

    data = seed_data(db, survivor_1_items, survivor_2_items)

    survivor1 = data["survivor_1"]
    survivor2 = data["survivor_2"]

    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=survivor2.id,
        survivor_1_items=survivor_1_items,
        survivor_2_items=[
            # Try to trade more items than survivor 2 has
            InventoryItem(item_id=items_name_map["Water"]["id"], quantity=5)
        ]
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 409 
    assert response_data["detail"] == "Trade rejected: Survivor 2 lacks sufficient items"

def test_should_not_trade_when_survivors_trade_unequal_amount_points(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    survivor_1_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=3),
    ]

    survivor_2_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
        InventoryItem(item_id=items_name_map["Ammunition"]["id"], quantity=15),
    ]

    data = seed_data(db, survivor_1_items, survivor_2_items)

    survivor1 = data["survivor_1"]
    survivor2 = data["survivor_2"]

    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=survivor2.id,
        # Survivor 1 trade points are: 7 (water=1*4=(3) + food=1*3=(3))
        survivor_1_items=[
            InventoryItem(item_id=items_name_map["Water"]["id"], quantity=1),
            InventoryItem(item_id=items_name_map["Food"]["id"], quantity=1),
        ],
        # Survivor 2 trade points are: 6 (water=1*4=(4) + ammunition=1*2=(2))
        survivor_2_items=[
            InventoryItem(item_id=items_name_map["Water"]["id"], quantity=1),
            InventoryItem(item_id=items_name_map["Ammunition"]["id"], quantity=2)
        ]
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 400 
    assert response_data["detail"] == "Trade rejected: Unequal item point values"

def test_should_not_trade_the_same_items(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    trade_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=2),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=3),
    ]

 
    data = seed_data(db, trade_items, trade_items)

    survivor1 = data["survivor_1"]
    survivor2 = data["survivor_2"]

    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=survivor2.id,
        # Survivor 1 trade points are: 7 (water=1*4=(3) + food=1*3=(3))
        survivor_1_items=trade_items,
        # Survivor 2 trade points are: 6 (water=1*4=(4) + ammunition=1*2=(2))
        survivor_2_items=trade_items
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 400 
    assert response_data["detail"] == "Trade rejected: Same items"

def test_should_trade(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]

    survivor_1_items = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=1),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=2),
    ]

    survivor_2_items = [
        InventoryItem(item_id=items_name_map["Medication"]["id"], quantity=3),
        InventoryItem(item_id=items_name_map["Ammunition"]["id"], quantity=10),
    ]

    data = seed_data(db, survivor_1_items, survivor_2_items)

    survivor1 = data["survivor_1"]
    survivor2 = data["survivor_2"]

    trade = SurvivorsTrade(
        survivor_1_id=survivor1.id,
        survivor_2_id=survivor2.id,
        # Survivor 1 trade points are: 7 (water=1*4=(3) + food=1*3=(3))
        survivor_1_items=[
            InventoryItem(item_id=items_name_map["Water"]["id"], quantity=1),
            InventoryItem(item_id=items_name_map["Food"]["id"], quantity=1),
        ],
        # Survivor 2 trade points are: 7 (medication=1*2=(2) + ammunition=1*5=(5))
        survivor_2_items=[
            InventoryItem(item_id=items_name_map["Medication"]["id"], quantity=1),
            InventoryItem(item_id=items_name_map["Ammunition"]["id"], quantity=5)
        ]
    )

    trade_json = json.loads(trade.model_dump_json())
   
    response = client.post("/api/trade", json=trade_json)
    response_data = response.json()

    assert response.status_code == 200 
    assert response_data == True
    
    survivor_1_inventory = client.get(f"/api/survivors/{survivor1.id}/inventory").json()
    survivor_1_inventory_map = inventory_array_to_map(survivor_1_inventory)
    assert get_quantity(survivor_1_inventory_map, "Water") == None
    assert get_quantity(survivor_1_inventory_map, "Food") == 1
    assert get_quantity(survivor_1_inventory_map, "Medication") == 1
    assert get_quantity(survivor_1_inventory_map, "Ammunition") == 5


    survivor_2_inventory = client.get(f"/api/survivors/{survivor2.id}/inventory").json()
    survivor_2_inventory_map = inventory_array_to_map(survivor_2_inventory)
    assert get_quantity(survivor_2_inventory_map, "Water") == 1
    assert get_quantity(survivor_2_inventory_map, "Food") == 1
    assert get_quantity(survivor_2_inventory_map, "Medication") == 2
    assert get_quantity(survivor_2_inventory_map, "Ammunition") == 5


# ==================================================================================================
# Helper functions
def seed_data(
        db: Session,
        survivor1_items: List[InventoryItem],
        survivor2_items: List[InventoryItem]
    ) -> None:
    survivor_1 = get_survivor_mock()
    survivor_1.inventory = survivor1_items
    survivor_1_db = register_survivor(db, survivor_1)

    survivor_2 = get_survivor_mock()
    survivor_2.inventory = survivor2_items
    survivor_2_db = register_survivor(db, survivor_2)

    db.commit()

    return {
        "survivor_1": SurvivorResponse.model_validate(survivor_1_db),
        "survivor_2": SurvivorResponse.model_validate(survivor_2_db),
    }
