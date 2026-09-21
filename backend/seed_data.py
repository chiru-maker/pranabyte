import random
from datetime import datetime, timedelta
from backend.app.database import SessionLocal, engine, Base
from backend.app.models import (
    User, Patient, Consent, Visit, ClinicalFact, ClinicalSource, Document, DocumentExtraction,
    Contradiction, RedFlag, TimelineEvent, AuditLog, VitalSign
)
from backend.app.auth import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    existing_patient = db.query(Patient).filter(Patient.name == "Demo Patient").first()
    if existing_patient:
        print("Database already seeded with demo patient Demo Patient.")
        db.close()
        return

    print("Seeding demo healthcare data...")

    # 1. Create Users (Doctor, Staff, Patient)
    doctor = User(
        email="doctor@hospital.in",
        hashed_password=get_password_hash("doctor123"),
        full_name="Dr. Priya Sharma (Cardiology)",
        role="doctor"
    )
    staff = User(
        email="staff@hospital.in",
        hashed_password=get_password_hash("staff123"),
        full_name="Sister Ananya Rao (Triage Nurse)",
        role="staff"
    )
    patient_user = User(
        email="demo.patient@example.com",
        hashed_password=get_password_hash("patient123"),
        full_name="Demo Patient",
        role="patient"
    )
    db.add_all([doctor, staff, patient_user])
    db.commit()
    db.refresh(doctor)
    db.refresh(patient_user)

    # 2. Create Demo Patient: Demo Patient
    patient = Patient(
        user_id=patient_user.id,
        patient_id_display="PAT-DEMO-001",
        name="Demo Patient",
        age=58,
        sex="Male",
        phone="+91 90000 00001",
        abha_id="91-0000-1111-2222",
        is_existing=True
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # 3. Create Consent
    consent = Consent(
        patient_id=patient.id,
        consent_version="v1.0.0",
        status="given",
        data_usage_disclosed="Collection of voice transcripts, uploaded prescriptions, lab reports and clinical history for clinical case synthesis.",
        ai_role_disclosed="AI assists structured information extraction and contradiction flagging. Final diagnosis and prescriptions are made solely by the treating clinician."
    )
    db.add(consent)

    # 4. Create Active Visit
    visit = Visit(
        patient_id=patient.id,
        visit_number="VISIT-2026-904",
        chief_complaint="Chest pain for three days, radiating occasionally, with intermittent breathlessness.",
        status="waiting_doctor",
        completeness_score=85,
        questions_asked_count=3,
        questions_avoided_count=12,
        patient_confirmed=True,
        patient_confirmed_at=datetime.utcnow(),
        ai_summary_draft="""### PATIENT CASE SUMMARY DRAFT
*NOTICE: AI-generated clinical draft — requires clinician verification. Not a diagnosis.*

**PATIENT:** Demo Patient | **AGE/SEX:** 58Y Male | **ID:** PAT-DEMO-001 | **ABHA:** 91-0000-1111-2222

---

**1. CHIEF COMPLAINT:**
Central retrosternal chest pain for 3 days, accompanied by intermittent breathlessness on mild exertion.

**2. CURRENT HISTORY & SYMPTOMS:**
- Chest Pain: Moderate-Severe, onset 3 days ago, intermittent pressure.
- Dyspnea / Breathlessness: Present on exertion.

**3. PAST MEDICAL HISTORY:**
- Type 2 Diabetes Mellitus [DOCUMENTED - Apollo Hospital 2024]
- Essential Hypertension [DOCUMENTED - Apollo Hospital 2025]

**4. MEDICATIONS & ADHERENCE:**
- Tab. Metformin 500mg BD [DOCUMENTED - Active]
- Tab. Amlodipine 5mg OD [DOCUMENTED - Active]
- Tab. Ecosprin 75mg OD [🚨 CONFLICT: Documented Active vs Patient reports stopped 2 months ago]

**5. ALLERGIES:**
- Penicillin [DOCUMENTED - Severe hypersensitivity / cutaneous reaction]

**6. SAFETY RED FLAGS & DISCREPANCIES:**
- 🚨 Potential Red Flag: Acute chest pain + breathlessness cluster. Immediate 12-lead ECG recommended.
- 🚨 Medication Conflict: Unsupervised Aspirin cessation in diabetic patient with chest discomfort.
"""
    )
    db.add(visit)
    db.commit()
    db.refresh(visit)

    # 4b. Create Triage Vitals
    vitals = VitalSign(
        visit_id=visit.id,
        bp_systolic=142,
        bp_diastolic=90,
        heart_rate=78,
        spo2=98,
        temperature=98.6,
        respiratory_rate=18,
        recorded_by="Sister Ananya Rao (Nurse)"
    )
    db.add(vitals)

    # 5. Create Sources
    source_rx = ClinicalSource(
        source_type="uploaded_document",
        title="Apollo Hospitals Prescription (14-Aug-2026)",
        raw_content="Apollo Multispeciality. Rx: Metformin 500mg BD, Ecosprin 75mg OD [ACTIVE], Amlodipine 5mg OD. Allergy: Penicillin. BP: 142/90.",
        confidence_score=0.98
    )
    source_voice = ClinicalSource(
        source_type="voice_statement",
        title="Patient Voice Intake Recording (21-Sep-2026)",
        raw_content="I stopped taking aspirin two months ago and I've been having chest pain for three days. Sometimes I feel breathless.",
        confidence_score=0.96
    )
    db.add_all([source_rx, source_voice])
    db.commit()
    db.refresh(source_rx)
    db.refresh(source_voice)

    # 6. Create Clinical Facts with 4 Information States
    facts = [
        # 🟢 CONFIRMED: Spoken by patient
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="chief_complaint",
            key_name="Chief Complaint",
            value="Central chest pain for 3 days with breathlessness",
            status="CONFIRMED",
            source_id=source_voice.id,
            source_citation="Voice Transcript: 'I've been having chest pain for three days. Sometimes I feel breathless.'",
            confidence=0.96
        ),
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="symptom",
            key_name="Chest Pain",
            value="Moderate to severe substernal pressure, intermittent",
            status="CONFIRMED",
            source_id=source_voice.id,
            source_citation="Voice Transcript: 'I've been having chest pain for three days'",
            confidence=0.95
        ),
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="symptom",
            key_name="Breathlessness",
            value="Intermittent dyspnea on mild physical exertion",
            status="CONFIRMED",
            source_id=source_voice.id,
            source_citation="Voice Transcript: 'Sometimes I feel breathless'",
            confidence=0.94
        ),
        # 🔵 DOCUMENTED: From previous records & prescription
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="past_history",
            key_name="Type 2 Diabetes Mellitus",
            value="Diagnosed 2024, on oral hypoglycemics (Metformin)",
            status="DOCUMENTED",
            source_id=source_rx.id,
            source_citation="Apollo Hospital Prescription (14-Aug-2026)",
            confidence=0.99
        ),
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="past_history",
            key_name="Essential Hypertension",
            value="Stage 1 Hypertension, on Amlodipine 5mg",
            status="DOCUMENTED",
            source_id=source_rx.id,
            source_citation="Apollo Hospital Prescription (14-Aug-2026)",
            confidence=0.97
        ),
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="allergy",
            key_name="Penicillin Allergy",
            value="Severe cutaneous hypersensitivity / rash",
            status="DOCUMENTED",
            source_id=source_rx.id,
            source_citation="Prior Medical Record / Rx (14-Aug-2026)",
            confidence=0.96
        ),
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="medication",
            key_name="Metformin 500mg",
            value="1 tab twice daily after food [Active]",
            status="DOCUMENTED",
            source_id=source_rx.id,
            source_citation="Apollo Hospital Prescription (14-Aug-2026)",
            confidence=0.98
        ),
        # 🟡 UNCERTAIN: Blurry OCR entry
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="medication",
            key_name="Amlodipine Dosage",
            value="Tab. Amlodipine 5mg? (Morning) — Low OCR clarity",
            status="UNCERTAIN",
            source_id=source_rx.id,
            source_citation="OCR scan region with 72% confidence",
            confidence=0.72
        ),
        # 🔴 CONFLICTING: Aspirin record vs patient statement
        ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="medication",
            key_name="Aspirin 75mg Active Status",
            value="Prescription lists Ecosprin 75mg ACTIVE vs Patient reports STOPPED 2 months ago",
            status="CONFLICTING",
            source_id=source_voice.id,
            source_citation="Discrepancy between Apollo Rx 14-Aug-2026 and Spoken Intake 21-Sep-2026",
            confidence=0.94
        )
    ]
    db.add_all(facts)

    # 7. Create Contradiction Record
    contradiction = Contradiction(
        patient_id=patient.id,
        visit_id=visit.id,
        category="medication_conflict",
        title="Medication Discrepancy: Aspirin (Ecosprin) 75mg",
        source_a_description="Apollo Hospital Prescription (14-Aug-2026)",
        source_a_value="Tab. Ecosprin 75mg OD — Active Daily",
        source_b_description="Patient Spoken Intake (21-Sep-2026)",
        source_b_value="Patient stated: 'I stopped taking aspirin two months ago.'",
        status="ACTIVE"
    )
    db.add(contradiction)

    # 8. Create Red Flag
    red_flag = RedFlag(
        patient_id=patient.id,
        visit_id=visit.id,
        rule_name="acute_coronary_cluster",
        severity="HIGH",
        title="Cardiopulmonary Red Flag: Chest Pain + Breathlessness",
        trigger_criteria="Substernal chest discomfort for 3 days with concurrent dyspnea in a known diabetic/hypertensive patient with recent aspirin discontinuation.",
        recommendation="Potential red flag detected — urgent clinician review and 12-lead ECG evaluation recommended.",
        status="UNACKNOWLEDGED"
    )
    db.add(red_flag)

    # 9. Create Timeline Events
    timeline_events = [
        TimelineEvent(
            patient_id=patient.id,
            event_date="2024",
            event_title="Type 2 Diabetes Documented",
            event_description="Diagnosed at Apollo Clinic. Started on Metformin 500mg.",
            source_type="prior_record",
            status="DOCUMENTED",
            confidence=0.98,
            sort_order=1
        ),
        TimelineEvent(
            patient_id=patient.id,
            event_date="2025",
            event_title="Hypertension & Daily Aspirin Started",
            event_description="BP 148/94. Initiated on Amlodipine 5mg and Aspirin 75mg.",
            source_type="prior_record",
            status="DOCUMENTED",
            confidence=0.96,
            sort_order=2
        ),
        TimelineEvent(
            patient_id=patient.id,
            event_date="14-Aug-2026",
            event_title="Prescription Uploaded",
            event_description="Apollo Cardiology OPD record. Metformin, Aspirin, Amlodipine active.",
            source_type="prescription",
            status="DOCUMENTED",
            confidence=0.99,
            sort_order=3
        ),
        TimelineEvent(
            patient_id=patient.id,
            event_date="July 2026 (~2 Months Ago)",
            event_title="Patient Stopped Aspirin",
            event_description="Self-reported stoppage due to mild gastric irritation without physician consult.",
            source_type="voice_intake",
            status="CONFLICTING",
            confidence=0.94,
            sort_order=4
        ),
        TimelineEvent(
            patient_id=patient.id,
            event_date="18-Sep-2026 (3 Days Ago)",
            event_title="Chest Pain & Breathlessness Onset",
            event_description="Substernal chest pain and shortness of breath on exertion.",
            source_type="voice_intake",
            status="CONFIRMED",
            confidence=0.95,
            sort_order=5
        ),
        TimelineEvent(
            patient_id=patient.id,
            event_date="Today",
            event_title="Current Consultation & Smart Intake",
            event_description="Voice case taking completed. 12 questions avoided using known history. Red flags active.",
            source_type="doctor_note",
            status="CONFIRMED",
            confidence=1.0,
            sort_order=6
        )
    ]
    db.add_all(timeline_events)

    # 10. Create Audit Logs
    audit_logs = [
        AuditLog(
            patient_id=patient.id,
            visit_id=visit.id,
            actor_name="Sister Ananya Rao (Staff)",
            actor_role="staff",
            action="PATIENT_REGISTRATION",
            details="Registered patient Demo Patient (PAT-DEMO-001) with ABHA 91-0000-1111-2222"
        ),
        AuditLog(
            patient_id=patient.id,
            visit_id=visit.id,
            actor_name="Demo Patient",
            actor_role="patient",
            action="CONSENT_GIVEN",
            details="Accepted Consent v1.0.0 for structured AI intake"
        ),
        AuditLog(
            patient_id=patient.id,
            visit_id=visit.id,
            actor_name="AI Voice Engine",
            actor_role="ai_system",
            action="VOICE_INTAKE_PROCESSED",
            details="Voice transcript parsed: Chest pain (3 days), dyspnea, aspirin cessation noted."
        ),
        AuditLog(
            patient_id=patient.id,
            visit_id=visit.id,
            actor_name="Ask-Less Engine",
            actor_role="ai_system",
            action="QUESTIONS_SUPPRESSED",
            details="12 redundant inquiries skipped (Diabetes & Hypertension history reused)."
        ),
        AuditLog(
            patient_id=patient.id,
            visit_id=visit.id,
            actor_name="Contradiction Engine",
            actor_role="ai_system",
            action="CONTRADICTION_DETECTED",
            details="Flagged Aspirin status discrepancy between prescription and spoken intake."
        ),
        AuditLog(
            patient_id=patient.id,
            visit_id=visit.id,
            actor_name="Safety Red-Flag Engine",
            actor_role="ai_system",
            action="RED_FLAG_TRIGGERED",
            details="Cardiopulmonary cluster alert: Chest pain + Breathlessness."
        )
    ]
    db.add_all(audit_logs)

    db.commit()
    db.close()
    print("Demo data seeded successfully for Demo Patient (PAT-DEMO-001)!")

if __name__ == "__main__":
    seed_database()
