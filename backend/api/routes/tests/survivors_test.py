import json
import uuid
from pytest import approx

from backend.api.routes.tests.trade_test import get_db_items
from backend.models.inventory import InventoryItem
from backend.models.survivor import SurvivorLocation

import backend.data.inventory as inventory
from backend.tests.helpers import get_survivor_mock

def test_should_register_survivor(client, db):
    db_items = get_db_items(client)
    items_name_map = db_items["name_map"]
    
    survivor = get_survivor_mock()
    survivor.inventory = [
        InventoryItem(item_id=items_name_map["Water"]["id"], quantity=1),
        InventoryItem(item_id=items_name_map["Food"]["id"], quantity=3),
        InventoryItem(item_id=items_name_map["Ammunition"]["id"], quantity=30),
    ]
  
    payload = json.loads(survivor.model_dump_json())

    response = client.post("/api/survivors/", json=payload)
    assert response.status_code == 200

    response_data = response.json()
    assert response_data["name"] == survivor.name
    assert response_data["gender"] == survivor.gender
    assert response_data["age"] == survivor.age
    assert response_data["latitude"] == approx(survivor.latitude, rel=1e-6)  
    assert response_data["longitude"] == approx(survivor.longitude, rel=1e-6)

    survivor_db_inventory = inventory.get_by_survivor_id(db, uuid.UUID(response_data["id"]))
    assert len(survivor_db_inventory) == len(survivor.inventory)

def test_should_update_survivor_location(client, db):
    survivor = get_survivor_mock()
  
    payload = json.loads(survivor.model_dump_json())
    response = client.post("/api/survivors/", json=payload)
    assert response.status_code == 200

    # Update location
    survivor_id = response.json()["id"]
    location_update = SurvivorLocation(
        latitude=10.0,
        longitude=20.0
    )
    payload = json.loads(location_update.model_dump_json())
    response = client.patch(f"/api/survivors/{survivor_id}/location", json=payload)

    assert response.status_code == 200

    # Fetch survivor and check location
    response = client.get(f"/api/survivors/{survivor_id}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["latitude"] == approx(location_update.latitude, rel=1e-6)
    assert response_data["longitude"] == approx(location_update.longitude, rel=1e-6)
