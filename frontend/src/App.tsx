import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Plasma } from './components/ui/Plasma';
import { PatientRegistration } from './components/patient/PatientRegistration';
import { ConsentScreen } from './components/patient/ConsentScreen';
import { CaseTakingVoice } from './components/patient/CaseTakingVoice';
import { AdaptiveQuestionnaire } from './components/patient/AdaptiveQuestionnaire';
import { DocumentUpload } from './components/patient/DocumentUpload';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { Patient, Visit, ClinicalFact, Contradiction, RedFlag, TimelineEvent } from './types';

function MainApp() {
  const { role, switchRole } = useAuth();

  // Patient Intake States (1: Register, 2: Consent, 3: Voice, 4: Questions, 5: Upload, 6: Completed)
  const [patientStep, setPatientStep] = useState<number>(1);
  const [loadingVoice, setLoadingVoice] = useState(false);

  // Active Patient Data
  const [currentPatient, setCurrentPatient] = useState<Patient>({
    id: 'pat_rahul_01',
    patient_id_display: 'PAT-2026-0891',
    name: 'Rahul Kumar',
    age: 58,
    sex: 'Male',
    phone: '+91 98765 43210',
    abha_id: '91-8273-9912-0041',
    is_existing: true,
    created_at: new Date().toISOString()
  });

  const [currentVisit, setCurrentVisit] = useState<Visit>({
    id: 'visit_901',
    patient_id: 'pat_rahul_01',
    visit_number: 'VISIT-2026-904',
    chief_complaint: 'Chest pain for three days with intermittent breathlessness',
    status: 'waiting_doctor',
    completeness_score: 85,
    questions_asked_count: 3,
    questions_avoided_count: 12,
    ai_summary_draft: `### PATIENT CASE SUMMARY DRAFT\n*NOTICE: AI-generated clinical draft — requires clinician verification. Not a diagnosis.*\n\n**PATIENT:** Rahul Kumar | **AGE/SEX:** 58Y Male | **ID:** PAT-2026-0891 | **ABHA:** 91-8273-9912-0041\n\n---\n\n**1. CHIEF COMPLAINT:**\nCentral retrosternal chest pain for 3 days, accompanied by intermittent breathlessness on mild exertion.\n\n**2. CURRENT HISTORY & SYMPTOMS:**\n- Chest Pain: Moderate-Severe, onset 3 days ago, intermittent pressure.\n- Dyspnea / Breathlessness: Present on exertion.\n\n**3. PAST MEDICAL HISTORY:**\n- Type 2 Diabetes Mellitus [DOCUMENTED - Apollo Hospital 2024]\n- Essential Hypertension [DOCUMENTED - Apollo Hospital 2025]\n\n**4. MEDICATIONS & ADHERENCE:**\n- Tab. Metformin 500mg BD [DOCUMENTED - Active]\n- Tab. Amlodipine 5mg OD [DOCUMENTED - Active]\n- Tab. Ecosprin 75mg OD [🚨 CONFLICT: Documented Active vs Patient reports stopped 2 months ago]\n\n**5. ALLERGIES:**\n- Penicillin [DOCUMENTED - Severe hypersensitivity / cutaneous reaction]\n\n**6. SAFETY RED FLAGS & DISCREPANCIES:**\n- 🚨 Potential Red Flag: Acute chest pain + breathlessness cluster. Immediate 12-lead ECG recommended.\n- 🚨 Medication Conflict: Unsupervised Aspirin cessation in diabetic patient with chest discomfort.`,
    doctor_notes: '',
    doctor_verified: false,
    created_at: new Date().toISOString()
  });

  // Clinical Facts with 4 Information States
  const [facts, setFacts] = useState<ClinicalFact[]>([
    {
      id: 'f1',
      patient_id: 'pat_rahul_01',
      category: 'chief_complaint',
      key_name: 'Chief Complaint',
      value: 'Central chest pain for 3 days with breathlessness',
      status: 'CONFIRMED',
      source_citation: "Voice Transcript: 'I've been having chest pain for three days. Sometimes I feel breathless.'",
      confidence: 0.96,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f2',
      patient_id: 'pat_rahul_01',
      category: 'symptom',
      key_name: 'Chest Pain',
      value: 'Moderate to severe substernal pressure, intermittent',
      status: 'CONFIRMED',
      source_citation: "Voice Transcript: 'I've been having chest pain for three days'",
      confidence: 0.95,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f3',
      patient_id: 'pat_rahul_01',
      category: 'symptom',
      key_name: 'Breathlessness',
      value: 'Intermittent dyspnea on mild physical exertion',
      status: 'CONFIRMED',
      source_citation: "Voice Transcript: 'Sometimes I feel breathless'",
      confidence: 0.94,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f4',
      patient_id: 'pat_rahul_01',
      category: 'past_history',
      key_name: 'Type 2 Diabetes Mellitus',
      value: 'Diagnosed 2024, on oral hypoglycemics (Metformin)',
      status: 'DOCUMENTED',
      source_citation: 'Apollo Hospital Prescription (14-Aug-2026)',
      confidence: 0.99,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f5',
      patient_id: 'pat_rahul_01',
      category: 'past_history',
      key_name: 'Essential Hypertension',
      value: 'Stage 1 Hypertension, on Amlodipine 5mg',
      status: 'DOCUMENTED',
      source_citation: 'Apollo Hospital Prescription (14-Aug-2026)',
      confidence: 0.97,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f6',
      patient_id: 'pat_rahul_01',
      category: 'allergy',
      key_name: 'Penicillin Allergy',
      value: 'Severe cutaneous hypersensitivity / rash',
      status: 'DOCUMENTED',
      source_citation: 'Prior Medical Record / Rx (14-Aug-2026)',
      confidence: 0.96,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f7',
      patient_id: 'pat_rahul_01',
      category: 'medication',
      key_name: 'Metformin 500mg',
      value: '1 tab twice daily after food [Active]',
      status: 'DOCUMENTED',
      source_citation: 'Apollo Hospital Prescription (14-Aug-2026)',
      confidence: 0.98,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f8',
      patient_id: 'pat_rahul_01',
      category: 'medication',
      key_name: 'Amlodipine Dosage',
      value: 'Tab. Amlodipine 5mg? (Morning) — Low OCR clarity',
      status: 'UNCERTAIN',
      source_citation: 'OCR scan region with 72% confidence',
      confidence: 0.72,
      doctor_verified: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'f9',
      patient_id: 'pat_rahul_01',
      category: 'medication',
      key_name: 'Aspirin 75mg Active Status',
      value: 'Prescription lists Ecosprin 75mg ACTIVE vs Patient reports STOPPED 2 months ago',
      status: 'CONFLICTING',
      source_citation: 'Discrepancy between Apollo Rx 14-Aug-2026 and Spoken Intake 21-Sep-2026',
      confidence: 0.94,
      doctor_verified: false,
      created_at: new Date().toISOString()
    }
  ]);

  const [contradictions, setContradictions] = useState<Contradiction[]>([
    {
      id: 'c1',
      patient_id: 'pat_rahul_01',
      category: 'medication_conflict',
      title: 'Medication Discrepancy: Aspirin (Ecosprin) 75mg',
      source_a_description: 'Apollo Hospital Prescription (14-Aug-2026)',
      source_a_value: 'Tab. Ecosprin 75mg OD — Active Daily',
      source_b_description: 'Patient Spoken Intake (21-Sep-2026)',
      source_b_value: "Patient stated: 'I stopped taking aspirin two months ago.'",
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    }
  ]);

  const [redFlags, setRedFlags] = useState<RedFlag[]>([
    {
      id: 'rf1',
      patient_id: 'pat_rahul_01',
      rule_name: 'acute_coronary_cluster',
      severity: 'HIGH',
      title: 'Cardiopulmonary Red Flag: Chest Pain + Breathlessness',
      trigger_criteria: 'Substernal chest discomfort for 3 days with concurrent dyspnea in a known diabetic/hypertensive patient with recent aspirin discontinuation.',
      recommendation: 'Potential red flag detected — urgent clinician review and 12-lead ECG evaluation recommended.',
      status: 'UNACKNOWLEDGED',
      created_at: new Date().toISOString()
    }
  ]);

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 't1',
      patient_id: 'pat_rahul_01',
      event_date: '2024',
      event_title: 'Type 2 Diabetes Documented',
      event_description: 'Diagnosed at Apollo Clinic. Started on Metformin 500mg.',
      source_type: 'prior_record',
      status: 'DOCUMENTED',
      confidence: 0.98,
      sort_order: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 't2',
      patient_id: 'pat_rahul_01',
      event_date: '2025',
      event_title: 'Hypertension & Daily Aspirin Started',
      event_description: 'BP 148/94. Initiated on Amlodipine 5mg and Aspirin 75mg.',
      source_type: 'prior_record',
      status: 'DOCUMENTED',
      confidence: 0.96,
      sort_order: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 't3',
      patient_id: 'pat_rahul_01',
      event_date: '14-Aug-2026',
      event_title: 'Prescription Uploaded',
      event_description: 'Apollo Cardiology OPD record. Metformin, Aspirin, Amlodipine active.',
      source_type: 'prescription',
      status: 'DOCUMENTED',
      confidence: 0.99,
      sort_order: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 't4',
      patient_id: 'pat_rahul_01',
      event_date: 'July 2026 (~2 Months Ago)',
      event_title: 'Patient Stopped Aspirin',
      event_description: 'Self-reported stoppage due to mild gastric irritation without physician consult.',
      source_type: 'voice_intake',
      status: 'CONFLICTING',
      confidence: 0.94,
      sort_order: 4,
      created_at: new Date().toISOString()
    },
    {
      id: 't5',
      patient_id: 'pat_rahul_01',
      event_date: '18-Sep-2026 (3 Days Ago)',
      event_title: 'Chest Pain & Breathlessness Onset',
      event_description: 'Substernal chest pain and shortness of breath on exertion.',
      source_type: 'voice_intake',
      status: 'CONFIRMED',
      confidence: 0.95,
      sort_order: 5,
      created_at: new Date().toISOString()
    },
    {
      id: 't6',
      patient_id: 'pat_rahul_01',
      event_date: 'Today',
      event_title: 'Current Consultation & Smart Intake',
      event_description: 'Voice case taking completed. 12 questions avoided using known history. Red flags active.',
      source_type: 'doctor_note',
      status: 'CONFIRMED',
      confidence: 1.0,
      sort_order: 6,
      created_at: new Date().toISOString()
    }
  ]);

  // Adaptive Question State
  const [currentAdaptiveQuestion, setCurrentAdaptiveQuestion] = useState(
    'Does the pain spread or radiate to your left arm, shoulder, jaw, neck, or upper back?'
  );
  const [avoidedReasons, setAvoidedReasons] = useState<string[]>([
    "✓ 'Do you have diabetes?' skipped — Already confirmed from previous records (Type 2 Diabetes Mellitus)",
    "✓ 'Do you have high blood pressure?' skipped — Already documented in records (Essential Hypertension)",
    "✓ 'Do you have known drug allergies?' streamlined — Documented Penicillin allergy found"
  ]);

  const handleLoadDemoPatient = () => {
    switchRole('doctor');
  };

  const handleVoiceProcess = (transcript: string) => {
    setLoadingVoice(true);
    setTimeout(() => {
      setLoadingVoice(false);
      setPatientStep(4);
    }, 800);
  };

  const handleAnswerSubmit = (answer: string) => {
    // Add answer to facts
    const newFact: ClinicalFact = {
      id: `f_${Date.now()}`,
      patient_id: currentPatient.id,
      category: 'symptom',
      key_name: 'Pain Radiation',
      value: answer,
      status: 'CONFIRMED',
      source_citation: `Patient answer: "${answer}"`,
      confidence: 0.98,
      doctor_verified: false,
      created_at: new Date().toISOString()
    };
    setFacts((prev) => [newFact, ...prev]);
    setCurrentAdaptiveQuestion('');
  };

  const handleFactVerify = (factId: string, action: string, editedValue?: string, notes?: string) => {
    setFacts((prev) =>
      prev.map((f) => {
        if (f.id === factId) {
          return {
            ...f,
            doctor_verified: true,
            doctor_action: action,
            doctor_notes: notes,
            value: editedValue || f.value,
            status: action === 'confirmed' ? 'CONFIRMED' : action === 'marked_uncertain' ? 'UNCERTAIN' : action === 'rejected' ? 'REJECTED' : 'CONFIRMED'
          };
        }
        return f;
      })
    );
  };

  const handleContradictionResolve = (id: string, action: string, notes: string) => {
    setContradictions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action as any, resolution_notes: notes } : c))
    );
  };

  const handleRedFlagAction = (id: string, action: string) => {
    setRedFlags((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action as any } : r))
    );
  };

  const handleFinalizeCase = (notes: string) => {
    setCurrentVisit((prev) => ({
      ...prev,
      doctor_notes: notes,
      doctor_verified: true,
      status: 'completed'
    }));
    alert('Case successfully verified and finalized by Dr. Priya Sharma!');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 relative overflow-x-hidden">
      {/* Background Plasma Shader Component from React Bits */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <Plasma
          color="#0284c7"
          speed={0.5}
          direction="forward"
          scale={1.1}
          opacity={0.35}
          mouseInteractive={true}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onLoadDemo={handleLoadDemoPatient} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Patient Role Views */}
          {role === 'patient' && (
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="max-w-xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-400 mb-4 px-2">
                <span className={patientStep >= 1 ? 'text-cyan-400 font-bold' : ''}>1. Registration</span>
                <span>→</span>
                <span className={patientStep >= 2 ? 'text-cyan-400 font-bold' : ''}>2. Consent</span>
                <span>→</span>
                <span className={patientStep >= 3 ? 'text-cyan-400 font-bold' : ''}>3. Spoken Intake</span>
                <span>→</span>
                <span className={patientStep >= 4 ? 'text-cyan-400 font-bold' : ''}>4. Adaptive Q&A</span>
                <span>→</span>
                <span className={patientStep >= 5 ? 'text-cyan-400 font-bold' : ''}>5. OCR Upload</span>
              </div>

              {patientStep === 1 && (
                <PatientRegistration
                  onPatientCreated={(p) => {
                    setCurrentPatient(p);
                    setPatientStep(2);
                  }}
                  onSelectDemoPatient={() => {
                    setPatientStep(2);
                  }}
                />
              )}

              {patientStep === 2 && (
                <ConsentScreen
                  patient={currentPatient}
                  onConsentGiven={() => setPatientStep(3)}
                  onDecline={() => setPatientStep(1)}
                  onBack={() => setPatientStep(1)}
                />
              )}

              {patientStep === 3 && (
                <CaseTakingVoice
                  onProcessTranscript={handleVoiceProcess}
                  loading={loadingVoice}
                />
              )}

              {patientStep === 4 && (
                <AdaptiveQuestionnaire
                  currentQuestion={currentAdaptiveQuestion}
                  category="symptom_detail"
                  avoidedReasons={avoidedReasons}
                  avoidedCount={12}
                  onAnswerSubmit={handleAnswerSubmit}
                  onFinishCase={() => setPatientStep(5)}
                  isComplete={!currentAdaptiveQuestion}
                />
              )}

              {patientStep === 5 && (
                <DocumentUpload
                  onDocumentProcessed={() => {}}
                  onProceedToDoctor={() => switchRole('doctor')}
                />
              )}
            </div>
          )}

          {/* Doctor Role View */}
          {role === 'doctor' && (
            <DoctorDashboard
              patient={currentPatient}
              visit={currentVisit}
              facts={facts}
              contradictions={contradictions}
              redFlags={redFlags}
              timelineEvents={timelineEvents}
              onFactVerify={handleFactVerify}
              onContradictionResolve={handleContradictionResolve}
              onRedFlagAction={handleRedFlagAction}
              onFinalizeCase={handleFinalizeCase}
            />
          )}

          {/* Hospital Staff Role View */}
          {role === 'staff' && (
            <StaffDashboard
              onSelectPatient={(p) => {
                setCurrentPatient(p);
                switchRole('doctor');
              }}
              onNewPatient={() => {
                switchRole('patient');
                setPatientStep(1);
              }}
            />
          )}
        </main>

        <footer className="relative z-10 glass-panel border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <span>Patient Story Engine • Evidence-Linked AI Healthcare Assistant</span>
            <span>Non-Diagnostic Clinical Decision Support Architecture • Built for Indian Hospitals</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
