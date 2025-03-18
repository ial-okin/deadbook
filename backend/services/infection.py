# Report a survivor as infected 
from fastapi import HTTPException
from pytest import Session
from backend.models.survivor import SurvivorInfectionReport
import backend.data.infection as infection_data
import backend.data.survivors as survivors_data
from backend.db.schema import InfectionReport
from backend.core.config import INFECTION_THRESHOLD

def create_infection_report(db: Session, report: SurvivorInfectionReport):
    existing_report = infection_data.check_if_exists(db, report)
    if existing_report:
        raise HTTPException(status_code=409, detail="Report already exists")


    # Create the infection report
    db_report = InfectionReport(
        reporter_id=report.reporter_id,
        reported_id=report.reported_id
    )
    infection_data.create(db, db_report)

    # Get the count of reports for the reported survivor
    report_count = infection_data.get_report_count_by_survivor_id(db, report.reported_id)

    if report_count == INFECTION_THRESHOLD:
        survivors_data.mark_as_infected(db, report.reported_id)

    return report_count