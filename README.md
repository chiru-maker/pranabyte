# 🩺 Patient Story Engine

> **"An evidence-linked patient story that shows the doctor exactly where every important clinical fact came from, detects contradictions between sources, identifies uncertain information, reconstructs the patient's medical timeline, and asks fewer questions when information is already available."**

Built for Indian hospitals, triaging OPD queues, and Smart India Hackathon (SIH) demonstrations.

---

## 🌟 Key Features & Core USP

1. **🧠 Context ("Ask Less, Know More" Engine)**:
   - Detects previously known diagnoses (e.g. Type 2 Diabetes, Hypertension) from past records.
   - Suppresses redundant questions (e.g. skips *"Do you have diabetes?"* and instead asks *"Are you currently taking your diabetes medications?"*).
   - Live counter shows: **"12 questions avoided using existing records"**.

2. **🔗 Evidence-Linked Clinical Facts (4 States)**:
   - 🟢 **CONFIRMED**: Spoken by patient or verified by clinician.
   - 🔵 **DOCUMENTED**: Extracted from previous hospital prescriptions/reports.
   - 🟡 **UNCERTAIN**: Blurry OCR or ambiguous text requiring verification.
   - 🔴 **CONFLICTING**: Sources disagree (e.g. Prescription lists active Aspirin vs. Patient states stopped 2 months ago).

3. **⚠️ Contradiction & Safety Red-Flag Guardrails**:
   - Automated detection of drug adherence and allergy conflicts.
   - Safety red flag alerts for acute cardiopulmonary symptom clusters (Chest pain + breathlessness) with clinician action controls.
   - Non-diagnostic clinical decision support only.

4. **⏱️ Chronological Medical Timeline**:
   - Reconstructs the patient's health milestones across years and visits.
   - 1-click drill-down to inspect original evidence citations.

5. **📋 Trust View vs. Summary View**:
   - Toggle between a clean case sheet and an interactive evidence mode where every sentence links to its primary source transcript or document.

6. **🌐 FHIR R4 Bundle Export**:
   - Export standard HL7 FHIR JSON bundles (`Patient`, `Encounter`, `Condition`, `MedicationStatement`, `AllergyIntolerance`).

7. **✨ Plasma WebGL Shader Background**:
   - Integrated `<Plasma />` component from React Bits (`ogl`) for a sleek, modern visual aesthetic.

8. **🗣️ Multilingual Support**:
   - English, हिन्दी (Hindi), and ಕನ್ನಡ (Kannada).

---

## 🚀 Quick Start Guide (Windows PowerShell)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

---

### Step 1: Clone or Navigate to Project Directory
```powershell
cd c:\Users\chiru\Desktop\pranabyte
```

---

### Step 2: Set up Backend (Python FastAPI)

1. Open a PowerShell terminal:
```powershell
# Create Python virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r backend/requirements.txt

# Seed demo data (Rahul Kumar, 58M with full flagship case)
python backend/seed_data.py
```

2. Start the Backend API Server:
```powershell
# Run with uvicorn
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: **http://127.0.0.1:8000/docs**

---

### Step 3: Set up Frontend (React + TypeScript + Tailwind)

1. Open a second PowerShell terminal:
```powershell
cd c:\Users\chiru\Desktop\pranabyte\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser at: **http://localhost:3000**

---

## 🎯 Flagship Demo Walkthrough (SIH Presentation)

1. **Open http://localhost:3000**
2. Click **"Load Flagship Demo"** in the top navigation bar.
3. Observe:
   - **Patient Header**: Rahul Kumar (58Y Male, ABHA: 91-8273-9912-0041).
   - **Red-Flag Alert**: Chest pain + Breathlessness detected.
   - **Contradiction Alert**: Prescription lists Aspirin 75mg active vs. Patient reports stopped 2 months ago.
   - **Completeness Gauge**: 85% with 12 redundant questions avoided.
   - **Evidence View**: Click any clinical fact to inspect the exact transcript quote or prescription citation.
   - **Verify Actions**: Doctor confirms/edits the medication status and adds clinical notes.
   - **FHIR Export**: Click *"Export FHIR R4 Bundle"* to view and download compliant HL7 FHIR JSON.

---

## 📁 Project Structure

```
pranabyte/
├── backend/
│   ├── app/
│   │   ├── config.py             # Settings & Environment variables
│   │   ├── database.py           # Database connection (SQLite / Postgres)
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── auth.py               # JWT Auth & role permissions
│   │   ├── main.py               # FastAPI application & router mounting
│   │   ├── services/
│   │   │   ├── ai_service.py     # Modular LLM (Gemini / OpenAI / NLP fallback)
│   │   │   ├── ocr_service.py    # Document OCR & entity extractor
│   │   │   ├── questioning.py    # Adaptive Ask-Less Know-More engine
│   │   │   ├── contradiction.py  # Contradiction detection engine
│   │   │   ├── red_flags.py      # Clinical safety red-flag engine
│   │   │   ├── timeline.py       # Chronological story timeline builder
│   │   │   ├── fhir.py           # HL7 FHIR R4 exporter
│   │   │   └── audit.py          # Audit trail logger
│   │   └── routers/              # Modular API endpoints
│   ├── requirements.txt
│   ├── seed_data.py              # Pre-seeded Rahul Kumar demo scenario
│   └── tests/                    # Automated pytest suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/Plasma.tsx     # React Bits WebGL Plasma background
│   │   │   ├── patient/          # Voice intake, Consent, Adaptive Q&A, OCR
│   │   │   ├── doctor/           # Evidence View, Contradictions, Red Flags, Timeline
│   │   │   └── staff/            # Triage queue dashboard
│   │   ├── context/              # Auth & Language (EN/HI/KN)
│   │   ├── types/                # TypeScript interfaces
│   │   ├── api/                  # API client
│   │   └── App.tsx               # Main application orchestration
│   └── package.json
├── database/
│   ├── schema.sql                # Pure SQL DDL
│   └── seed.sql                  # Seed data SQL
├── docs/
│   ├── ARCHITECTURE.md           # System architecture & 4 fact states
│   └── API_SPEC.md               # API endpoints
├── start_backend.ps1             # 1-click Windows backend runner
└── start_frontend.ps1            # 1-click Windows frontend runner
```

---

## 🔒 Security & AI Safety Guardrails
- **No Direct Medical Diagnoses**: The AI assistant structures history and highlights inconsistencies. Final diagnosis and prescriptions are made solely by the treating doctor.
- **Role-Based Access**: Patient, Doctor, and Hospital Staff roles.
- **Zero API Key Exposure**: All LLM and OCR credentials are strictly handled on the backend.
- **Audit Logging**: Immutable action logging for compliance and clinical safety.
