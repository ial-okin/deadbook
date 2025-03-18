from typing import List
from sqlalchemy.orm import Session
from backend.db.schema import Inventory
import backend.models.inventory as models
import uuid

# Create many Inventory items
def createMany(db: Session, items: List[models.InventoryItem], survivor_id: uuid.UUID):
    inventory_items = map(lambda item: Inventory(
        item_id=item.item_id,
        quantity=item.quantity,
        survivor_id=survivor_id
    ), items)

    db.add_all(inventory_items)
    db.commit()

    return inventory_items

# Get Inventory by Survivor ID
def get_by_survivor_id(db: Session, survivor_id: uuid.UUID) -> List[models.SurvivorInventory]:
    inventory_items = db.query(Inventory).filter(Inventory.survivor_id == survivor_id).all()
    
    return [models.SurvivorInventory(
            item_id=item.item_id,
            name=item.item.name,
            quantity=item.quantity
        ) for item in inventory_items]

# Function to add items to a survivor's inventory
def add_to_inventory(db: Session, survivor_id: uuid.UUID, items: List[models.InventoryItem]):  # Assuming items is a list of dictionaries
    for item in items:
        item_id = item.item_id 
        quantity = item.quantity 
        
        existing_item = db.query(Inventory).filter(
            Inventory.survivor_id == survivor_id, Inventory.item_id == item_id
        ).first()
        
        if existing_item:
            existing_item.quantity += quantity
        else:
            new_inventory_item = Inventory(survivor_id=survivor_id, item_id=item_id, quantity=quantity)
            db.add(new_inventory_item)

# Function to remove items from a survivor's inventory
def remove_from_inventory(db: Session, survivor_id: uuid.UUID, items: List[models.InventoryItem]):
    for item in items:
        item_id = item.item_id 
        quantity = item.quantity

        
        existing_item = db.query(Inventory).filter(
            Inventory.survivor_id == survivor_id, Inventory.item_id == item_id
        ).first()
        
        if existing_item:
            if existing_item.quantity <= quantity:  # If removing all or more, delete the item
                db.delete(existing_item)
            else:
                existing_item.quantity -= quantity  # Reduce quantity normally
        