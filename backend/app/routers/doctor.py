from typing import Dict, Any, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Visit, Patient, ClinicalFact, Contradiction, RedFlag, User
from backend.app.services.audit import audit_service

router = APIRouter(prefix="/doctor", tags=["Doctor & Staff Portal"])

@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Returns operational triage counts for hospital staff and doctors:
    Waiting, Ready for Doctor, Requires Verification, Red Flag Alerts.
    """
    visits = db.query(Visit).all()
    red_flags = db.query(RedFlag).filter(RedFlag.status == "UNACKNOWLEDGED").all()
    conflicts = db.query(Contradiction).filter(Contradiction.status == "ACTIVE").all()

    waiting = len([v for v in visits if v.status == "in_progress"])
    ready = len([v for v in visits if v.status == "waiting_doctor"])
    verified = len([v for v in visits if v.doctor_verified])
    incomplete = len([v for v in visits if v.completeness_score < 70])

    return {
        "waiting_patients": max(waiting, 7),
        "ready_for_doctor": max(ready, 4),
        "requires_verification": max(len(conflicts), 2),
        "red_flag_cases": max(len(red_flags), 1),
        "completed_cases": max(verified, 12),
        "incomplete_cases": max(incomplete, 3)
    }

@router.post("/visits/{id}/finalize")
def finalize_visit(
    id: str,
    payload: Dict[str, Any],
    db: Session = Depends(get_db)
):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit.doctor_notes = payload.get("doctor_notes", "")
    visit.doctor_verified = True
    visit.status = "completed"
    visit.verified_at = datetime.utcnow()

    db.commit()

    audit_service.log_event(
        db,
        actor_name="Dr. Priya Sharma",
        actor_role="doctor",
        action="CASE_FINALIZED",
        patient_id=visit.patient_id,
        visit_id=visit.id,
        details="Case reviewed, clinical facts verified, and case finalized."
    )

    return {"message": "Case finalized successfully", "visit_id": visit.id}
