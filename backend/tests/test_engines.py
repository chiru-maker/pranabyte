import pytest
from backend.app.models import ClinicalFact
from backend.app.services.questioning import question_engine
from backend.app.services.contradiction import contradiction_engine
from backend.app.services.red_flags import red_flag_engine
from backend.app.services.ocr_service import ocr_service
from backend.app.services.fhir import fhir_service

def test_ask_less_know_more_skips_diabetes_when_known():
    """Verify that diabetes question is suppressed if diabetes is already documented."""
    facts = [
        ClinicalFact(
            patient_id="p1",
            category="past_history",
            key_name="Type 2 Diabetes Mellitus",
            value="Diagnosed 2024",
            status="DOCUMENTED"
        )
    ]
    res = question_engine.determine_next_question(facts, [], "I have had chest pain for 3 days")
    assert res["questions_avoided_count"] > 0
    assert any("diabetes" in reason.lower() for reason in res["avoided_reasons"])
    # Next question should NOT ask if patient has diabetes
    assert res["next_question"] != "Do you have a history of diabetes or high blood sugar?"

def test_contradiction_detection():
    """Verify that aspirin active in prescription vs stopped in voice is flagged."""
    facts = [
        ClinicalFact(
            patient_id="p1",
            category="medication",
            key_name="Ecosprin 75mg",
            value="Tab. Ecosprin 75mg active daily",
            status="DOCUMENTED",
            source_citation="Apollo Hospital Rx"
        ),
        ClinicalFact(
            patient_id="p1",
            category="medication",
            key_name="Aspirin",
            value="Patient stopped taking aspirin two months ago",
            status="CONFLICTING",
            source_citation="Voice intake"
        )
    ]
    conflicts = contradiction_engine.scan_for_contradictions(facts, "p1")
    assert len(conflicts) > 0
    assert "Aspirin" in conflicts[0]["title"]
    assert conflicts[0]["status"] == "ACTIVE"

def test_red_flag_detection():
    """Verify cardiopulmonary cluster triggers red-flag alert."""
    facts = [
        ClinicalFact(
            patient_id="p1",
            category="symptom",
            key_name="Chest Pain",
            value="Severe chest pain for 3 days",
            status="CONFIRMED"
        ),
        ClinicalFact(
            patient_id="p1",
            category="symptom",
            key_name="Breathlessness",
            value="Shortness of breath on exertion",
            status="CONFIRMED"
        )
    ]
    red_flags = red_flag_engine.evaluate_red_flags(facts, "p1")
    assert len(red_flags) > 0
    assert red_flags[0]["severity"] == "HIGH"
    assert "Chest Pain + Breathlessness" in red_flags[0]["title"]

def test_ocr_extraction():
    """Verify mock OCR parsing extracts medications, allergies, and diagnoses."""
    sample_text = "Patient: Demo Patient | Diagnosis: Type 2 Diabetes | Rx: Metformin 500mg, Ecosprin 75mg | Allergy: Penicillin"
    entities = ocr_service._extract_clinical_entities(sample_text)
    types = [e["entity_type"] for e in entities]
    assert "medication" in types
    assert "condition" in types
    assert "allergy" in types
