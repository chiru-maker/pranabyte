# Patient Story Engine — Architectural Specification

## 1. Executive Summary & Core USP
Patient Story Engine is not a generic medical chatbot. It is a clinician-verifiable clinical intelligence and intake system designed specifically for Indian hospitals.

### The Three Core Innovation Pillars
1. **Context ("Ask Less, Know More")**: Reuses documented patient facts from past visits, prescriptions, and lab tests to eliminate redundant questions.
2. **Evidence**: Every clinical fact is strictly tied to an immutable source (Voice transcript quote, uploaded PDF bounding box, or historical EMR record).
3. **Trust & Safety**: Four-state lifecycle (`🟢 CONFIRMED`, `🔵 DOCUMENTED`, `🟡 UNCERTAIN`, `🔴 CONFLICTING`), contradiction detection, and predefined safety red flags without ever diagnosing or replacing the clinician.

---

## 2. Information Lifecycle & 4 Fact States

```
[ Patient Voice / OCR Doc / Prior Record ]
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│               CLINICAL FACTS ENGINE                    │
│                                                        │
│  🟢 CONFIRMED    : Explicitly spoken by patient/doctor │
│  🔵 DOCUMENTED   : Extracted from prior hospital Rx    │
│  🟡 UNCERTAIN    : Low OCR confidence (<80%) or blurry │
│  🔴 CONFLICTING  : Two distinct sources disagree       │
└────────────────────────────────────────────────────────┘
                   │
                   ▼
       [ Doctor Verification Panel ]
      (Confirm, Edit, Reject, Notes)
                   │
                   ▼
    [ HL7 FHIR R4 Interoperable Bundle ]
```

---

## 3. Contradiction & Safety Red-Flag Guardrails
- **Contradiction Detector**: Detects cross-source discrepancies (e.g. Aspirin 75mg active in prescription vs. patient statement *"I stopped taking aspirin 2 months ago"*). The engine flags the conflict and leaves final resolution to the physician.
- **Red-Flag Engine**: Evaluates high-acuity symptom clusters (e.g. acute chest pain + breathlessness in a diabetic profile) and alerts the team for urgent ECG review without generating a medical diagnosis.
- **FHIR R4 Ready**: Directly translates internal models into `Patient`, `Encounter`, `Condition`, `MedicationStatement`, and `AllergyIntolerance` bundles.
