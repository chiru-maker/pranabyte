# Application Flow Document (APP_FLOW.md)
## AI-Powered Patient Case-Taking & Clinical Intelligence Platform (Pranabyte)

---

## 1. End-to-End System Role Flows

### 1.1. Public User / Landing Page Flow
```mermaid
graph TD
    A[Public Visitor] --> B[Editorial Landing Page /]
    B --> C[Explore Features & Security]
    B --> D[View Healthcare Privacy Policy /privacy-policy]
    B --> E[Launch Patient Intake]
    B --> F[Clinician / Staff Sign In]
    E --> G[Patient Registration / Consent]
    F --> H[Doctor or Staff Dashboard]
```

---

### 1.2. Patient Spoken Case-Taking Flow
```mermaid
graph TD
    P1[Patient Access / Self-Intake] --> P2[Step 1: Patient Identity / ABHA Verification]
    P2 --> P3[Step 2: Informed AI & Data Consent Screen]
    P3 --> P4[Step 3: Select Language: EN / HI / KN]
    P4 --> P5[Step 4: Zero-Form Push-to-Talk Voice Intake]
    P5 --> P6{Speech Captured?}
    P6 -- Yes --> P7[Web Speech Recognition / Interim Transcript]
    P6 -- No (Fallback/Elderly) --> P8[Quick Symptom Chips / Keyboard Edit]
    P7 --> P9[NLP Extraction & 4-State Fact Classifier]
    P8 --> P9
    P9 --> P10[Step 5: Adaptive Questioning - Avoids Known Facts]
    P10 --> P11[Step 6: Document / Prescription OCR Upload]
    P11 --> P12[Step 7: Patient Self-Review & Verification]
    P12 --> P13[Submit to Doctor Waiting Queue]
```

---

### 1.3. Doctor Clinical Review & Verification Flow
```mermaid
graph TD
    D1[Doctor Login] --> D2[Doctor Clinical Workstation]
    D2 --> D3[Select Patient from OPD Queue]
    D3 --> D4[Review Patient Case Journey]
    
    subgraph Clinical Decision Support & Verification
        D4 --> D5[1. Case Completeness Gauge - e.g. 85%]
        D5 --> D5A[Ask Patient Now for Missing Fields]
        D4 --> D6[2. Red-Flags Alert Banner]
        D4 --> D7[3. Contradiction Resolution Panel]
        D4 --> D8[4. 4-State Clinical Facts Grid]
        D8 --> D8A[Confirm / Edit / Mark Uncertain / Reject]
        D4 --> D9[5. Medical Timeline & Previous Visit Delta]
    end
    
    D5A --> D10[Generate AI Doctor Brief Draft]
    D6 --> D10
    D7 --> D10
    D8A --> D10
    D9 --> D10
    
    D10 --> D11[Doctor Edits / Approves Clinical Notes]
    D11 --> D12[Finalize Clinical Case & Sign Off]
    D12 --> D13[Export FHIR R4 Bundle / Download PDF Brief]
```

---

### 1.4. Hospital Staff / Nurse Triage Flow
```mermaid
graph TD
    N1[Nurse / Staff Login] --> N2[Staff Triage Dashboard]
    N2 --> N3[Search Patient via Name / Phone / ABHA]
    N3 -- Found Existing --> N4[Open Patient Profile & Check History]
    N3 -- New Patient --> N5[Quick Patient Registration]
    N4 --> N6[Record Vital Signs: BP, HR, SpO2, Temp, RR]
    N5 --> N6
    N6 --> N7[Upload Paper Rx / Lab Reports for OCR]
    N7 --> N8[Queue Patient for Doctor Consultation]
```

---

### 1.5. System Administrator Flow
```mermaid
graph TD
    A1[Admin Login] --> A2[Admin Control Station]
    A2 --> A3[User Management & Role Assignment]
    A2 --> A4[Immutable Audit Log Explorer]
    A2 --> A5[AI Inference Telemetry & Latency]
    A2 --> A6[FHIR Endpoint Health & Server Status]
```

---

## 2. Error & Exception Handling Flows

```mermaid
graph TD
    E1[User Action] --> E2{Error Condition Detected}
    E2 -- Microphone Permission Denied --> E3[Show Friendly In-App Message + Fallback to Touch Chips & Text Input]
    E2 -- Speech Recognition Not Supported --> E4[Activate Simulated Speech Demo & Keyboard Mode]
    E2 -- Network / API Error --> E5[Render Non-Blocking Toast + Retain Form Draft Locally]
    E2 -- Unauthenticated Request (401) --> E6[Redirect to Login with Session Expired Notice]
    E2 -- Unauthorized Role Access (403) --> E7[Display Role Mismatch Alert & Switch Role Option]
    E2 -- Low Confidence OCR (<70%) --> E8[Tag Fact as UNCERTAIN 🟡 for Doctor Verification]
    E2 -- Red-Flag Clinical Trigger --> E9[Elevate High-Priority Alert Banner with ECG Recommendation]
```
