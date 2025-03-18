from pydantic import BaseModel
import uuid

class ItemBase(BaseModel):
    id: uuid.UUID
    name: str
    points: int

class ItemCreate(BaseModel):
    name: str
    points: int

class ItemDB(ItemBase):
    model_config = {
        "from_attributes": True
    }