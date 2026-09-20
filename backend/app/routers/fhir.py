from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Patient, Visit, ClinicalFact
from backend.app.services.fhir import fhir_service

router = APIRouter(prefix="/fhir", tags=["FHIR Interoperability"])

@router.get("/patients/{patient_id}")
def export_patient_fhir(patient_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    visit = db.query(Visit).filter(Visit.patient_id == patient_id).order_by(Visit.created_at.desc()).first()
    if not visit:
        raise HTTPException(status_code=404, detail="No visit found for this patient")

    facts = db.query(ClinicalFact).filter(ClinicalFact.patient_id == patient_id).all()
    bundle = fhir_service.export_patient_bundle(patient, visit, facts)
    return bundle
