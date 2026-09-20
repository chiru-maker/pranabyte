export type FactStatus = 'CONFIRMED' | 'DOCUMENTED' | 'UNCERTAIN' | 'CONFLICTING' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'staff' | 'admin';
  is_active: boolean;
}

export interface Patient {
  id: string;
  patient_id_display: string;
  name: string;
  age: number;
  sex: string;
  phone: string;
  abha_id?: string;
  is_existing: boolean;
  created_at: string;
}

export interface ClinicalSource {
  id: string;
  source_type: string;
  title: string;
  raw_content: string;
  file_path?: string;
  confidence_score: number;
  extracted_at: string;
}

export interface ClinicalFact {
  id: string;
  patient_id: string;
  visit_id?: string;
  category: 'chief_complaint' | 'symptom' | 'past_history' | 'medication' | 'allergy' | 'lab_result' | 'observation';
  key_name: string;
  value: string;
  status: FactStatus;
  source_id?: string;
  source_citation?: string;
  confidence: number;
  doctor_verified: boolean;
  doctor_action?: string;
  doctor_notes?: string;
  source?: ClinicalSource;
  created_at: string;
}

export interface Contradiction {
  id: string;
  patient_id: string;
  visit_id?: string;
  category: string;
  title: string;
  source_a_description: string;
  source_a_value: string;
  source_b_description: string;
  source_b_value: string;
  status: 'ACTIVE' | 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_EDIT' | 'DISMISSED';
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
}

export interface RedFlag {
  id: string;
  patient_id: string;
  visit_id?: string;
  rule_name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  title: string;
  trigger_criteria: string;
  recommendation: string;
  status: 'UNACKNOWLEDGED' | 'REVIEWED' | 'ACKNOWLEDGED' | 'DISMISSED';
  reviewed_at?: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  patient_id: string;
  event_date: string;
  event_title: string;
  event_description: string;
  source_type: string;
  source_reference_id?: string;
  status: FactStatus;
  confidence: number;
  sort_order: number;
  created_at: string;
}

export interface Visit {
  id: string;
  patient_id: string;
  visit_number: string;
  chief_complaint?: string;
  status: string;
  completeness_score: number;
  questions_asked_count: number;
  questions_avoided_count: number;
  ai_summary_draft?: string;
  doctor_notes?: string;
  doctor_verified: boolean;
  verified_at?: string;
  patient_confirmed?: boolean;
  patient_confirmed_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  patient_id?: string;
  visit_id?: string;
  actor_name: string;
  actor_role: string;
  action: string;
  details?: string;
  timestamp: string;
}

export interface DocumentRecord {
  id: string;
  patient_id: string;
  filename: string;
  file_type: string;
  file_path: string;
  ocr_raw_text?: string;
  ocr_confidence: number;
  ocr_status: string;
  uploaded_at: string;
  extractions: {
    id: string;
    extracted_entity_type: string;
    extracted_value: string;
    confidence: number;
    status: string;
  }[];
}
