from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from backend.db.schema import Survivor
from backend.models.survivor import SurvivorCreate, SurvivorItem, SurvivorRegister, SurvivorLocation, SurvivorResponseDetailed
import backend.data.inventory as inventory 
import uuid

# Create Survivor
def _create(db: Session, survivor: SurvivorCreate):
    db_survivor = Survivor(
        name=survivor.name,
        age=survivor.age,
        gender=survivor.gender,
        latitude=survivor.latitude,
        longitude=survivor.longitude,
        is_infected=survivor.is_infected
    )
    db.add(db_survivor)
    db.commit()
    
    return db_survivor

# Register Survivor
def register(db: Session, survivor: SurvivorRegister):
    try:  
        db_survivor = _create(db, survivor)

        # Ensure inventory creation is successful before committing
        inventory.createMany(db, survivor.inventory, db_survivor.id)

        db.refresh(db_survivor)  # Refresh only after everything succeeds

        return db_survivor
    except Exception as e:
        db.rollback()  # Rollback if anything fails
        raise e  # Re-raise the exception for handling


# Get all Survivors
def get(db: Session, skip: int = 0, limit: int = 10, include_infected: bool = False):
    query = db.query(Survivor)
    
    if include_infected == False:
        query = query.filter(Survivor.is_infected == False)
    
    return query.offset(skip).limit(limit).all()

# Get all Survivors with inventory
def get_with_inventory(db: Session, skip: int = 0, limit: int = 10, include_infected: bool = False):
    query = db.query(Survivor)

    if include_infected == False:
        query = query.filter(Survivor.is_infected == False)

    survivors = (
        query.options(joinedload(Survivor.inventory)
             .joinedload(inventory.Inventory.item))
             .offset(skip)
             .limit(limit)
             .all()
        )

    return [
        {
            "id": survivor.id,
            "name": survivor.name,
            "inventory": [
                {
                    "id": inv.item.id,        
                    "name": inv.item.name,    
                    "quantity": inv.quantity,
                }
                for inv in survivor.inventory
            ]
        }
        for survivor in survivors
    ]


# Get Survivor by ID
def get_by_id(db: Session, survivor_id: uuid.UUID):
    return (
        db.query(Survivor)
            .filter(Survivor.id == survivor_id)
            .first()
        )

# Get Survivor by ID
def get_detailed_by_id_(db: Session, survivor_id: uuid.UUID):
    db_survivor = (
        db.query(Survivor)
            .filter(Survivor.id == survivor_id)
            .options(joinedload(Survivor.inventory).joinedload(inventory.Inventory.item))
            .first()
        )
    
    return {
            **db_survivor.__dict__,
            "inventory": [
                {
                    "id": inv.item.id,        
                    "name": inv.item.name,    
                    "quantity": inv.quantity,
                }
                for inv in db_survivor.inventory
            ]
        }
    

# Update Survivor location
def update_location(db: Session, survivor_id: uuid.UUID, location: SurvivorLocation):
    db_survivor = db.query(Survivor).filter(Survivor.id == survivor_id).first()
    if db_survivor:
        db_survivor.latitude = location.latitude
        db_survivor.longitude = location.longitude
        db.commit()
        db.refresh(db_survivor)
        return db_survivor
    return None

# Mark Survivor as infected
def mark_as_infected(db: Session, survivor_id: uuid.UUID):
    db_survivor = db.query(Survivor).filter(Survivor.id == survivor_id).first()
    if db_survivor:
        db_survivor.is_infected = True
        db.commit()
        db.refresh(db_survivor)
        return db_survivor
    return None

# Delete Survivor
def delete(db: Session, survivor_id: uuid.UUID):
    db_survivor = db.query(Survivor).filter(Survivor.id == survivor_id).first()
    if db_survivor:
        db.delete(db_survivor)
        db.commit()
        return db_survivor
    return None
