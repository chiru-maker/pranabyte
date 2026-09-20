import React, { useState } from 'react';
import { Patient, Visit, ClinicalFact, Contradiction, RedFlag, TimelineEvent } from '../../types';
import { EvidenceTrustView } from './EvidenceTrustView';
import { ContradictionAlerts } from './ContradictionAlerts';
import { RedFlagsPanel } from './RedFlagsPanel';
import { MedicalTimeline } from './MedicalTimeline';
import { VerificationModal } from './VerificationModal';
import { FhirExportModal } from './FhirExportModal';
import { CompletenessGauge } from '../common/CompletenessGauge';
import { 
  User, Calendar, Stethoscope, FileCode, CheckCircle2, 
  Save, Sparkles, AlertTriangle, ShieldCheck, Download
} from 'lucide-react';

interface DoctorDashboardProps {
  patient: Patient;
  visit: Visit;
  facts: ClinicalFact[];
  contradictions: Contradiction[];
  redFlags: RedFlag[];
  timelineEvents: TimelineEvent[];
  onFactVerify: (factId: string, action: string, editedValue?: string, notes?: string) => void;
  onContradictionResolve: (id: string, action: string, notes: string) => void;
  onRedFlagAction: (id: string, action: string) => void;
  onFinalizeCase: (doctorNotes: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patient,
  visit,
  facts,
  contradictions,
  redFlags,
  timelineEvents,
  onFactVerify,
  onContradictionResolve,
  onRedFlagAction,
  onFinalizeCase
}) => {
  const [selectedFact, setSelectedFact] = useState<ClinicalFact | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(visit.doctor_notes || '');
  const [activeTab, setActiveTab] = useState<'case_sheet' | 'timeline' | 'ai_summary'>('case_sheet');

  const handleOpenVerify = (fact: ClinicalFact) => {
    setSelectedFact(fact);
    setIsVerificationModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Patient Header Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{patient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {patient.sex}, {patient.age}Y
                </span>
                {patient.is_existing && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Existing Hospital Record
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span><strong>Patient ID:</strong> <span className="font-mono text-slate-200">{patient.patient_id_display}</span></span>
                <span>•</span>
                <span><strong>ABHA ID:</strong> <span className="font-mono text-cyan-400">{patient.abha_id || '91-8273-9912-0041'}</span></span>
                <span>•</span>
                <span><strong>Visit No:</strong> <span className="font-mono text-slate-200">{visit.visit_number}</span></span>
                <span>•</span>
                <span><strong>Phone:</strong> {patient.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFhirModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold transition"
            >
              <FileCode className="w-4 h-4" />
              <span>Export FHIR R4 Bundle</span>
            </button>
            <button
              type="button"
              onClick={() => onFinalizeCase(doctorNotes)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Finalize Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Alerts Grid (Red Flags & Contradictions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RedFlagsPanel
          redFlags={redFlags}
          onAction={onRedFlagAction}
        />
        <ContradictionAlerts
          contradictions={contradictions}
          onResolve={onContradictionResolve}
        />
      </div>

      {/* Completeness & Navigation Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CompletenessGauge
            score={visit.completeness_score || 85}
            avoidedCount={visit.questions_avoided_count || 12}
          />
        </div>

        <div className="lg:col-span-2 glass-card p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Consultation Navigation
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('case_sheet')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'case_sheet'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🏥 Structured Case & Evidence View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'timeline'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ⏱️ Chronological Story Timeline ({timelineEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai_summary')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'ai_summary'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ✨ AI Case Summary Draft
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Logged in as: <strong className="text-white">Dr. Priya Sharma (Cardiology)</strong></span>
            <span className="text-cyan-400 font-mono">Verified Clinician Authority</span>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'case_sheet' && (
        <EvidenceTrustView
          facts={facts}
          contradictions={contradictions}
          onFactClick={handleOpenVerify}
        />
      )}

      {activeTab === 'timeline' && (
        <MedicalTimeline events={timelineEvents} />
      )}

      {activeTab === 'ai_summary' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                AI-Generated Clinical Summary Draft
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
              ⚠️ Requires Clinician Verification
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
            {visit.ai_summary_draft || 'Generating synthesized case summary...'}
          </div>

          {/* Doctor Clinical Notes & Rx */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Doctor Clinical Notes, Diagnosis & Prescription
            </label>
            <textarea
              rows={3}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="e.g. Advised immediate 12-lead ECG and Troponin I. Restarted antiplatelet therapy under observation..."
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Fact Verification Modal */}
      <VerificationModal
        fact={selectedFact}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={onFactVerify}
      />

      {/* FHIR Export Modal */}
      <FhirExportModal
        isOpen={isFhirModalOpen}
        onClose={() => setIsFhirModalOpen(false)}
        patient={patient}
        visit={visit}
        facts={facts}
      />
    </div>
  );
};
