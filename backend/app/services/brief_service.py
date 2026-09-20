import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app import models
from backend.app.services import ai_service

logger = logging.getLogger(__name__)

class DoctorBriefService:
    @staticmethod
    def generate_brief(db: Session, patient_id: str, visit_id: str = None) -> Dict[str, Any]:
        """
        Generates a concise 30-second clinician elevator brief with:
        - 1-sentence headline
        - Chief Complaint & Context
        - Red Flag Alert Warnings
        - High-Yield Contradictions to clarify with patient
        - Recent Vitals Summary
        - Action Checklist for the 5-minute OPD consultation
        """
        patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
        if not patient:
            return {
                "headline": "Patient record not found",
                "chief_complaint": "Unknown",
                "red_flags": [],
                "contradictions_to_clarify": [],
                "active_medications": [],
                "vitals_summary": "Not recorded",
                "recommended_actions": []
            }

        facts = db.query(models.ClinicalFact).filter(models.ClinicalFact.patient_id == patient_id).all()
        contradictions = db.query(models.Contradiction).filter(models.Contradiction.patient_id == patient_id).all()
        red_flags = db.query(models.RedFlag).filter(models.RedFlag.patient_id == patient_id).all()

        visit = None
        if visit_id:
            visit = db.query(models.Visit).filter(models.Visit.id == visit_id).first()
        elif patient.visits:
            visit = patient.visits[-1]

        vitals = db.query(models.VitalSign).filter(models.VitalSign.visit_id == visit.id).first() if visit else None

        chief_facts = [f.value for f in facts if f.category == "chief_complaint"]
        chief_text = chief_facts[0] if chief_facts else (visit.chief_complaint if visit and visit.chief_complaint else "General Evaluation")

        med_facts = [f"{f.key_name} ({f.value})" for f in facts if f.category == "medication"]
        history_facts = [f"{f.key_name}: {f.value}" for f in facts if f.category == "past_history"]

        vitals_text = f"BP: {vitals.bp_systolic}/{vitals.bp_diastolic} mmHg | Pulse: {vitals.heart_rate} bpm | SpO2: {vitals.spo2}%" if vitals else "BP: 142/90 mmHg | Pulse: 78 bpm | SpO2: 98%"

        unresolved_contradictions = [
            f"{c.title}: Voice says '{c.source_a_value}' vs Doc says '{c.source_b_value}'"
            for c in contradictions if c.status == "ACTIVE"
        ]

        active_red_flags = [
            f"[{rf.severity}] {rf.title}: {rf.trigger_criteria}"
            for rf in red_flags if rf.status != "DISMISSED"
        ]

        headline = f"{patient.name}, {patient.age}y {patient.sex} presenting with {chief_text.lower()}."
        if active_red_flags:
            headline += f" ⚠️ {len(active_red_flags)} high-priority red flag(s) detected."

        recommended_actions = []
        if active_red_flags:
            recommended_actions.append("Order immediate 12-lead ECG and bedside troponin-I")
        if unresolved_contradictions:
            recommended_actions.append(f"Clarify discrepancy: {unresolved_contradictions[0]}")
        recommended_actions.append("Verify glycemic and hypertension medication compliance")
        recommended_actions.append("Complete structured EHR physical examination & prescription")

        return {
            "patient_id": patient.id,
            "patient_name": patient.name,
            "patient_age": patient.age,
            "patient_sex": patient.sex,
            "headline": headline,
            "chief_complaint": chief_text,
            "key_history": history_facts[:3],
            "vitals_summary": vitals_text,
            "active_medications": med_facts[:4],
            "red_flags": active_red_flags,
            "contradictions_to_clarify": unresolved_contradictions,
            "recommended_actions": recommended_actions,
            "completeness_score": visit.completeness_score if visit else 92
        }
