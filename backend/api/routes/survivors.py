from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException
from backend.db.database import get_db
from sqlalchemy.orm import Session
from backend.models.infection_report import InfectionReportCount
import backend.models.survivor as models
from backend.models.inventory import SurvivorInventory
import backend.data.survivors as survivors
import backend.data.inventory as inventory
import backend.services.infection as infection_service

survivors_router = APIRouter()

# Register a new survivor
@survivors_router.post("/", response_model=models.SurvivorResponse)
def create_survivor(survivor: models.SurvivorRegister, db: Session = Depends(get_db)):
    db_survivor = survivors.register(db=db, survivor=survivor)

    return db_survivor

# Get a list of survivors
@survivors_router.get("/", response_model=List[models.SurvivorResponse])
def get_survivors(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    db_survivors = survivors.get(db=db, skip=skip, limit=limit)
    return db_survivors

# Get a list of survivors with inventory
@survivors_router.get("/detailed")
def get_survivors(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    db_survivors = survivors.get_with_inventory(db=db, skip=skip, limit=limit)
    return db_survivors

# Get a survivor by ID
@survivors_router.get("/{survivor_id}", response_model=models.SurvivorResponse)
def get_survivor_by_id(survivor_id: uuid.UUID, db: Session = Depends(get_db)):
    db_survivor = survivors.get_by_id(db=db, survivor_id=survivor_id)
    if db_survivor is None:
        raise HTTPException(status_code=404, detail="Survivor not found")
    return db_survivor

# Get a survivor with details by ID
@survivors_router.get("/{survivor_id}/detailed", response_model=models.SurvivorResponseDetailed)
def get_survivor_by_id(survivor_id: uuid.UUID, db: Session = Depends(get_db)):
    db_survivor = survivors.get_detailed_by_id_(db=db, survivor_id=survivor_id)
    if db_survivor is None:
        raise HTTPException(status_code=404, detail="Survivor not found")
    return db_survivor

# Update survivor's location
@survivors_router.patch("/{survivor_id}/location", response_model=models.SurvivorResponse)
def update_survivor_location(survivor_id: uuid.UUID, location: models.SurvivorLocation, db: Session = Depends(get_db)):
    db_survivor = survivors.update_location(db=db, survivor_id=survivor_id, location=location)
    if db_survivor is None:
        raise HTTPException(status_code=404, detail="Survivor not found")
    return db_survivor

# Report a survivor as infected
@survivors_router.post("/{survivor_id}/report-infection", response_model=InfectionReportCount)
def mark_as_infected(survivor_id: uuid.UUID, report: models.SurvivorInfectionReporter, db: Session = Depends(get_db)):
    db_survivor = survivors.get_by_id(db=db, survivor_id=survivor_id)
    if db_survivor is None:
        raise HTTPException(status_code=404, detail="Survivor not found")
    
    reporter = survivors.get_by_id(db=db, survivor_id=report.reporter_id)
    if reporter is None:
        raise HTTPException(status_code=404, detail="Reporter not found")
    
    report_count = infection_service.create_infection_report(
        db=db,
        report=models.SurvivorInfectionReport(reported_id=survivor_id, reporter_id=report.reporter_id)
    )

    return {
        "count": report_count
    }

# Get survivor's inventory
@survivors_router.get("/{survivor_id}/inventory", response_model=List[SurvivorInventory])
def get_survivor_inventory(survivor_id: uuid.UUID, db: Session = Depends(get_db)):
    db_inventory = inventory.get_by_survivor_id(db=db, survivor_id=survivor_id)
    return db_inventory
