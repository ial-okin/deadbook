from backend.db.schema import Item
from backend.db.database import SessionLocal

def seed_items():
    """Inserts default items if the table is empty."""
    db = SessionLocal()  # Create a new session

    try:
        # Default items to insert
        default_items = [
            Item(name="Water", points=4),
            Item(name="Food", points=3),
            Item(name="Medication", points=2),
            Item(name="Ammunition", points=1)
        ]

        # Check if the table is empty (optional)
        if not db.query(Item).first():
            db.add_all(default_items)
            db.commit()

    finally:
        db.close()  # Ensure session is closed after execution