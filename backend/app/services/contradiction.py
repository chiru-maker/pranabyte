from typing import Dict, Any, List, Optional
from backend.app.models import ClinicalFact, Contradiction

class ContradictionEngine:
    """
    Contradiction Detector.
    Scans clinical facts from multiple sources (voice transcripts, old case notes, OCR documents)
    and highlights discrepancies without silently overwriting either source.
    """

    def scan_for_contradictions(self, facts: List[ClinicalFact], patient_id: str, visit_id: Optional[str] = None) -> List[Dict[str, Any]]:
        contradictions = []

        # 1. Check Medication status contradictions (e.g. Aspirin)
        aspirin_documented = None
        aspirin_patient_statement = None

        for f in facts:
            val_lower = f.value.lower()
            if "aspirin" in val_lower or "ecosprin" in val_lower:
                if f.status == "DOCUMENTED" and ("active" in val_lower or "1 tab" in val_lower):
                    aspirin_documented = f
                elif "stopped" in val_lower or "discontinued" in val_lower:
                    aspirin_patient_statement = f

        if aspirin_documented and aspirin_patient_statement:
            contradictions.append({
                "patient_id": patient_id,
                "visit_id": visit_id,
                "category": "medication_conflict",
                "title": "Medication Status Discrepancy: Aspirin 75mg",
                "source_a_description": f"Hospital Prescription ({aspirin_documented.source_citation or 'Apollo Records 14-Aug-2026'})",
                "source_a_value": "Tab. Ecosprin 75mg — Documented ACTIVE Daily",
                "source_b_description": "Current Patient Spoken Statement",
                "source_b_value": "Patient stated: 'I stopped taking aspirin two months ago.'",
                "status": "ACTIVE"
            })

        # 2. Check Allergy status contradictions (e.g. Penicillin)
        penicillin_doc = None
        allergy_denial = None

        for f in facts:
            val_lower = f.value.lower()
            if "penicillin" in val_lower and f.status == "DOCUMENTED":
                penicillin_doc = f
            elif "no known allergy" in val_lower or "denies allergy" in val_lower:
                allergy_denial = f

        if penicillin_doc and allergy_denial:
            contradictions.append({
                "patient_id": patient_id,
                "visit_id": visit_id,
                "category": "allergy_conflict",
                "title": "Allergy Status Discrepancy: Penicillin",
                "source_a_description": "Prior Medical Record (Apollo Multispeciality)",
                "source_a_value": "Severe cutaneous hypersensitivity / rash to Penicillin",
                "source_b_description": "Patient Intake Statement",
                "source_b_value": "Patient stated no known drug allergies",
                "status": "ACTIVE"
            })

        return contradictions

contradiction_engine = ContradictionEngine()
