import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Patient, Consent, Visit, User
from backend.app.schemas import PatientCreate, PatientResponse, ConsentCreate, ConsentResponse
from backend.app.auth import get_current_user
from backend.app.services.audit import audit_service

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("", response_model=PatientResponse)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db)
):
    patient_display_id = f"PAT-2026-{random.randint(1000, 9999)}"
    patient = Patient(
        patient_id_display=patient_display_id,
        name=patient_in.name,
        age=patient_in.age,
        sex=patient_in.sex,
        phone=patient_in.phone,
        abha_id=patient_in.abha_id,
        is_existing=patient_in.is_existing
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # Automatically initialize a new visit for case taking
    visit = Visit(
        patient_id=patient.id,
        visit_number=f"VISIT-{random.randint(1000, 9999)}",
        status="in_progress"
    )
    db.add(visit)
    db.commit()

    audit_service.log_event(
        db,
        actor_name=patient.name,
        actor_role="patient",
        action="PATIENT_REGISTRATION",
        patient_id=patient.id,
        visit_id=visit.id,
        details=f"Patient registered with ID {patient_display_id}"
    )

    return patient

@router.get("", response_model=List[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.created_at.desc()).all()

@router.get("/{id}", response_model=PatientResponse)
def get_patient(id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/{id}/consent", response_model=ConsentResponse)
def record_consent(
    id: str,
    consent_in: ConsentCreate,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    consent = Consent(
        patient_id=id,
        consent_version=consent_in.consent_version,
        status=consent_in.status,
        data_usage_disclosed=consent_in.data_usage_disclosed,
        ai_role_disclosed=consent_in.ai_role_disclosed
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)

    audit_service.log_event(
        db,
        actor_name=patient.name,
        actor_role="patient",
        action=f"CONSENT_{consent_in.status.upper()}",
        patient_id=id,
        details=f"Patient consent version {consent_in.consent_version} recorded as {consent_in.status}"
    )

    return consent
