from sqlalchemy.orm import Session
from backend.db.schema import Item

# Get items
def get(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: Item):
    db_item = db.add(item)
    db.commit()
    db.refresh(db_item)

    return db_item


# Get by ids
def get_by_ids(db: Session, item_ids: list):
    return db.query(Item).filter(Item.id.in_(item_ids)).all()