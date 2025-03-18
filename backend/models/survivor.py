from typing import List, Literal
from pydantic import BaseModel
import uuid

from backend.models.inventory import InventoryItem

class SurvivorBase(BaseModel):
    name: str
    age: int
    gender: Literal["M", "F"]
    latitude: float
    longitude: float
    is_infected: bool = False

class SurvivorCreate(SurvivorBase):
    pass

class SurvivorRegister(SurvivorBase):
    inventory: List[InventoryItem] = []

class SurvivorLocation(BaseModel):
    latitude: float
    longitude: float

class SurvivorResponse(SurvivorBase):
    id: uuid.UUID

    model_config = {
        "from_attributes": True
    }

class SurvivorItem(BaseModel):
    id: uuid.UUID
    name: str
    quantity: int

class SurvivorResponseDetailed(SurvivorBase):
    id: uuid.UUID
    inventory: List[SurvivorItem] = []

    model_config = {
        "from_attributes": True
    }

class SurvivorsTrade(BaseModel):
    survivor_1_id: uuid.UUID
    survivor_2_id: uuid.UUID
    survivor_1_items: List[InventoryItem]
    survivor_2_items: List[InventoryItem]

class SurvivorInfectionReporter(BaseModel):
    reporter_id: uuid.UUID

class SurvivorInfectionReport(SurvivorInfectionReporter):
    reported_id: uuid.UUID