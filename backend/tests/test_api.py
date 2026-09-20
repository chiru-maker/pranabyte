import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_and_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["system"] == "Patient Story Engine"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

def test_create_patient_and_consent():
    patient_data = {
        "name": "Arjun Patel",
        "age": 45,
        "sex": "Male",
        "phone": "+91 91234 56789",
        "abha_id": "91-1122-3344-5566",
        "is_existing": False
    }
    res = client.post("/api/v1/patients", json=patient_data)
    assert res.status_code == 200
    p = res.json()
    assert p["name"] == "Arjun Patel"
    patient_id = p["id"]

    consent_data = {
        "consent_version": "v1.0.0",
        "status": "given",
        "data_usage_disclosed": "Clinical case taking",
        "ai_role_disclosed": "Structured synthesis only"
    }
    c_res = client.post(f"/api/v1/patients/{patient_id}/consent", json=consent_data)
    assert c_res.status_code == 200
    assert c_res.json()["status"] == "given"

def test_doctor_dashboard_summary():
    res = client.get("/api/v1/doctor/dashboard-summary")
    assert res.status_code == 200
    data = res.json()
    assert "waiting_patients" in data
    assert "ready_for_doctor" in data
    assert "red_flag_cases" in data
