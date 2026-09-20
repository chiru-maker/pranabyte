from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import SessionLocal
from backend.app.models import Patient, Visit

client = TestClient(app)

def test_doctor_copilot_query():
    db = SessionLocal()
    patient = db.query(Patient).first()
    db.close()
    assert patient is not None

    response = client.post("/api/v1/doctor/copilot", json={
        "patient_id": patient.id,
        "query": "What medications is this patient taking?"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "citations" in data
    assert len(data["citations"]) > 0

def test_doctor_brief():
    db = SessionLocal()
    patient = db.query(Patient).first()
    db.close()
    assert patient is not None

    response = client.get(f"/api/v1/doctor/brief/{patient.id}")
    assert response.status_code == 200
    data = response.json()
    assert "headline" in data
    assert "chief_complaint" in data
    assert "red_flags" in data
    assert "recommended_actions" in data

def test_visit_changes_delta():
    db = SessionLocal()
    patient = db.query(Patient).first()
    db.close()
    assert patient is not None

    response = client.get(f"/api/v1/doctor/changes/{patient.id}")
    assert response.status_code == 200
    data = response.json()
    assert "changes_summary" in data
    assert len(data["changes_summary"]) > 0

def test_case_sheet_html_export():
    db = SessionLocal()
    patient = db.query(Patient).first()
    db.close()
    assert patient is not None

    response = client.get(f"/api/v1/doctor/case-sheet-html/{patient.id}")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "PATIENT STORY ENGINE" in response.text
    assert patient.name in response.text

def test_patient_confirmation():
    db = SessionLocal()
    visit = db.query(Visit).first()
    db.close()
    assert visit is not None

    response = client.post(f"/api/v1/doctor/patient-confirm/{visit.id}", json={})
    assert response.status_code == 200
    data = response.json()
    assert data.get("patient_confirmed") is True
