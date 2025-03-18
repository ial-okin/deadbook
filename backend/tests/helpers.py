import random
from backend.models.survivor import SurvivorBase, SurvivorRegister

def get_survivor_mock() -> SurvivorRegister:
    survivor_base = SurvivorBase(
        name=f"Survivor {random.randint(1, 1000)}",  # Random survivor name with a number
        age=random.randint(18, 60),  # Random age between 18 and 60
        gender=random.choice(["M", "F"]),  # Random gender, M or F
        latitude=random.uniform(-90, 90),  # Random latitude between -90 and 90
        longitude=random.uniform(-180, 180),
    )

    return  SurvivorRegister(**survivor_base.__dict__)




def get_quantity(map, item_name):
    return map.get(item_name, {}).get("quantity")

def inventory_array_to_map(inventory):
    return {item["name"]: item for item in inventory}

def get_db_items(client):
    items_data = client.get("api/items/")

    db_items = items_data.json()

    return {
        "items": db_items,
        "name_map": inventory_array_to_map(db_items)
    }