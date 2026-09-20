from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Visit, Patient, ClinicalFact, ClinicalSource, AIConversation, Contradiction, RedFlag
from backend.app.schemas import (
    VisitResponse, VoiceInputRequest, AdaptiveQuestionResponse, QuestionAnswerRequest
)
from backend.app.services.ai_service import ai_service
from backend.app.services.questioning import question_engine
from backend.app.services.contradiction import contradiction_engine
from backend.app.services.red_flags import red_flag_engine
from backend.app.services.audit import audit_service

router = APIRouter(prefix="/visits", tags=["Visits & Case-Taking"])

@router.get("/by-patient/{patient_id}", response_model=List[VisitResponse])
def get_visits_by_patient(patient_id: str, db: Session = Depends(get_db)):
    return db.query(Visit).filter(Visit.patient_id == patient_id).order_by(Visit.created_at.desc()).all()

@router.get("/{id}", response_model=VisitResponse)
def get_visit(id: str, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    return visit

@router.post("/{id}/voice", response_model=AdaptiveQuestionResponse)
def process_voice_intake(
    id: str,
    voice_req: VoiceInputRequest,
    db: Session = Depends(get_db)
):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    patient = db.query(Patient).filter(Patient.id == visit.patient_id).first()

    # 1. Create a clinical source record for this voice transcript
    source = ClinicalSource(
        source_type="voice_statement",
        title=f"Spoken Intake Statement ({voice_req.language.upper()})",
        raw_content=voice_req.transcript,
        confidence_score=0.96
    )
    db.add(source)
    db.commit()
    db.refresh(source)

    # 2. Retrieve existing facts for this patient
    existing_facts = db.query(ClinicalFact).filter(ClinicalFact.patient_id == patient.id).all()
    known_dicts = [{"key": f.key_name, "value": f.value, "status": f.status} for f in existing_facts]

    # 3. AI Service parses the voice transcript
    nlp_res = ai_service.analyze_voice_transcript(voice_req.transcript, known_dicts)

    # Update visit chief complaint
    if nlp_res.get("chief_complaint"):
        visit.chief_complaint = nlp_res["chief_complaint"]

    # 4. Save extracted facts linked to the voice source
    for sym in nlp_res.get("symptoms", []):
        fact = ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="symptom",
            key_name=sym["name"],
            value=f"{sym['name']} (Duration: {sym.get('duration', 'recent')}, Severity: {sym.get('severity', 'moderate')})",
            status="CONFIRMED",
            source_id=source.id,
            source_citation=f"Voice Intake: \"{voice_req.transcript}\"",
            confidence=0.95
        )
        db.add(fact)

    for med in nlp_res.get("medications_mentioned", []):
        fact = ClinicalFact(
            patient_id=patient.id,
            visit_id=visit.id,
            category="medication",
            key_name=med["name"],
            value=f"{med['name']} - {med['details']} (Status: {med['status'].upper()})",
            status="CONFIRMED" if med["status"] == "active" else "CONFLICTING",
            source_id=source.id,
            source_citation=f"Voice Intake: \"{voice_req.transcript}\"",
            confidence=0.94
        )
        db.add(fact)

    db.commit()

    # 5. Refresh facts & run Contradiction and Red Flag Engines
    all_facts = db.query(ClinicalFact).filter(ClinicalFact.patient_id == patient.id).all()
    
    # Contradictions
    conflicts = contradiction_engine.scan_for_contradictions(all_facts, patient.id, visit.id)
    for c in conflicts:
        existing_c = db.query(Contradiction).filter(
            Contradiction.patient_id == patient.id,
            Contradiction.title == c["title"]
        ).first()
        if not existing_c:
            contra = Contradiction(**c)
            db.add(contra)
            audit_service.log_event(
                db,
                actor_name="AI Contradiction Engine",
                actor_role="ai_system",
                action="CONTRADICTION_DETECTED",
                patient_id=patient.id,
                visit_id=visit.id,
                details=f"Detected conflict: {c['title']}"
            )

    # Red Flags
    rflags = red_flag_engine.evaluate_red_flags(all_facts, patient.id, visit.id)
    for rf in rflags:
        existing_rf = db.query(RedFlag).filter(
            RedFlag.patient_id == patient.id,
            RedFlag.title == rf["title"]
        ).first()
        if not existing_rf:
            rflag = RedFlag(**rf)
            db.add(rflag)
            audit_service.log_event(
                db,
                actor_name="Safety Red-Flag Engine",
                actor_role="ai_system",
                action="RED_FLAG_TRIGGERED",
                patient_id=patient.id,
                visit_id=visit.id,
                details=f"Potential Red Flag: {rf['title']}"
            )

    db.commit()

    # 6. Adaptive Questioning & Ask-Less Engine
    conversations = db.query(AIConversation).filter(AIConversation.visit_id == visit.id).all()
    next_step = question_engine.determine_next_question(all_facts, conversations, voice_req.transcript)

    visit.completeness_score = next_step["completeness_score"]
    visit.questions_asked_count = next_step["questions_asked_count"]
    visit.questions_avoided_count = next_step["questions_avoided_count"]
    
    # Save conversation question if one is selected
    if next_step.get("next_question"):
        conv = AIConversation(
            visit_id=visit.id,
            question_sequence=len(conversations) + 1,
            question_text=next_step["next_question"],
            question_category=next_step.get("category", "general"),
            input_mode="voice"
        )
        db.add(conv)

    db.commit()

    audit_service.log_event(
        db,
        actor_name=patient.name,
        actor_role="patient",
        action="VOICE_INTAKE_PROCESSED",
        patient_id=patient.id,
        visit_id=visit.id,
        details=f"Voice statement processed with {next_step['questions_avoided_count']} questions avoided"
    )

    return next_step

@router.post("/{id}/answers", response_model=AdaptiveQuestionResponse)
def answer_question(
    id: str,
    ans_req: QuestionAnswerRequest,
    db: Session = Depends(get_db)
):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    patient = db.query(Patient).filter(Patient.id == visit.patient_id).first()

    # Find conversation
    conv = db.query(AIConversation).filter(
        AIConversation.visit_id == visit.id,
        AIConversation.question_text == ans_req.question_text
    ).first()

    if not conv:
        conv = AIConversation(
            visit_id=visit.id,
            question_sequence=ans_req.question_sequence,
            question_text=ans_req.question_text,
            question_category=ans_req.question_category,
            patient_response=ans_req.patient_response,
            input_mode=ans_req.input_mode
        )
        db.add(conv)
    else:
        conv.patient_response = ans_req.patient_response
        conv.input_mode = ans_req.input_mode

    # Record as ClinicalFact
    source = ClinicalSource(
        source_type="voice_statement",
        title=f"Q&A: {ans_req.question_category}",
        raw_content=f"Q: {ans_req.question_text} | A: {ans_req.patient_response}",
        confidence_score=0.98
    )
    db.add(source)
    db.commit()
    db.refresh(source)

    fact = ClinicalFact(
        patient_id=patient.id,
        visit_id=visit.id,
        category=ans_req.question_category,
        key_name=ans_req.question_category.replace("_", " ").title(),
        value=ans_req.patient_response,
        status="CONFIRMED",
        source_id=source.id,
        source_citation=f"Patient response to: '{ans_req.question_text}'",
        confidence=0.98
    )
    db.add(fact)
    db.commit()

    all_facts = db.query(ClinicalFact).filter(ClinicalFact.patient_id == patient.id).all()
    conversations = db.query(AIConversation).filter(AIConversation.visit_id == visit.id).all()
    next_step = question_engine.determine_next_question(all_facts, conversations)

    visit.completeness_score = next_step["completeness_score"]
    visit.questions_asked_count = next_step["questions_asked_count"]
    visit.questions_avoided_count = next_step["questions_avoided_count"]

    if next_step.get("next_question"):
        new_conv = AIConversation(
            visit_id=visit.id,
            question_sequence=len(conversations) + 1,
            question_text=next_step["next_question"],
            question_category=next_step.get("category", "general"),
            input_mode="voice"
        )
        db.add(new_conv)

    db.commit()
    return next_step

@router.get("/{id}/summary")
def get_case_summary(id: str, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    patient = db.query(Patient).filter(Patient.id == visit.patient_id).first()
    facts = db.query(ClinicalFact).filter(ClinicalFact.patient_id == patient.id).all()
    contradictions = db.query(Contradiction).filter(Contradiction.patient_id == patient.id).all()
    red_flags = db.query(RedFlag).filter(RedFlag.patient_id == patient.id).all()

    fact_dicts = [{"category": f.category, "key_name": f.key_name, "value": f.value, "status": f.status} for f in facts]
    contra_dicts = [{"title": c.title, "status": c.status} for c in contradictions]
    rf_dicts = [{"title": r.title, "severity": r.severity} for r in red_flags]
    p_dict = {"name": patient.name, "age": patient.age, "sex": patient.sex, "patient_id_display": patient.patient_id_display}

    summary = ai_service.generate_draft_summary(p_dict, fact_dicts, contra_dicts, rf_dicts)
    visit.ai_summary_draft = summary
    db.commit()

    return {
        "visit_id": visit.id,
        "summary_draft": summary,
        "disclaimer": "AI-generated clinical draft — requires clinician verification."
    }
