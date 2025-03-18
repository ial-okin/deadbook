import uuid
from sqlalchemy.orm import Session
from backend.db.schema import InfectionReport

def create(db: Session, report: InfectionReport): 
    db.add(report)
    db.commit()
    db.refresh(report)


# Get by survivor id
def get_by_survivor_id(db: Session, survivor_id: uuid.UUID):
    return db.query(InfectionReport).filter(InfectionReport.reported_id == survivor_id).all()

def check_if_exists(db: Session, report: InfectionReport):
    existing_report = db.query(InfectionReport).filter(
        InfectionReport.reported_id == report.reported_id,
        InfectionReport.reporter_id == report.reporter_id
    ).first()

    return existing_report


# Function to get the count of reports by survivor ID
def get_report_count_by_survivor_id(db: Session, survivor_id: uuid.UUID):
    report_count = db.query(InfectionReport).filter(InfectionReport.reported_id == survivor_id).count()
    return report_count

def is_infected_by_report_count(db: Session, survivor_id: uuid.UUID, threshold: int):
    # Get the count of reports for the given survivor_id
    report_count = get_report_count_by_survivor_id(db, survivor_id)
    
    # Compare the report count with the threshold
    if report_count >= threshold:
        return True  # Survivor is considered infected
    return False  # Survivor is not infected