import pytest
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import sessionmaker, Session

from backend.db.database import Base, get_db  # Ensure correct import path
from backend.db.schema import Item
from backend.main import app


@pytest.fixture(scope="session")
def db_engine():
    """Creates an in-memory SQLite database for testing."""
    DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine
    engine.dispose()


@pytest.fixture(scope="function")
def db(db_engine) -> Session:
    """Provides a fresh database session for each test and ensures a clean state."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = TestingSessionLocal()

    # ✅ Reset database: Drop and recreate all tables before each test
    Base.metadata.drop_all(bind=db_engine)
    Base.metadata.create_all(bind=db_engine)

    # ✅ Insert default seed data
    default_items = [
        Item(name="Water", points=4),
        Item(name="Food", points=3),
        Item(name="Medication", points=2),
        Item(name="Ammunition", points=1),
    ]
    session.add_all(default_items)
    session.commit()

    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture(scope="function")
def client(db):
    """Provides a FastAPI test client with an overridden database session."""
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
