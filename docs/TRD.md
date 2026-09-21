# Technical Requirements Document (TRD)
## AI-Powered Patient Case-Taking & Clinical Intelligence Platform (Pranabyte)

---

## 1. System Architecture Overview
Pranabyte utilizes a modern, decoupled client-server architecture designed for high availability, sub-second clinical UI responsiveness, strict patient health information (PHI) data isolation, and low-latency multilingual AI inference.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT FRONTEND                               │
│  React 18 + TypeScript + Vite + TailwindCSS (DESIGN.md Design Tokens)  │
│  - Web Speech API / Simulated Multilingual Speech Fallback             │
│  - Reactive Case Completeness & Journey State Visualizers              │
│  - Role-Based Dynamic Stations (Patient, Doctor, Nurse, Admin)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI BACKEND                               │
│  Python 3.10+ • Uvicorn ASGI • Pydantic v2 • SQLAlchemy 2.0 ORM        │
│  ├─ Auth & RBAC Engine (JWT HS256, Passlib/Bcrypt)                     │
│  ├─ Clinical Entity Extraction Pipeline (Gemini / OpenAI / Fallback)   │
│  ├─ Contradiction Detection & Red-Flag Screening Engine                │
│  ├─ Adaptive Questioning & Avoidance Computation                       │
│  ├─ FHIR R4 Bundle Serializer & PDF Clinical Brief Generator           │
│  └─ Immutable Audit Logging Service (HIPAA / DISHA compliant)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE & STORAGE                      │
│  SQLite (Local/Dev) / PostgreSQL (Production) + Local/S3 Encrypted Blob │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18.2.0 with TypeScript 5.2.2
- **Bundler & Build Tool**: Vite 5.1.6
- **Styling**: TailwindCSS 3.4.1 configured with exact `DESIGN.md` design tokens:
  - Canvas: Parchment `#fef9ef`
  - Surfaces / Cards: Aged Paper `#f5eee1`
  - Borders: Warm Taupe `#d1c9bf`
  - Primary Action / Accent: Terracotta `#b05a36`
  - Text: Ink `#2a2b2f`, Charcoal `#333333`, Graphite `#515151`
- **Iconography**: Lucide React 0.359.0
- **Audio & Speech**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with regional Indian locales (`en-IN`, `hi-IN`, `kn-IN`).
- **Data Fetching**: Native Fetch API with centralized JWT interceptor (`/src/api/client.ts`).

### Backend
- **Framework**: FastAPI 0.110.0+ on Python 3.10+
- **ASGI Server**: Uvicorn 0.28.0+
- **ORM & Data Layer**: SQLAlchemy 2.0.28 with Pydantic 2.6.4 models
- **Authentication**: OAuth2 Password Bearer flow with JWT (HS256) and Bcrypt password hashing
- **AI / LLM Integration**: Google Gemini API (`google-genai` / `@google/genai`) with fallback to OpenAI API (`openai`) and deterministic heuristic fallback pipelines
- **OCR Engine**: PyPDF / Tesseract OCR / Gemini Multimodal Vision for scanned prescription parsing
- **Interoperability**: HL7 FHIR R4 compliant Resource generator (`Patient`, `Condition`, `MedicationStatement`, `Observation`, `AllergyIntolerance`)

---

## 3. Data Processing & AI Pipelines

### 3.1. Speech-to-Text & Multilingual Intake
```
Patient Speaks (Hindi/Kannada/English)
  ↓
Web Speech API / Audio Stream Ingestion
  ↓
Language Detection & Normalization
  ↓
Spoken Transcript Storage (AIConversation entity)
  ↓
Clinical Entity Extraction Pipeline
```

### 3.2. Clinical Entity Extraction & 4-State Classification
The entity extraction pipeline processes raw natural text and maps entities into 7 clinical categories:
1. `chief_complaint`
2. `symptom`
3. `past_history`
4. `medication`
5. `allergy`
6. `lab_result`
7. `observation`

Each extracted entity is classified into one of 4 information states:
- **`CONFIRMED`** (Confidence ≥ 0.90, stated directly by patient in current session)
- **`DOCUMENTED`** (Confidence ≥ 0.95, extracted from verified prior document or historical EHR)
- **`UNCERTAIN`** (Confidence < 0.85, ambiguous dosage or low OCR clarity)
- **`CONFLICTING`** (Active discrepancy detected between current statements and historical records)

### 3.3. Contradiction Detection Engine
1. Loads all active documented medications and past diagnoses.
2. Compares spoken statements against documented values.
3. If an active documented medication (e.g. *Ecosprin 75mg*) is reported as stopped or dosage modified without medical record reconciliation, a `Contradiction` record is created with `status: ACTIVE`.
4. Doctor must explicitly resolve the contradiction before finalizing the visit.

### 3.4. Red-Flag Screening Rules
Deterministic, rule-based screening runs on every intake update:
- **Rule `acute_coronary_cluster`**: Sub-sternal chest pain + shortness of breath / diaphoresis + age ≥ 40 or CAD risk factors. Triggers High/Critical Red Flag: *"Immediate 12-lead ECG and clinical evaluation recommended."*
- **Rule `severe_allergy_exposure`**: Documented severe allergy (e.g. Penicillin anaphylaxis) matched with newly mentioned antibiotics.
- **Rule `unsupervised_antithrombotic_cessation`**: Discontinued antiplatelet/anticoagulant therapy in patients with vascular disease history.

---

## 4. API Endpoints Specification

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | Public |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/api/v1/auth/me` | Fetch active user profile | Any Authenticated |
| `GET` | `/api/v1/patients` | List patients with search & filter | Doctor, Nurse, Admin |
| `POST` | `/api/v1/patients` | Create patient profile | Nurse, Staff, Doctor |
| `GET` | `/api/v1/patients/{id}` | Get full patient case file | Doctor, Nurse, Admin |
| `POST` | `/api/v1/visits` | Create new clinical visit session | Nurse, Doctor, Patient |
| `POST` | `/api/v1/visits/{id}/voice-intake` | Process spoken transcript | Patient, Doctor |
| `GET` | `/api/v1/visits/{id}/completeness` | Get completeness score & missing fields | All Roles |
| `POST` | `/api/v1/visits/{id}/adaptive-answer`| Submit answer to adaptive question | Patient, Doctor |
| `GET` | `/api/v1/visits/{id}/doctor-brief` | Generate structured AI summary | Doctor |
| `POST` | `/api/v1/visits/{id}/verify-fact` | Clinician verifies/edits clinical fact | Doctor |
| `POST` | `/api/v1/visits/{id}/resolve-contradiction` | Resolve medication discrepancy | Doctor |
| `POST` | `/api/v1/visits/{id}/finalize` | Sign and finalize clinical case | Doctor |
| `GET` | `/api/v1/fhir/bundle/{visit_id}` | Export FHIR R4 JSON bundle | Doctor, Admin |
| `GET` | `/api/v1/audit/logs` | Query system audit logs | Admin |

---

## 5. Security & Privacy Architecture

### 5.1. Security Headers Middleware
Implemented in FastAPI backend and frontend web server:
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' http://localhost:* ws://localhost:* https://*; frame-ancestors 'none';`
- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(self), geolocation=()`

### 5.2. Data Protection & PHI Safeguards
- All patient records are bound to authenticated tenant IDs.
- Passwords hashed using Bcrypt with work factor 12.
- JWT tokens expire in 24 hours (`ACCESS_TOKEN_EXPIRE_MINUTES = 1440`).
- No sensitive patient data is written to client-side browser storage (only JWT token).
- Immutable audit log captures every read/write action with actor name, role, timestamp, and IP.
