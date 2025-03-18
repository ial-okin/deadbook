from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.models.survivor import SurvivorsTrade
import backend.data.survivors as survivors
import backend.data.inventory as inventories
import backend.data.items as items
import backend.services.trade.trade_utils as utils

def trade_items(db: Session, trade: SurvivorsTrade):
    db_survivor_1 = survivors.get_by_id(db, trade.survivor_1_id)
    db_survivor_2 = survivors.get_by_id(db, trade.survivor_2_id)
    if db_survivor_1 is None:
        raise HTTPException(status_code=404, detail="Survivor 1 cannot be found")
    if db_survivor_2 is None:
        raise HTTPException(status_code=404, detail="Survivor 2 cannot be found")

    
    # Fetch survivor inventories
    survivor1_inventory = inventories.get_by_survivor_id(db, trade.survivor_1_id)
    survivor2_inventory = inventories.get_by_survivor_id(db, trade.survivor_2_id)
    if len(survivor1_inventory) == 0:
        raise HTTPException(status_code=409, detail="Survivor 1 has no items to trade")
    if len(survivor2_inventory) == 0:
        raise HTTPException(status_code=409, detail="Survivor 2 has no items to trade")

    # Check if survivors have enough the items to trade
    survivor1_has_enough_items = utils.has_enough_items(survivor1_inventory, trade.survivor_1_items)
    survivor2_has_enough_items = utils.has_enough_items(survivor2_inventory, trade.survivor_2_items)
    if not survivor1_has_enough_items:
        raise HTTPException(status_code=409, detail="Trade rejected: Survivor 1 lacks sufficient items")
    if not survivor2_has_enough_items:
        raise HTTPException(status_code=409, detail="Trade rejected: Survivor 2 lacks sufficient items")


    trade_items_ids = utils.get_unique_item_ids(trade.survivor_1_items + trade.survivor_2_items)
    db_items = items.get_by_ids(db, trade_items_ids)


    # Check if the trade is fair by comparing the total points of each trade
    survivor1_trade_points = utils.calculate_trade_points(trade.survivor_1_items, db_items)
    survivor2_trade_points = utils.calculate_trade_points(trade.survivor_2_items, db_items)
    if survivor1_trade_points != survivor2_trade_points:
        raise HTTPException(status_code=400, detail="Trade rejected: Unequal item point values")

    # Check if trading the same items
    if utils.check_inventory_equality(trade.survivor_1_items, trade.survivor_2_items):
        raise HTTPException(status_code=400, detail="Trade rejected: Same items")

    try:
        # Update the inventories with the new items
        inventories.remove_from_inventory(db, trade.survivor_1_id, trade.survivor_1_items)
        inventories.add_to_inventory(db, trade.survivor_1_id, trade.survivor_2_items)

        inventories.remove_from_inventory(db, trade.survivor_2_id, trade.survivor_2_items)
        inventories.add_to_inventory(db, trade.survivor_2_id, trade.survivor_1_items)

        # Commit transaction
        db.commit()

        return True
    except Exception as e:
        db.rollback()  # Rollback if anything fails
        raise e  # Re-raise the exception for handling
