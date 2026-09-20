from typing import Dict, Any, List
from backend.app.models import TimelineEvent

class TimelineEngine:
    """
    Reconstructs the patient's chronological medical journey across multiple encounters,
    uploaded prescriptions, diagnostic lab reports, and current intake statements.
    """

    def generate_demo_timeline(self, patient_id: str) -> List[Dict[str, Any]]:
        return [
            {
                "patient_id": patient_id,
                "event_date": "2024 (2 Years Ago)",
                "event_title": "Type 2 Diabetes Mellitus Documented",
                "event_description": "Initial diagnosis of T2DM at Apollo Clinic. Fasting Blood Glucose 162 mg/dL. Metformin 500mg initiated.",
                "source_type": "prior_record",
                "status": "DOCUMENTED",
                "confidence": 0.98,
                "sort_order": 1
            },
            {
                "patient_id": patient_id,
                "event_date": "2025 (Last Year)",
                "event_title": "Hypertension & Daily Aspirin Started",
                "event_description": "Elevated BP (148/94 mmHg) recorded. Started on Amlodipine 5mg OD and Ecosprin (Aspirin) 75mg OD.",
                "source_type": "prior_record",
                "status": "DOCUMENTED",
                "confidence": 0.96,
                "sort_order": 2
            },
            {
                "patient_id": patient_id,
                "event_date": "14-Aug-2026",
                "event_title": "Routine Cardiology OPD Prescription",
                "event_description": "Prescription uploaded. Active meds: Metformin 500mg, Ecosprin 75mg, Amlodipine 5mg. Documented Penicillin allergy noted.",
                "source_type": "prescription",
                "status": "DOCUMENTED",
                "confidence": 0.99,
                "sort_order": 3
            },
            {
                "patient_id": patient_id,
                "event_date": "20-Jul-2026 (~2 Months Ago)",
                "event_title": "Patient Discontinued Aspirin (Unsupervised)",
                "event_description": "Patient self-reported stopping daily aspirin due to mild epigastric acidity without consulting physician.",
                "source_type": "voice_intake",
                "status": "CONFLICTING",
                "confidence": 0.94,
                "sort_order": 4
            },
            {
                "patient_id": patient_id,
                "event_date": "18-Sep-2026 (3 Days Ago)",
                "event_title": "Onset of Central Chest Pain & Dyspnea",
                "event_description": "Substernal chest pressure on mild exertion, radiating occasionally, accompanied by intermittent shortness of breath.",
                "source_type": "voice_intake",
                "status": "CONFIRMED",
                "confidence": 0.95,
                "sort_order": 5
            },
            {
                "patient_id": patient_id,
                "event_date": "Today (Consultation)",
                "event_title": "Smart Case-Taking & Triage Completed",
                "event_description": "Evidence-linked intake synthesized. 12 questions avoided from prior records. Red-flag cluster active for doctor verification.",
                "source_type": "doctor_note",
                "status": "CONFIRMED",
                "confidence": 1.0,
                "sort_order": 6
            }
        ]

timeline_engine = TimelineEngine()
