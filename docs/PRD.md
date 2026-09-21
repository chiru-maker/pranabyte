# Product Requirements Document (PRD)
## AI-Powered Patient Case-Taking & Clinical Intelligence Platform (Pranabyte)

---

## 1. Product Overview & Vision
**Pranabyte** is an evidence-linked, speech-first clinical case-taking and decision-support intelligence platform built for modern healthcare environments. It transforms unstructured, multilingual patient narratives (spoken Hindi, Kannada, English, etc.) and scanned physical medical documents into structured, four-state clinical facts. 

Pranabyte eliminates repetitive clinical documentation overhead, identifies safety red flags and medication contradictions in real time, computes case completeness metrics, and synthesizes an AI Doctor Brief—all while strictly adhering to non-diagnostic clinical safety boundaries where every clinical fact is explicitly attributed and requires physician verification.

---

## 2. Problem Statement
Traditional outpatient clinical intake suffers from three critical systemic bottlenecks:
1. **Physician Documentation Burden & Burnout**: Physicians spend 40–50% of consultation time typing into rigid electronic health records (EHRs) rather than engaging directly with patients.
2. **Repetitive & Fatiguing Patient Interrogations**: Patients are asked the same routine demographic and medical history questions across visits, causing cognitive fatigue and omitting critical symptoms.
3. **Unreconciled Documented vs. Spoken Discrepancies**: Discrepancies between historical paper prescriptions and current patient medication adherence (e.g. self-discontinuation of antiplatelet therapy) frequently go undetected, creating major patient safety risks.

---

## 3. Target Users & User Personas

| Persona | Role | Core Goals | Pain Points Addressed |
| :--- | :--- | :--- | :--- |
| **Dr. Priya Sharma** | Senior Consultant Physician | Rapidly grasp patient context, review red flags, reconcile medications, finalize case notes in <60 seconds. | Drowning in repetitive typing, fragmented physical paper records, missing critical contraindications. |
| **Rahul Kumar** | Patient (58Y Male, Chronic CAD/T2D) | Communicate symptoms naturally in native language without filling complex digital forms. | Intimidated by complex medical jargon, struggles with small digital text, repeats past history repeatedly. |
| **Sister Ananya Rao** | Hospital Triage Nurse / Front Desk Staff | Queue patients, capture vitals, upload prior physical discharge summaries & prescriptions for OCR ingestion. | Manual data entry backlogs, lost paper prescriptions, incomplete triage history. |
| **Rajesh V.** | Hospital IT & Compliance Admin | Monitor audit logs, manage role-based access control (RBAC), ensure data isolation, track system performance. | Security vulnerabilities, unverified AI claims, lack of traceable audit trails. |

---

## 4. Product Goals & Non-Goals

### Product Goals
- **Zero-Form Voice Intake**: Empower patients to speak freely in their native language (English, Hindi, Kannada) and automatically extract structured symptoms, duration, severity, and timeline.
- **Adaptive Questioning Engine**: Dynamically compute what history is already documented in prior visits to avoid redundant questions while actively probing critical missing details.
- **Case Completeness Gauge**: Calculate real-time clinical completeness scores (0–100%) with actionable *"Ask Patient Now"* single-click follow-up questions.
- **Evidence-Linked Trust Architecture**: Color-code every clinical fact into 4 transparent states:
  - 🟢 **CONFIRMED** (Explicitly stated by patient during current intake)
  - 🔵 **DOCUMENTED** (Extracted from verified prior prescriptions/lab records)
  - 🟡 **UNCERTAIN** (Low OCR confidence or ambiguous phrasing requiring clarification)
  - 🔴 **CONFLICTING** (Direct discrepancy between documented records and patient spoken statements)
- **AI Doctor Brief**: Generate concise, structured summaries with full clinician edit/sign-off controls.
- **Transparent Red-Flag Screening**: Screen for acute cardiopulmonary and toxicological red flags using deterministic clinical rules.
- **ABHA & FHIR R4 Interoperability**: Support Indian National Digital Health Mission (ABDM) identifiers and standard FHIR R4 Bundle exports.

### Non-Goals
- **Autonomous Medical Diagnosis**: Pranabyte does *not* diagnose diseases or prescribe treatment regimens autonomously. All outputs are assistive clinical decision support drafts.
- **Direct Patient Triage Replacement**: The system does not replace emergency medical triage or emergency medical personnel.
- **Silent Medical Record Overwrites**: The AI cannot silently alter or delete historical verified medical records.

---

## 5. Information Classification: Patient vs. AI vs. Doctor

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Patient-Reported Information (Spoken Voice / Corrections)│
│    - Unfiltered subjective narrative & symptom timeline     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AI-Extracted Information (Clinical Draft / 4 States)     │
│    - Non-diagnostic structured entities with source link    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Doctor-Verified Information (Final Legal Medical Record) │
│    - Clinician-approved, edited, or rejected facts          │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Core Functional Features

### 6.1. Multilingual Speech-to-Text & AI Intake
- Push-to-talk microphone with real-time waveform animation.
- Language support for English (`en-IN`), Hindi (`hi-IN`), and Kannada (`kn-IN`), designed with modular tokenizers for regional expansion (Tamil, Telugu, Bengali, Marathi).
- Elderly-friendly fallback with touch-select quick symptom chips and full text editability.

### 6.2. Adaptive Questioning & Question Avoidance
- Evaluates active facts against prior visit records.
- Automatically skips documented conditions (e.g., skips *"Do you have diabetes?"* if Type 2 Diabetes is documented in past records).
- Displays transparent avoided question badges explaining *why* a question was omitted.

### 6.3. Case Completeness Analyzer
- Evaluates clinical completeness across 5 core dimensions: Chief Complaint, Onset & Duration, Symptom Radiation & Severity, Current Medications, and Allergy Verification.
- Renders an interactive circular gauge and dynamic checklist with an immediate *"Ask Patient Now"* prompt.

### 6.4. Patient Case Journey
- Signature interactive visual timeline displaying the end-to-end evidence lifecycle:
  `Patient's Words` ➔ `AI Extraction` ➔ `Missing Info / Avoided Questions` ➔ `Patient Verification` ➔ `Doctor Verification` ➔ `Final Case & Follow-up Changes`.

### 6.5. AI Doctor Brief & One-Click Actions
- Generates structured SOAP-format summaries with explicit non-diagnostic attribution headers.
- Actions: **Copy to Clipboard**, **Edit Clinical Notes**, **Doctor Sign-Off & Finalize**, **Reject Draft**.

### 6.6. Previous Visit Comparison (Delta Engine)
- Tracks longitudinal clinical state changes:
  - 🆕 **New Symptoms** (e.g., retrosternal chest pain onset 3 days ago)
  - 🔄 **Changed Dosages / Adherence** (e.g., self-discontinued Aspirin 75mg)
  - 🟢 **Resolved Issues**
  - ⚪ **Unchanged Chronic Conditions** (e.g., Hypertension, Diabetes)

### 6.7. Red-Flag Screening & Contradiction Alerts
- Real-time heuristic safety checks (e.g., Chest pain + Dyspnea cluster + Aspirin cessation in diabetic patient triggers an immediate high-priority 12-lead ECG evaluation banner).
- Side-by-side contradiction resolution modal with *"Keep Documented"*, *"Accept Patient Statement"*, or *"Custom Edit"*.

---

## 7. Role-Based Access Control (RBAC)

| Role | Permissions |
| :--- | :--- |
| **Patient** | Register, submit informed consent, record voice intake, edit own transcript, review & confirm extracted symptoms. |
| **Doctor** | View assigned patient queue, review full case journey, verify/edit/reject clinical facts, resolve contradictions, generate AI Doctor Brief, finalize visits, export FHIR/PDF. |
| **Nurse / Staff** | Register patients, record vital signs, upload prescriptions and lab PDFs for OCR processing, manage OPD queue. |
| **Admin** | Manage users, view comprehensive audit logs, inspect API telemetry and AI hallucination guardrail metrics. |

---

## 8. Success Metrics (KPIs)
- **Consultation Documentation Time**: Reduction from average 8.5 minutes to < 2 minutes per patient.
- **Medication Discrepancy Detection**: 100% flag rate on unrecorded drug cessation.
- **Patient Intake Completion Rate**: > 92% successful voice completions across all supported languages.
- **Doctor Verification Adoption**: > 95% clinician sign-off on generated case briefs.
