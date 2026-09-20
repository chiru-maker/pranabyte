# Patient Story Engine — REST API Specifications

Base URL: `/api/v1`

## 1. Authentication
- `POST /auth/register` — Register a new user (`patient`, `doctor`, `staff`).
- `POST /auth/login` — Login and receive JWT bearer token.
- `GET /auth/me` — Current user profile.

## 2. Patients & Consent
- `POST /patients` — Register a new patient.
- `GET /patients` — List patients.
- `GET /patients/{id}` — Get patient details.
- `POST /patients/{id}/consent` — Record informed consent (`v1.0.0`, timestamp, disclosures).

## 3. Case-Taking & Dialogue
- `POST /visits/{id}/voice` — Submit voice transcript; returns parsed entities, avoided questions count, and adaptive next question.
- `POST /visits/{id}/answers` — Submit answer to dynamic clinical question.
- `GET /visits/{id}/summary` — Generate AI structured case draft.

## 4. Documents & OCR
- `POST /documents/upload` — Upload prescription/lab report; executes OCR and extracts entities tagged with `🔵 DOCUMENTED` or `🟡 UNCERTAIN`.
- `GET /documents/patient/{patient_id}` — List patient's uploaded documents.

## 5. Evidence, Verification & Timeline
- `GET /patients/{id}/clinical-facts` — Fetch all facts with 4-state status badges and source citations.
- `POST /clinical-facts/{id}/verify` — Clinician verification (`confirmed`, `edited`, `rejected`, `marked_uncertain`).
- `GET /patients/{id}/contradictions` — Fetch active cross-source conflicts.
- `POST /contradictions/{id}/resolve` — Doctor resolves discrepancy.
- `GET /patients/{id}/red-flags` — Safety red flag alert list.
- `POST /red-flags/{id}/action` — Doctor marks red flag (`ACKNOWLEDGED` or `DISMISSED`).
- `GET /patients/{id}/timeline` — Chronological reconstructed medical timeline.

## 6. Doctor & Staff Operations
- `GET /doctor/dashboard-summary` — Triage queue metrics (Waiting, Ready, Requires Verification, Red Flag).
- `POST /doctor/visits/{id}/finalize` — Finalize clinical case with physician notes.

## 7. FHIR & Audit
- `GET /fhir/patients/{patient_id}` — Export HL7 FHIR R4 Bundle JSON.
- `GET /audit/{patient_id}` — View immutable compliance audit log.
