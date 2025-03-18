from sqlalchemy import UniqueConstraint, Column, Integer, String, Boolean, DECIMAL, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy import func
from backend.db.database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

# Survivors Table
class Survivor(Base):
    __tablename__ = 'survivors'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    latitude = Column(DECIMAL(9, 6), nullable=False)
    longitude = Column(DECIMAL(9, 6), nullable=False)
    is_infected = Column(Boolean, default=False)

    inventory = relationship('Inventory', back_populates='survivor', foreign_keys='Inventory.survivor_id')
    infection_reports = relationship('InfectionReport', back_populates='reported_survivor', foreign_keys='InfectionReport.reported_id')
    reports = relationship('InfectionReport', back_populates='reporter_survivor', foreign_keys='InfectionReport.reporter_id')

# Items Table
class Item(Base):
    __tablename__ = 'items'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)
    points = Column(Integer, nullable=False)

# Inventory Table
class Inventory(Base):
    __tablename__ = 'inventory'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    survivor_id = Column(UUID(as_uuid=True), ForeignKey('survivors.id', ondelete='CASCADE'), nullable=False)
    item_id = Column(UUID(as_uuid=True), ForeignKey('items.id', ondelete='CASCADE'), nullable=False)
    quantity = Column(Integer, nullable=False)

    survivor = relationship('Survivor', back_populates='inventory', foreign_keys=[survivor_id])
    item = relationship('Item', foreign_keys=[item_id])

    __table_args__ = (
        UniqueConstraint('survivor_id', 'item_id', name='_survivor_item_uc'),
    )

# Infection Reports Table
class InfectionReport(Base):
    __tablename__ = 'infection_reports'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reported_id = Column(UUID(as_uuid=True), ForeignKey('survivors.id', ondelete='CASCADE'), nullable=False)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey('survivors.id', ondelete='CASCADE'), nullable=False)
    reported_at = Column(TIMESTAMP, default=func.now())

    reported_survivor = relationship('Survivor', foreign_keys=[reported_id], back_populates='infection_reports')
    reporter_survivor = relationship('Survivor', foreign_keys=[reporter_id], back_populates='reports')

    __table_args__ = (
        UniqueConstraint('reported_id', 'reporter_id', name='_report_unique_uc'),
    )
