-- Patient Story Engine PostgreSQL / SQLite Database Schema
-- Standardized schema for multi-role clinical intake, facts with 4-state lifecycle, evidence tracing, red-flag monitoring & audit trails.

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'patient', -- patient, doctor, staff, admin
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    patient_id_display VARCHAR(32) UNIQUE NOT NULL, -- e.g. PAT-DEMO-001
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    sex VARCHAR(16) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    abha_id VARCHAR(64), -- 14 digit Ayushman Bharat Health Account demo
    is_existing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consents (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    consent_version VARCHAR(16) NOT NULL DEFAULT 'v1.0.0',
    status VARCHAR(32) NOT NULL DEFAULT 'given', -- given, declined, revoked
    data_usage_disclosed TEXT NOT NULL,
    ai_role_disclosed TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    visit_number VARCHAR(32) NOT NULL,
    chief_complaint TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress', -- in_progress, waiting_doctor, completed, flagged
    completeness_score INTEGER DEFAULT 0,
    questions_asked_count INTEGER DEFAULT 0,
    questions_avoided_count INTEGER DEFAULT 0,
    ai_summary_draft TEXT,
    doctor_notes TEXT,
    doctor_verified BOOLEAN DEFAULT FALSE,
    verified_by_doctor_id VARCHAR(64) REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_sources (
    id VARCHAR(64) PRIMARY KEY,
    source_type VARCHAR(64) NOT NULL, -- voice_statement, uploaded_document, prior_record, doctor_manual
    title VARCHAR(255) NOT NULL,
    raw_content TEXT NOT NULL,
    file_path VARCHAR(512),
    confidence_score FLOAT DEFAULT 1.0,
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_facts (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    visit_id VARCHAR(64) REFERENCES visits(id),
    category VARCHAR(64) NOT NULL, -- chief_complaint, past_history, medication, allergy, symptom, observation, lab_result
    key_name VARCHAR(128) NOT NULL,
    value TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED (🟢), DOCUMENTED (🔵), UNCERTAIN (🟡), CONFLICTING (🔴)
    source_id VARCHAR(64) REFERENCES clinical_sources(id),
    source_citation TEXT,
    confidence FLOAT DEFAULT 1.0,
    doctor_verified BOOLEAN DEFAULT FALSE,
    doctor_action VARCHAR(32), -- confirmed, edited, rejected, marked_uncertain
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    visit_id VARCHAR(64) REFERENCES visits(id),
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(64) NOT NULL, -- prescription, lab_report, discharge_summary, scan_report
    file_path VARCHAR(512) NOT NULL,
    ocr_raw_text TEXT,
    ocr_confidence FLOAT DEFAULT 0.0,
    ocr_status VARCHAR(32) DEFAULT 'pending', -- pending, completed, failed
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_extractions (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES documents(id),
    extracted_entity_type VARCHAR(64) NOT NULL, -- medication, condition, allergy, lab_value, date, hospital_name
    extracted_value TEXT NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    status VARCHAR(32) DEFAULT 'DOCUMENTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contradictions (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    visit_id VARCHAR(64) REFERENCES visits(id),
    category VARCHAR(64) NOT NULL, -- medication_conflict, allergy_conflict, history_conflict
    title VARCHAR(255) NOT NULL,
    source_a_description TEXT NOT NULL,
    source_a_value TEXT NOT NULL,
    source_b_description TEXT NOT NULL,
    source_b_value TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED_A, RESOLVED_B, RESOLVED_EDIT, DISMISSED
    resolution_notes TEXT,
    resolved_by_doctor_id VARCHAR(64) REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS red_flags (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    visit_id VARCHAR(64) REFERENCES visits(id),
    rule_name VARCHAR(128) NOT NULL,
    severity VARCHAR(32) DEFAULT 'HIGH', -- CRITICAL, HIGH, MODERATE
    title VARCHAR(255) NOT NULL,
    trigger_criteria TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'UNACKNOWLEDGED', -- UNACKNOWLEDGED, REVIEWED, ACKNOWLEDGED, DISMISSED
    reviewed_by_doctor_id VARCHAR(64) REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timeline_events (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    event_date VARCHAR(64) NOT NULL, -- e.g. "2024", "Jan 2026", "Today"
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    source_type VARCHAR(64) NOT NULL, -- prescription, lab, voice_intake, doctor_note
    source_reference_id VARCHAR(64),
    status VARCHAR(32) DEFAULT 'DOCUMENTED', -- CONFIRMED, DOCUMENTED, UNCERTAIN, CONFLICTING
    confidence FLOAT DEFAULT 1.0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id VARCHAR(64) PRIMARY KEY,
    visit_id VARCHAR(64) NOT NULL REFERENCES visits(id),
    question_sequence INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_category VARCHAR(64) NOT NULL,
    is_skipped BOOLEAN DEFAULT FALSE,
    skip_reason TEXT,
    patient_response TEXT,
    input_mode VARCHAR(32) DEFAULT 'voice', -- voice, text, touch_select
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patients(id),
    visit_id VARCHAR(64) REFERENCES visits(id),
    actor_id VARCHAR(64),
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(32) NOT NULL, -- patient, doctor, staff, ai_system
    action VARCHAR(128) NOT NULL,
    details TEXT,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
