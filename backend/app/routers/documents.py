import os
import shutil
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models import Document, DocumentExtraction, ClinicalFact, ClinicalSource, Patient, Visit, Contradiction, RedFlag
from backend.app.schemas import DocumentResponse
from backend.app.services.ocr_service import ocr_service
from backend.app.services.contradiction import contradiction_engine
from backend.app.services.red_flags import red_flag_engine
from backend.app.services.audit import audit_service

router = APIRouter(prefix="/documents", tags=["Documents & OCR"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    patient_id: str = Form(...),
    visit_id: str = Form(None),
    file_type: str = Form("prescription"), # prescription, lab_report, discharge_summary
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4()}{file_ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1. Run OCR and Clinical Extraction
    ocr_result = ocr_service.process_document(saved_path, file.filename)

    # 2. Save Document Record
    doc = Document(
        patient_id=patient_id,
        visit_id=visit_id,
        filename=file.filename,
        file_type=file_type,
        file_path=saved_path,
        ocr_raw_text=ocr_result["raw_text"],
        ocr_confidence=ocr_result["ocr_confidence"],
        ocr_status="completed"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # 3. Create Clinical Source for this document
    source = ClinicalSource(
        source_type="uploaded_document",
        title=f"Uploaded {file_type.title()} ({file.filename})",
        raw_content=ocr_result["raw_text"],
        file_path=saved_path,
        confidence_score=ocr_result["ocr_confidence"]
    )
    db.add(source)
    db.commit()
    db.refresh(source)

    # 4. Save Extractions and map to Clinical Facts
    for ent in ocr_result["entities"]:
        extraction = DocumentExtraction(
            document_id=doc.id,
            extracted_entity_type=ent["entity_type"],
            extracted_value=ent["value"],
            confidence=ent["confidence"],
            status=ent["status"]
        )
        db.add(extraction)

        category_map = {
            "medication": "medication",
            "condition": "past_history",
            "allergy": "allergy",
            "lab_value": "lab_result",
            "observation": "observation",
            "hospital_name": "past_history",
            "date": "past_history"
        }
        cat = category_map.get(ent["entity_type"], "past_history")

        # Map to Clinical Fact with 🔵 DOCUMENTED or 🟡 UNCERTAIN
        fact = ClinicalFact(
            patient_id=patient_id,
            visit_id=visit_id,
            category=cat,
            key_name=ent["entity_type"].replace("_", " ").title(),
            value=ent["value"],
            status=ent["status"], # DOCUMENTED or UNCERTAIN
            source_id=source.id,
            source_citation=f"Extracted from {file.filename} (Confidence: {int(ent['confidence']*100)}%)",
            confidence=ent["confidence"]
        )
        db.add(fact)

    db.commit()

    # 5. Check Contradictions and Red Flags post-document upload
    all_facts = db.query(ClinicalFact).filter(ClinicalFact.patient_id == patient.id).all()
    conflicts = contradiction_engine.scan_for_contradictions(all_facts, patient.id, visit_id)
    for c in conflicts:
        existing_c = db.query(Contradiction).filter(
            Contradiction.patient_id == patient.id,
            Contradiction.title == c["title"]
        ).first()
        if not existing_c:
            contra = Contradiction(**c)
            db.add(contra)

    rflags = red_flag_engine.evaluate_red_flags(all_facts, patient.id, visit_id)
    for rf in rflags:
        existing_rf = db.query(RedFlag).filter(
            RedFlag.patient_id == patient.id,
            RedFlag.title == rf["title"]
        ).first()
        if not existing_rf:
            rflag = RedFlag(**rf)
            db.add(rflag)

    db.commit()

    audit_service.log_event(
        db,
        actor_name=patient.name,
        actor_role="patient",
        action="DOCUMENT_UPLOAD_OCR",
        patient_id=patient_id,
        visit_id=visit_id,
        details=f"Document '{file.filename}' processed via OCR ({len(ocr_result['entities'])} clinical entities extracted)"
    )

    db.refresh(doc)
    return doc

@router.get("/patient/{patient_id}", response_model=List[DocumentResponse])
def get_patient_documents(patient_id: str, db: Session = Depends(get_db)):
    return db.query(Document).filter(Document.patient_id == patient_id).order_by(Document.uploaded_at.desc()).all()
