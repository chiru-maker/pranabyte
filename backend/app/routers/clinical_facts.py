from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import ClinicalFact, Contradiction, RedFlag, TimelineEvent, User
from backend.app.schemas import (
    ClinicalFactResponse, ClinicalFactVerifyRequest,
    ContradictionResponse, ContradictionResolveRequest,
    RedFlagResponse, RedFlagActionRequest,
    TimelineEventResponse
)
from backend.app.services.timeline import timeline_engine
from backend.app.services.audit import audit_service

router = APIRouter(tags=["Clinical Facts, Evidence & Verification"])

@router.get("/patients/{id}/clinical-facts", response_model=List[ClinicalFactResponse])
def get_patient_clinical_facts(id: str, db: Session = Depends(get_db)):
    return db.query(ClinicalFact).filter(ClinicalFact.patient_id == id).order_by(ClinicalFact.created_at.desc()).all()

@router.post("/clinical-facts/{id}/verify", response_model=ClinicalFactResponse)
def verify_clinical_fact(
    id: str,
    verify_req: ClinicalFactVerifyRequest,
    db: Session = Depends(get_db)
):
    fact = db.query(ClinicalFact).filter(ClinicalFact.id == id).first()
    if not fact:
        raise HTTPException(status_code=404, detail="Clinical fact not found")

    old_val = fact.value
    fact.doctor_verified = True
    fact.doctor_action = verify_req.action
    fact.doctor_notes = verify_req.doctor_notes

    if verify_req.action == "confirmed":
        fact.status = "CONFIRMED"
    elif verify_req.action == "edited" and verify_req.edited_value:
        fact.value = verify_req.edited_value
        fact.status = "CONFIRMED"
    elif verify_req.action == "rejected":
        fact.status = "REJECTED"
    elif verify_req.action == "marked_uncertain":
        fact.status = "UNCERTAIN"

    db.commit()
    db.refresh(fact)

    audit_service.log_event(
        db,
        actor_name="Dr. Priya Sharma (Cardiology)",
        actor_role="doctor",
        action="CLINICAL_FACT_VERIFIED",
        patient_id=fact.patient_id,
        visit_id=fact.visit_id,
        details=f"Fact '{fact.key_name}' verified as '{verify_req.action}'. Value: '{fact.value}' (Previous: '{old_val}')"
    )

    return fact

@router.get("/patients/{id}/contradictions", response_model=List[ContradictionResponse])
def get_patient_contradictions(id: str, db: Session = Depends(get_db)):
    return db.query(Contradiction).filter(Contradiction.patient_id == id).order_by(Contradiction.created_at.desc()).all()

@router.post("/contradictions/{id}/resolve", response_model=ContradictionResponse)
def resolve_contradiction(
    id: str,
    resolve_req: ContradictionResolveRequest,
    db: Session = Depends(get_db)
):
    contra = db.query(Contradiction).filter(Contradiction.id == id).first()
    if not contra:
        raise HTTPException(status_code=404, detail="Contradiction not found")

    contra.status = resolve_req.status
    contra.resolution_notes = resolve_req.resolution_notes
    contra.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(contra)

    audit_service.log_event(
        db,
        actor_name="Dr. Priya Sharma",
        actor_role="doctor",
        action="CONTRADICTION_RESOLVED",
        patient_id=contra.patient_id,
        visit_id=contra.visit_id,
        details=f"Resolved conflict '{contra.title}' with status {resolve_req.status}. Notes: {resolve_req.resolution_notes}"
    )

    return contra

@router.get("/patients/{id}/red-flags", response_model=List[RedFlagResponse])
def get_patient_red_flags(id: str, db: Session = Depends(get_db)):
    return db.query(RedFlag).filter(RedFlag.patient_id == id).order_by(RedFlag.created_at.desc()).all()

@router.post("/red-flags/{id}/action", response_model=RedFlagResponse)
def handle_red_flag_action(
    id: str,
    action_req: RedFlagActionRequest,
    db: Session = Depends(get_db)
):
    rf = db.query(RedFlag).filter(RedFlag.id == id).first()
    if not rf:
        raise HTTPException(status_code=404, detail="Red flag not found")

    rf.status = action_req.status
    rf.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(rf)

    audit_service.log_event(
        db,
        actor_name="Dr. Priya Sharma",
        actor_role="doctor",
        action="RED_FLAG_ACTION",
        patient_id=rf.patient_id,
        visit_id=rf.visit_id,
        details=f"Red Flag '{rf.title}' action: {action_req.status}"
    )

    return rf

@router.get("/patients/{id}/timeline", response_model=List[TimelineEventResponse])
def get_patient_timeline(id: str, db: Session = Depends(get_db)):
    events = db.query(TimelineEvent).filter(TimelineEvent.patient_id == id).order_by(TimelineEvent.sort_order.asc()).all()
    if not events:
        # Seed timeline dynamically if not present
        demo_events = timeline_engine.generate_demo_timeline(id)
        for ev in demo_events:
            t_obj = TimelineEvent(**ev)
            db.add(t_obj)
        db.commit()
        events = db.query(TimelineEvent).filter(TimelineEvent.patient_id == id).order_by(TimelineEvent.sort_order.asc()).all()
    return events
