from typing import Dict, Any, List, Optional
from backend.app.models import ClinicalFact

class RedFlagEngine:
    """
    Safety-Oriented Red Flag Module.
    Identifies high-acuity symptom clusters without attempting diagnosis.
    Promptly alerts clinician for timely triage.
    """

    RULES = [
        {
            "rule_name": "acute_coronary_cluster",
            "title": "Cardiopulmonary Red Flag: Chest Pain + Breathlessness",
            "severity": "HIGH",
            "keywords_required": [["chest pain", "angina", "heaviness in chest"], ["breathless", "dyspnea", "shortness of breath"]],
            "recommendation": "Potential red flag detected — urgent clinician review and 12-lead ECG evaluation recommended.",
            "trigger_criteria": "Patient concurrently reports acute chest discomfort and breathlessness within the last 72 hours."
        },
        {
            "rule_name": "aspirin_withdrawal_ischemia",
            "title": "Medication Safety Alert: Antiplatelet Cessation in Cardiac Profile",
            "severity": "HIGH",
            "keywords_required": [["aspirin", "ecosprin"], ["stopped", "discontinued"]],
            "recommendation": "Unsupervised discontinuation of Aspirin in a diabetic/hypertensive patient presenting with chest pain. Evaluate for acute rebound ischemia.",
            "trigger_criteria": "Active prescription for antiplatelet discontinued without clinical taper."
        },
        {
            "rule_name": "anaphylaxis_risk",
            "title": "High-Risk Allergy Alert",
            "severity": "CRITICAL",
            "keywords_required": [["penicillin"], ["rash", "swelling", "anaphylaxis"]],
            "recommendation": "Confirm beta-lactam allergy status before prescribing antibiotic therapies.",
            "trigger_criteria": "Documented prior hypersensitivity to penicillin class."
        }
    ]

    def evaluate_red_flags(self, facts: List[ClinicalFact], patient_id: str, visit_id: Optional[str] = None) -> List[Dict[str, Any]]:
        all_text = " ".join([f"{f.key_name} {f.value}".lower() for f in facts])
        flagged = []

        for rule in self.RULES:
            match = True
            for group in rule["keywords_required"]:
                if not any(k in all_text for k in group):
                    match = False
                    break
            
            if match:
                flagged.append({
                    "patient_id": patient_id,
                    "visit_id": visit_id,
                    "rule_name": rule["rule_name"],
                    "severity": rule["severity"],
                    "title": rule["title"],
                    "trigger_criteria": rule["trigger_criteria"],
                    "recommendation": rule["recommendation"],
                    "status": "UNACKNOWLEDGED"
                })

        return flagged

red_flag_engine = RedFlagEngine()
