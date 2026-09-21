import React, { useState } from 'react';
import { Patient, Visit, ClinicalFact, Contradiction, RedFlag, TimelineEvent } from '../../types';
import { EvidenceTrustView } from './EvidenceTrustView';
import { ContradictionAlerts } from './ContradictionAlerts';
import { RedFlagsPanel } from './RedFlagsPanel';
import { MedicalTimeline } from './MedicalTimeline';
import { VerificationModal } from './VerificationModal';
import { FhirExportModal } from './FhirExportModal';
import { CompletenessGauge } from '../common/CompletenessGauge';
import { DoctorCopilotDrawer } from './DoctorCopilotDrawer';
import { DoctorBriefModal } from './DoctorBriefModal';
import { CaseJourneyView } from './CaseJourneyView';
import { VisitChangesPanel } from './VisitChangesPanel';
import { 
  User, Calendar, Stethoscope, FileCode, CheckCircle2, 
  Save, Sparkles, AlertTriangle, ShieldCheck, Download,
  Bot, Clock, History, Printer, ExternalLink
} from 'lucide-react';
import { API_BASE } from '../../api/client';

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
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(visit.doctor_notes || '');
  const [activeTab, setActiveTab] = useState<'case_sheet' | 'journey' | 'delta' | 'timeline' | 'ai_summary'>('case_sheet');

  const handleOpenVerify = (fact: ClinicalFact) => {
    setSelectedFact(fact);
    setIsVerificationModalOpen(true);
  };

  const handleOpenPrintableCaseSheet = () => {
    window.open(`${API_BASE}/doctor/case-sheet-html/${patient.id}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn relative">
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
                {visit.patient_confirmed && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" /> Patient Confirmed
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

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBriefModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition shadow"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>30-Sec Doctor Brief</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition shadow"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Copilot</span>
            </button>
            <button
              type="button"
              onClick={handleOpenPrintableCaseSheet}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Print standard hospital OPD case sheet"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print Case Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFhirModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold transition"
            >
              <FileCode className="w-4 h-4" />
              <span>FHIR R4</span>
            </button>
            <button
              type="button"
              onClick={() => onFinalizeCase(doctorNotes)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Finalize</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Clinical Workspace Navigation
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('case_sheet')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'case_sheet'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🏥 Evidence-Linked Facts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('journey')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'journey'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🚀 Case Journey
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('delta')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'delta'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                🔄 What's Changed
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'timeline'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ⏱️ Timeline ({timelineEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai_summary')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'ai_summary'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ✨ AI Summary Draft
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

      {activeTab === 'journey' && (
        <CaseJourneyView
          patientName={patient.name}
          patientId={patient.id}
          visitNumber={visit.visit_number}
        />
      )}

      {activeTab === 'delta' && (
        <VisitChangesPanel
          patientId={patient.id}
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

      {/* Floating Copilot Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 hover:scale-105 text-white rounded-2xl shadow-2xl shadow-cyan-500/40 flex items-center gap-2 text-xs font-bold transition-all border border-cyan-400/30"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden md:inline">Doctor AI Copilot</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Doctor Copilot Side Drawer */}
      <DoctorCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        patientId={patient.id}
        patientName={patient.name}
      />

      {/* 30-Second Doctor Brief Modal */}
      <DoctorBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        patientId={patient.id}
      />

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
