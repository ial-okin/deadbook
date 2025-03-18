from fastapi import APIRouter, HTTPException
from backend.db.database import get_db
from backend.models import survivor
from fastapi import APIRouter, Depends
from backend.db.database import get_db
from sqlalchemy.orm import Session
import backend.models.survivor as survivor
import backend.services.trade.trade as trade_service

trade_router = APIRouter()

@trade_router.post("/")
def trade(trade: survivor.SurvivorsTrade, db: Session = Depends(get_db)): 
    db_trade = trade_service.trade_items(db=db, trade=trade)
    if db_trade is not True:
        raise HTTPException(status_code=400, detail="Trade rejected")
    
    return True
