from datetime import datetime
from pydantic import BaseModel
import uuid

class InfectionReportBase(BaseModel):
    reported_id: uuid.UUID
    reporter_id: uuid.UUID

class InfectionReportCreate(InfectionReportBase):
    pass

class InfectionReportResponse(InfectionReportBase):
    id: uuid.UUID
    reported_at: datetime

class InfectionReportCount(BaseModel):
    count: int