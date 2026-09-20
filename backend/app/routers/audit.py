from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import AuditLog
from backend.app.schemas import AuditLogResponse

router = APIRouter(prefix="/audit", tags=["Audit Trails & Compliance"])

@router.get("/{patient_id}", response_model=List[AuditLogResponse])
def get_audit_trail_for_patient(patient_id: str, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(AuditLog.patient_id == patient_id).order_by(AuditLog.timestamp.desc()).all()

@router.get("", response_model=List[AuditLogResponse])
def get_all_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
