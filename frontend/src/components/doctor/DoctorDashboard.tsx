import React, { useState } from 'react';
import { Patient, Visit, ClinicalFact, Contradiction, RedFlag, TimelineEvent } from '../../types';
import { EvidenceTrustView } from './EvidenceTrustView';
import { ContradictionAlerts } from './ContradictionAlerts';
import { RedFlagsPanel } from './RedFlagsPanel';
import { MedicalTimeline } from './MedicalTimeline';
import { VerificationModal } from './VerificationModal';
import { FhirExportModal } from './FhirExportModal';
import { CompletenessGauge } from '../common/CompletenessGauge';
import { DoctorBriefModal } from './DoctorBriefModal';
import { CaseJourneyView } from './CaseJourneyView';
import { VisitChangesPanel } from './VisitChangesPanel';
import { 
  User, Calendar, Stethoscope, FileCode, CheckCircle2, 
  Save, Sparkles, AlertTriangle, ShieldCheck, Download,
  Bot, Clock, History, Printer, ExternalLink, Activity
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
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(visit.doctor_notes || '');
  const [activeTab, setActiveTab] = useState<'case_sheet' | 'journey' | 'delta' | 'timeline'>('case_sheet');

  const handleOpenVerify = (fact: ClinicalFact) => {
    setSelectedFact(fact);
    setIsVerificationModalOpen(true);
  };

  const handleQuickVerify = (factId: string) => {
    onFactVerify(factId, 'confirmed');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn relative">
      {/* Patient Header Card */}
      <div className="paper-card p-6 border-parchment-400 shadow-warm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-terracotta text-white flex items-center justify-center text-xl font-serif font-bold shadow-warm">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-ink tracking-tight">
                  {patient.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-parchment border border-parchment-400 text-ink">
                  {patient.sex}, {patient.age}Y
                </span>
                {patient.is_existing && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#15803d] border border-[#86efac]">
                    Existing Hospital Record
                  </span>
                )}
                {visit.patient_confirmed && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#faede8] text-terracotta border border-terracotta/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-terracotta" /> Patient Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-graphite mt-1.5 font-medium">
                <span><strong>Patient ID:</strong> <span className="font-mono text-ink">{patient.patient_id_display}</span></span>
                <span>•</span>
                <span><strong>ABHA ID:</strong> <span className="font-mono text-terracotta font-semibold">{patient.abha_id || '91-8273-9912-0041'}</span></span>
                <span>•</span>
                <span><strong>Visit Ref:</strong> <span className="font-mono text-ink">{visit.visit_number}</span></span>
                <span>•</span>
                <span><strong>Phone:</strong> {patient.phone}</span>
              </div>
            </div>
          </div>

          {/* Action Hub Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBriefModalOpen(true)}
              className="btn-terracotta text-xs px-4 py-2 shadow-warm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Doctor Brief</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFhirModalOpen(true)}
              className="btn-secondary-paper text-xs px-3.5 py-2"
            >
              <FileCode className="w-3.5 h-3.5 text-terracotta" />
              <span>FHIR R4 Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Red Flags & Contradiction Alerts (High Clinical Priority) */}
      <RedFlagsPanel redFlags={redFlags} onRedFlagAction={onRedFlagAction} />
      <ContradictionAlerts contradictions={contradictions} onResolve={onContradictionResolve} />

      {/* Case Completeness Gauge */}
      <CompletenessGauge
        score={visit.completeness_score || 85}
        avoidedCount={visit.questions_avoided_count || 12}
        onAskPatientNow={(field) => {
          alert(`Triggered automated clinical probe for: "${field}"`);
        }}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-parchment-400 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('case_sheet')}
          className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
            activeTab === 'case_sheet'
              ? 'bg-terracotta text-white shadow-warm-sm'
              : 'btn-secondary-paper'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Evidence-Linked Case Sheet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('journey')}
          className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
            activeTab === 'journey'
              ? 'bg-terracotta text-white shadow-warm-sm'
              : 'btn-secondary-paper'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Patient Case Journey</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delta')}
          className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
            activeTab === 'delta'
              ? 'bg-terracotta text-white shadow-warm-sm'
              : 'btn-secondary-paper'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Previous Visit Comparison</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-terracotta text-white shadow-warm-sm'
              : 'btn-secondary-paper'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Medical Timeline</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'case_sheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EvidenceTrustView
              facts={facts}
              onOpenVerify={handleOpenVerify}
              onQuickVerify={handleQuickVerify}
            />
          </div>

          {/* Right Column: Doctor Notes & Finalization */}
          <div className="space-y-6">
            <div className="paper-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
                <h3 className="font-serif font-bold text-ink text-base">
                  Physician Final Clinical Notes
                </h3>
                <span className="text-[10px] font-bold text-terracotta uppercase">Legal Sign-Off</span>
              </div>

              <textarea
                rows={8}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Type physician assessment, clinical findings, prescription modifications, and follow-up advice..."
                className="w-full p-3 bg-white border border-parchment-400 rounded-2xl text-xs text-ink leading-relaxed focus:outline-none focus:border-terracotta"
              />

              <button
                type="button"
                onClick={() => onFinalizeCase(doctorNotes)}
                className="w-full btn-terracotta text-xs py-3 shadow-warm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify, Finalize & Sign Clinical Case</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'journey' && (
        <CaseJourneyView
          patient={patient}
          visit={visit}
          onOpenBrief={() => setIsBriefModalOpen(true)}
        />
      )}

      {activeTab === 'delta' && (
        <VisitChangesPanel patient={patient} visit={visit} />
      )}

      {activeTab === 'timeline' && (
        <MedicalTimeline timelineEvents={timelineEvents} />
      )}

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        fact={selectedFact}
        onVerify={onFactVerify}
      />

      <DoctorBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        patient={patient}
        visit={visit}
        onApproveAndSign={(brief) => {
          setDoctorNotes(brief);
          onFinalizeCase(brief);
        }}
      />

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
