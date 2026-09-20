import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False, default="patient") # patient, doctor, staff, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patients = relationship("Patient", back_populates="user")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    patient_id_display = Column(String(32), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(String(16), nullable=False) # Male, Female, Other
    phone = Column(String(32), nullable=False)
    abha_id = Column(String(64), nullable=True) # Demo ABHA ID
    is_existing = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="patients")
    consents = relationship("Consent", back_populates="patient", cascade="all, delete-orphan")
    visits = relationship("Visit", back_populates="patient", cascade="all, delete-orphan")
    clinical_facts = relationship("ClinicalFact", back_populates="patient", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="patient", cascade="all, delete-orphan")
    contradictions = relationship("Contradiction", back_populates="patient", cascade="all, delete-orphan")
    red_flags = relationship("RedFlag", back_populates="patient", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEvent", back_populates="patient", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="patient", cascade="all, delete-orphan")


class Consent(Base):
    __tablename__ = "consents"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    consent_version = Column(String(16), default="v1.0.0")
    status = Column(String(32), default="given") # given, declined, revoked
    data_usage_disclosed = Column(Text, nullable=False)
    ai_role_disclosed = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="consents")


class Visit(Base):
    __tablename__ = "visits"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    visit_number = Column(String(32), nullable=False)
    chief_complaint = Column(Text, nullable=True)
    status = Column(String(32), default="in_progress") # in_progress, waiting_doctor, completed, flagged
    completeness_score = Column(Integer, default=0) # 0-100%
    questions_asked_count = Column(Integer, default=0)
    questions_avoided_count = Column(Integer, default=0)
    ai_summary_draft = Column(Text, nullable=True)
    doctor_notes = Column(Text, nullable=True)
    doctor_verified = Column(Boolean, default=False)
    verified_by_doctor_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="visits")
    clinical_facts = relationship("ClinicalFact", back_populates="visit")
    documents = relationship("Document", back_populates="visit")
    contradictions = relationship("Contradiction", back_populates="visit")
    red_flags = relationship("RedFlag", back_populates="visit")
    conversations = relationship("AIConversation", back_populates="visit", cascade="all, delete-orphan")


class ClinicalSource(Base):
    __tablename__ = "clinical_sources"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_type = Column(String(64), nullable=False) # voice_statement, uploaded_document, prior_record, doctor_manual
    title = Column(String(255), nullable=False)
    raw_content = Column(Text, nullable=False)
    file_path = Column(String(512), nullable=True)
    confidence_score = Column(Float, default=1.0)
    extracted_at = Column(DateTime, default=datetime.utcnow)

    clinical_facts = relationship("ClinicalFact", back_populates="source")


class ClinicalFact(Base):
    __tablename__ = "clinical_facts"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    visit_id = Column(String(64), ForeignKey("visits.id"), nullable=True)
    category = Column(String(64), nullable=False) # chief_complaint, past_history, medication, allergy, symptom, observation, lab_result
    key_name = Column(String(128), nullable=False)
    value = Column(Text, nullable=False)
    # 4 Status States: CONFIRMED (🟢), DOCUMENTED (🔵), UNCERTAIN (🟡), CONFLICTING (🔴)
    status = Column(String(32), default="CONFIRMED")
    source_id = Column(String(64), ForeignKey("clinical_sources.id"), nullable=True)
    source_citation = Column(Text, nullable=True)
    confidence = Column(Float, default=1.0)
    doctor_verified = Column(Boolean, default=False)
    doctor_action = Column(String(32), nullable=True) # confirmed, edited, rejected, marked_uncertain
    doctor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="clinical_facts")
    visit = relationship("Visit", back_populates="clinical_facts")
    source = relationship("ClinicalSource", back_populates="clinical_facts")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    visit_id = Column(String(64), ForeignKey("visits.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(64), nullable=False) # prescription, lab_report, discharge_summary, scan_report
    file_path = Column(String(512), nullable=False)
    ocr_raw_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.0)
    ocr_status = Column(String(32), default="pending") # pending, completed, failed
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="documents")
    visit = relationship("Visit", back_populates="documents")
    extractions = relationship("DocumentExtraction", back_populates="document", cascade="all, delete-orphan")


class DocumentExtraction(Base):
    __tablename__ = "document_extractions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("documents.id"), nullable=False)
    extracted_entity_type = Column(String(64), nullable=False) # medication, condition, allergy, lab_value, date, hospital_name
    extracted_value = Column(Text, nullable=False)
    confidence = Column(Float, default=1.0)
    status = Column(String(32), default="DOCUMENTED")
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="extractions")


class Contradiction(Base):
    __tablename__ = "contradictions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    visit_id = Column(String(64), ForeignKey("visits.id"), nullable=True)
    category = Column(String(64), nullable=False) # medication_conflict, allergy_conflict, history_conflict
    title = Column(String(255), nullable=False)
    source_a_description = Column(Text, nullable=False)
    source_a_value = Column(Text, nullable=False)
    source_b_description = Column(Text, nullable=False)
    source_b_value = Column(Text, nullable=False)
    status = Column(String(32), default="ACTIVE") # ACTIVE, RESOLVED_A, RESOLVED_B, RESOLVED_EDIT, DISMISSED
    resolution_notes = Column(Text, nullable=True)
    resolved_by_doctor_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="contradictions")
    visit = relationship("Visit", back_populates="contradictions")


class RedFlag(Base):
    __tablename__ = "red_flags"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    visit_id = Column(String(64), ForeignKey("visits.id"), nullable=True)
    rule_name = Column(String(128), nullable=False)
    severity = Column(String(32), default="HIGH") # CRITICAL, HIGH, MODERATE
    title = Column(String(255), nullable=False)
    trigger_criteria = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    status = Column(String(32), default="UNACKNOWLEDGED") # UNACKNOWLEDGED, REVIEWED, ACKNOWLEDGED, DISMISSED
    reviewed_by_doctor_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="red_flags")
    visit = relationship("Visit", back_populates="red_flags")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    event_date = Column(String(64), nullable=False) # e.g. "2024", "Jan 2026", "Today"
    event_title = Column(String(255), nullable=False)
    event_description = Column(Text, nullable=False)
    source_type = Column(String(64), nullable=False) # prescription, lab, voice_intake, doctor_note
    source_reference_id = Column(String(64), nullable=True)
    status = Column(String(32), default="DOCUMENTED") # CONFIRMED, DOCUMENTED, UNCERTAIN, CONFLICTING
    confidence = Column(Float, default=1.0)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="timeline_events")


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    visit_id = Column(String(64), ForeignKey("visits.id"), nullable=False)
    question_sequence = Column(Integer, default=1)
    question_text = Column(Text, nullable=False)
    question_category = Column(String(64), nullable=False)
    is_skipped = Column(Boolean, default=False)
    skip_reason = Column(Text, nullable=True)
    patient_response = Column(Text, nullable=True)
    input_mode = Column(String(32), default="voice") # voice, text, touch_select
    created_at = Column(DateTime, default=datetime.utcnow)

    visit = relationship("Visit", back_populates="conversations")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=True)
    visit_id = Column(String(64), ForeignKey("visits.id"), nullable=True)
    actor_id = Column(String(64), nullable=True)
    actor_name = Column(String(255), nullable=False)
    actor_role = Column(String(32), nullable=False) # patient, doctor, staff, ai_system
    action = Column(String(128), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(64), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="audit_logs")
