
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.data.inventory import add_to_inventory
from backend.db.database import get_db
import backend.data.items as items
from backend.models.inventory import InventoryItem
import backend.models.item as item

items_router = APIRouter()

# Get available items
@items_router.get("/", response_model=List[item.ItemBase])
def get_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    db_items = items.get(db=db, skip=skip, limit=limit)
    return db_items

# Add a new item
@items_router.post("/")
def add_item(item: item.ItemBase, db: Session = Depends(get_db)):
    items = [
        InventoryItem(
            quantity=item.points,
            item_id=item.id
        )
    ]
    
    try:
        add_to_inventory(db, "6ed5bada-e474-4282-98c5-366a105c2dc8", items)
        return {
            "message": "Item added"
        }
    except Exception as e:
        print(e)
        return {
            "message": "Error adding item"
        }
