from backend.db.database import engine
from backend.db.schema import Base
from backend.db.seed import seed_items

# Create the tables in the database
Base.metadata.create_all(bind=engine)

# Add items to the database
seed_items()