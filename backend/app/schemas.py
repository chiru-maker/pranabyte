from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "patient" # patient, doctor, staff, admin

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

# Consent Schemas
class ConsentCreate(BaseModel):
    consent_version: str = "v1.0.0"
    status: str = "given"
    data_usage_disclosed: str
    ai_role_disclosed: str

class ConsentResponse(BaseModel):
    id: str
    patient_id: str
    consent_version: str
    status: str
    data_usage_disclosed: str
    ai_role_disclosed: str
    timestamp: datetime
    class Config:
        from_attributes = True

# Patient Schemas
class PatientCreate(BaseModel):
    name: str
    age: int
    sex: str
    phone: str
    abha_id: Optional[str] = None
    is_existing: bool = False

class PatientResponse(BaseModel):
    id: str
    patient_id_display: str
    name: str
    age: int
    sex: str
    phone: str
    abha_id: Optional[str] = None
    is_existing: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Clinical Source Schemas
class ClinicalSourceResponse(BaseModel):
    id: str
    source_type: str
    title: str
    raw_content: str
    file_path: Optional[str] = None
    confidence_score: float
    extracted_at: datetime
    class Config:
        from_attributes = True

# Clinical Fact Schemas
class ClinicalFactCreate(BaseModel):
    category: str
    key_name: str
    value: str
    status: str = "CONFIRMED" # CONFIRMED, DOCUMENTED, UNCERTAIN, CONFLICTING
    source_id: Optional[str] = None
    source_citation: Optional[str] = None
    confidence: float = 1.0

class ClinicalFactVerifyRequest(BaseModel):
    action: str # confirmed, edited, rejected, marked_uncertain
    edited_value: Optional[str] = None
    doctor_notes: Optional[str] = None

class ClinicalFactResponse(BaseModel):
    id: str
    patient_id: str
    visit_id: Optional[str] = None
    category: str
    key_name: str
    value: str
    status: str
    source_id: Optional[str] = None
    source_citation: Optional[str] = None
    confidence: float
    doctor_verified: bool
    doctor_action: Optional[str] = None
    doctor_notes: Optional[str] = None
    source: Optional[ClinicalSourceResponse] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Contradiction Schemas
class ContradictionResponse(BaseModel):
    id: str
    patient_id: str
    visit_id: Optional[str] = None
    category: str
    title: str
    source_a_description: str
    source_a_value: str
    source_b_description: str
    source_b_value: str
    status: str
    resolution_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ContradictionResolveRequest(BaseModel):
    status: str # RESOLVED_A, RESOLVED_B, RESOLVED_EDIT, DISMISSED
    resolution_notes: Optional[str] = None
    final_value: Optional[str] = None

# Red Flag Schemas
class RedFlagResponse(BaseModel):
    id: str
    patient_id: str
    visit_id: Optional[str] = None
    rule_name: str
    severity: str
    title: str
    trigger_criteria: str
    recommendation: str
    status: str
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

class RedFlagActionRequest(BaseModel):
    status: str # REVIEWED, ACKNOWLEDGED, DISMISSED

# Timeline Event Schemas
class TimelineEventResponse(BaseModel):
    id: str
    patient_id: str
    event_date: str
    event_title: str
    event_description: str
    source_type: str
    source_reference_id: Optional[str] = None
    status: str
    confidence: float
    sort_order: int
    created_at: datetime
    class Config:
        from_attributes = True

# AI Dialogue & Questioning Schemas
class VoiceInputRequest(BaseModel):
    transcript: str
    language: str = "en" # en, hi, kn

class QuestionAnswerRequest(BaseModel):
    question_sequence: int
    question_text: str
    question_category: str
    patient_response: str
    input_mode: str = "voice"

class AdaptiveQuestionResponse(BaseModel):
    next_question: Optional[str] = None
    category: Optional[str] = None
    is_complete: bool = False
    questions_asked_count: int
    questions_avoided_count: int
    avoided_reasons: List[str] = []
    completeness_score: int
    detected_red_flags: List[str] = []
    detected_conflicts: List[str] = []

# Document Schemas
class DocumentExtractionResponse(BaseModel):
    id: str
    extracted_entity_type: str
    extracted_value: str
    confidence: float
    status: str

class DocumentResponse(BaseModel):
    id: str
    patient_id: str
    visit_id: Optional[str] = None
    filename: str
    file_type: str
    file_path: str
    ocr_raw_text: Optional[str] = None
    ocr_confidence: float
    ocr_status: str
    uploaded_at: datetime
    extractions: List[DocumentExtractionResponse] = []
    class Config:
        from_attributes = True

# Visit Schemas
class VisitCreate(BaseModel):
    patient_id: str
    chief_complaint: Optional[str] = None

class VisitResponse(BaseModel):
    id: str
    patient_id: str
    visit_number: str
    chief_complaint: Optional[str] = None
    status: str
    completeness_score: int
    questions_asked_count: int
    questions_avoided_count: int
    ai_summary_draft: Optional[str] = None
    doctor_notes: Optional[str] = None
    doctor_verified: bool
    verified_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: str
    patient_id: Optional[str] = None
    visit_id: Optional[str] = None
    actor_name: str
    actor_role: str
    action: str
    details: Optional[str] = None
    timestamp: datetime
    class Config:
        from_attributes = True
