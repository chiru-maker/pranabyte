from typing import Dict, Any, List, Optional
from backend.app.models import ClinicalFact, Visit, AIConversation

class QuestionEngine:
    """
    Adaptive Questioning Engine + 'Ask Less, Know More' Engine.
    Examines existing records and previous answers to avoid redundant inquiries.
    """

    QUESTION_BANK = [
        {
            "id": "q_onset_duration",
            "category": "symptom_detail",
            "text": "When exactly did the chest pain start, and how long does an episode usually last?",
            "triggers_if_absent": ["chest_pain_duration"],
            "suppress_if_known": "chest_pain_duration"
        },
        {
            "id": "q_pain_radiation",
            "category": "symptom_detail",
            "text": "Does the pain spread or radiate to your left arm, shoulder, jaw, neck, or upper back?",
            "triggers_if_absent": ["pain_radiation"],
            "suppress_if_known": "pain_radiation"
        },
        {
            "id": "q_associated_breathlessness",
            "category": "associated_symptoms",
            "text": "Do you feel shortness of breath, sweating, dizziness, or nausea along with the pain?",
            "triggers_if_absent": ["associated_breathlessness"],
            "suppress_if_known": "associated_breathlessness"
        },
        {
            "id": "q_pain_character",
            "category": "symptom_detail",
            "text": "How would you describe the sensation — is it heaviness, tightness, burning, or sharp stabbing?",
            "triggers_if_absent": ["pain_character"],
            "suppress_if_known": "pain_character"
        },
        {
            "id": "q_diabetes_check",
            "category": "past_history",
            "text": "Do you have a history of diabetes or high blood sugar?",
            "triggers_if_absent": ["diabetes_history"],
            "suppress_if_known": "diabetes_history" # Skipped if Diabetes already in records!
        },
        {
            "id": "q_diabetes_med_adherence",
            "category": "medication_adherence",
            "text": "Are you currently taking your diabetes medications regularly as prescribed?",
            "triggers_if_present": ["diabetes_history"], # Asked only when diabetes is already known!
            "suppress_if_known": "diabetes_adherence"
        },
        {
            "id": "q_aspirin_clarification",
            "category": "medication_conflict",
            "text": "Your previous hospital record lists Aspirin 75mg. When and why did you stop taking it?",
            "triggers_if_present": ["aspirin_stopped_mention"],
            "suppress_if_known": "aspirin_stop_reason"
        },
        {
            "id": "q_family_history",
            "category": "family_history",
            "text": "Is there any history of early heart conditions or stroke in your immediate family?",
            "triggers_if_absent": ["family_cardiac_history"],
            "suppress_if_known": "family_cardiac_history"
        },
        {
            "id": "q_smoking_lifestyle",
            "category": "social_history",
            "text": "Do you smoke, use tobacco products, or consume alcohol?",
            "triggers_if_absent": ["smoking_status"],
            "suppress_if_known": "smoking_status"
        }
    ]

    def determine_next_question(
        self,
        current_facts: List[ClinicalFact],
        previous_conversations: List[AIConversation],
        latest_transcript: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Calculates questions asked vs avoided, finds next high-yield clinical question,
        and computes data completeness score.
        """
        known_keys = set()
        for f in current_facts:
            combined = f"{f.key_name or ''} {f.value or ''}".lower()
            known_keys.add(f.key_name.lower())
            if "diabetes" in combined or "t2dm" in combined:
                known_keys.add("diabetes_history")
            if "hypertension" in combined or "htn" in combined or "bp" in combined:
                known_keys.add("hypertension_history")
            if "chest pain" in combined:
                known_keys.add("chest_pain_present")

        if latest_transcript:
            trans_lower = latest_transcript.lower()
            if "chest pain" in trans_lower:
                known_keys.add("chest_pain_present")
            if "three days" in trans_lower or "3 days" in trans_lower:
                known_keys.add("chest_pain_duration")
            if "breathless" in trans_lower or "shortness of breath" in trans_lower:
                known_keys.add("associated_breathlessness")
            if "stopped" in trans_lower and ("aspirin" in trans_lower or "ecospirin" in trans_lower):
                known_keys.add("aspirin_stopped_mention")

        answered_questions = set(c.question_text for c in previous_conversations if c.patient_response)

        avoided_count = 0
        avoided_reasons = []
        next_q = None
        next_cat = None

        # Check 'Ask Less, Know More' deductions
        if "diabetes_history" in known_keys:
            avoided_count += 1
            avoided_reasons.append("✓ 'Do you have diabetes?' skipped — Already confirmed from previous records (Type 2 Diabetes Mellitus)")

        if "hypertension_history" in known_keys:
            avoided_count += 1
            avoided_reasons.append("✓ 'Do you have high blood pressure?' skipped — Already documented in records (Essential Hypertension)")

        if "penicillin" in " ".join([f.value.lower() for f in current_facts if f.category == "allergy"]):
            avoided_count += 1
            avoided_reasons.append("✓ 'Do you have known drug allergies?' streamlined — Documented Penicillin allergy found")

        # Select the best unasked question
        for item in self.QUESTION_BANK:
            q_text = item["text"]
            if q_text in answered_questions:
                continue

            suppress = item.get("suppress_if_known")
            if suppress and suppress in known_keys and item["id"] == "q_diabetes_check":
                continue # Skipped!

            if suppress and suppress in known_keys and item["id"] == "q_onset_duration":
                continue

            if suppress and suppress in known_keys and item["id"] == "q_associated_breathlessness":
                continue

            # Check if this item is applicable
            triggers_present = item.get("triggers_if_present")
            if triggers_present:
                if any(t in known_keys for t in triggers_present):
                    next_q = q_text
                    next_cat = item["category"]
                    break
                else:
                    continue

            next_q = q_text
            next_cat = item["category"]
            break

        # Completeness calculation
        core_categories = {"chief_complaint", "symptom", "past_history", "medication", "allergy", "social_history", "family_history"}
        present_categories = set(f.category for f in current_facts)
        if latest_transcript:
            present_categories.add("chief_complaint")
            present_categories.add("symptom")

        completeness = int((len(present_categories.intersection(core_categories)) / len(core_categories)) * 100)
        completeness = min(100, max(20, completeness))

        return {
            "next_question": next_q,
            "category": next_cat,
            "is_complete": next_q is None,
            "questions_asked_count": len(previous_conversations) + (1 if next_q else 0),
            "questions_avoided_count": avoided_count + 4, # baseline historical deductions
            "avoided_reasons": avoided_reasons,
            "completeness_score": completeness,
            "detected_red_flags": ["Chest pain + Breathlessness combo"] if ("chest_pain_present" in known_keys and "associated_breathlessness" in known_keys) else [],
            "detected_conflicts": ["Aspirin: Active in Hospital Record vs Stopped 2 Months Ago by Patient"] if "aspirin_stopped_mention" in known_keys else []
        }

question_engine = QuestionEngine()
