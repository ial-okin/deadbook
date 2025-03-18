import uuid

from sqlalchemy.orm import Session

from backend.data.survivors import register as register_survivor
from backend.models.survivor import SurvivorResponse
from backend.data.infection import get_report_count_by_survivor_id
import backend.data.survivors as survivors_data
from backend.tests.helpers import get_survivor_mock

def test_should_report_infection(client, db):
    reported_survivor = seed_survivor(db)
    survivor_2 = seed_survivor(db)

    response = client.post(f"/api/survivors/{str(reported_survivor.id)}/report-infection", json={
        "reporter_id": str(survivor_2.id),
    })

    assert response.status_code == 200

    report_count = get_report_count_by_survivor_id(db, reported_survivor.id)
    assert report_count == 1

    reported_survivor = survivors_data.get_by_id(db, reported_survivor.id) 
    assert reported_survivor.is_infected == False

def test_should_not_allow_to_report_survivor_by_the_same_reporter_more_than_once(client, db):
    reported_survivor = seed_survivor(db)
    survivor_2 = seed_survivor(db)

    def make_report():
        response = client.post(f"/api/survivors/{str(reported_survivor.id)}/report-infection", json={
            "reporter_id": str(survivor_2.id),
        })

        return response

    response1 = make_report()
    assert response1.status_code == 200

    response2 = make_report()
    assert response2.status_code == 409

    report_count = get_report_count_by_survivor_id(db, reported_survivor.id)

    assert report_count == 1

def test_should_mark_survivor_as_infected_after_certain_amount_of_reports(client, db):
    reported_survivor = seed_survivor(db)
    survivor_2 = seed_survivor(db)
    survivor_3 = seed_survivor(db)
    survivor_4 = seed_survivor(db)

    def make_report_by(reporter_id: uuid.UUID):
        response = client.post(f"/api/survivors/{str(reported_survivor.id)}/report-infection", json={
            "reporter_id": str(reporter_id),
        })

        return response
    
    reported_survivor = survivors_data.get_by_id(db, reported_survivor.id) 
    assert reported_survivor.is_infected == False

    make_report_by(survivor_2.id)
    make_report_by(survivor_3.id)
    response = make_report_by(survivor_4.id)

    data = response.json()
    assert data["count"] == 3

    report_count = get_report_count_by_survivor_id(db, reported_survivor.id)
    assert report_count == 3

    # Survivor is not found because he is now infected
    reported_survivor = survivors_data.get_by_id(db, reported_survivor.id) 
    assert reported_survivor == None

def test_should_mark_survivor_as_infected_and_not_allow_to_report_more(client, db):
    reported_survivor = seed_survivor(db)
    survivor_2 = seed_survivor(db)
    survivor_3 = seed_survivor(db)
    survivor_4 = seed_survivor(db)
    survivor_5 = seed_survivor(db)

    def make_report_by(reporter_id: uuid.UUID):
        response = client.post(f"/api/survivors/{str(reported_survivor.id)}/report-infection", json={
            "reporter_id": str(reporter_id),
        })

        return response
    
    reported_survivor = survivors_data.get_by_id(db, reported_survivor.id) 
    assert reported_survivor.is_infected == False

    make_report_by(survivor_2.id)
    make_report_by(survivor_3.id)
    make_report_by(survivor_4.id)
    response = make_report_by(survivor_5.id)

    assert response.status_code == 404

    report_count = get_report_count_by_survivor_id(db, reported_survivor.id)
    assert report_count == 3

    # Survivor is not found because he is now infected
    reported_survivor = survivors_data.get_by_id(db, reported_survivor.id) 
    assert reported_survivor == None


# ==================================================================================================
# Helper functions

def seed_survivor(
        db: Session,
    ) -> None:
    survivor = get_survivor_mock()
    survivor.inventory = []
    survivor_db = register_survivor(db, survivor)

    db.commit()

    return SurvivorResponse.model_validate(survivor_db)
