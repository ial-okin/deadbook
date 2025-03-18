from pydantic import BaseModel
import uuid


class InventoryItem(BaseModel):
    quantity: int
    item_id: uuid.UUID

class InventoryNamed(BaseModel):
    name: str

class InventoryResponse(InventoryItem):
    id: uuid.UUID

class SurvivorInventory(BaseModel):
    name: str
    quantity: int
    item_id: uuid.UUID