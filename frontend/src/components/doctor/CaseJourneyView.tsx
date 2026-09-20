import React from 'react';
import { 
  UserCheck, 
  Mic, 
  FileSearch, 
  GitCompare, 
  ShieldAlert, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'pending';
  icon: React.ElementType;
  time: string;
  details: string;
  metrics?: { label: string; value: string };
}

interface CaseJourneyViewProps {
  patientName: string;
  patientId: string;
  visitNumber: string;
  onNavigateTab?: (tab: string) => void;
}

export const CaseJourneyView: React.FC<CaseJourneyViewProps> = ({
  patientName,
  patientId,
  visitNumber,
  onNavigateTab
}) => {
  const stages: Stage[] = [
    {
      id: 'consent',
      title: '1. Registration & Consent',
      subtitle: 'ABHA Linkage & AI Disclosure',
      status: 'completed',
      icon: UserCheck,
      time: '09:15 AM',
      details: 'ABHA 91-8273-9912-0041 linked. Consent v1.0.0 signed with explicit AI assistance disclosure.',
      metrics: { label: 'Consent Status', value: 'VERIFIED' }
    },
    {
      id: 'intake',
      title: '2. Multimodal Intake',
      subtitle: 'Voice & Document OCR',
      status: 'completed',
      icon: Mic,
      time: '09:18 AM',
      details: 'Patient voice recorded in Hindi/English. Apollo Prescription OCR parsed with 98% confidence.',
      metrics: { label: 'Questions Avoided', value: '12 Avoided' }
    },
    {
      id: 'extraction',
      title: '3. Evidence Linking',
      subtitle: '4-State Fact Tagging',
      status: 'completed',
      icon: FileSearch,
      time: '09:19 AM',
      details: '8 clinical facts extracted and tagged with 🟢 CONFIRMED, 🔵 DOCUMENTED, or 🟡 UNCERTAIN provenance.',
      metrics: { label: 'Facts Extracted', value: '8 Facts' }
    },
    {
      id: 'conflicts',
      title: '4. Conflict & Safety Scan',
      subtitle: 'Contradiction & Red-Flags',
      status: 'completed',
      icon: GitCompare,
      time: '09:20 AM',
      details: 'Detected Aspirin discontinuation mismatch & Cardiopulmonary symptom cluster.',
      metrics: { label: 'Alerts Active', value: '1 Conflict / 1 Flag' }
    },
    {
      id: 'doctor',
      title: '5. Doctor Verification',
      subtitle: 'Physician Review & Override',
      status: 'active',
      icon: Stethoscope,
      time: 'Current Stage',
      details: 'Dr. Priya Sharma reviewing 30-Second Brief, verifying facts, and resolving discrepancy.',
      metrics: { label: 'EHR Readiness', value: '92% Complete' }
    },
    {
      id: 'export',
      title: '6. FHIR R4 Finalization',
      subtitle: 'Interoperable EHR Export',
      status: 'pending',
      icon: CheckCircle2,
      time: 'Next',
      details: 'Generate signed FHIR R4 Bundle and printable OPD Case Sheet for hospital EHR.',
      metrics: { label: 'Standard', value: 'ABDM / FHIR R4' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
              Live Pipeline Tracking
            </span>
            <span className="text-xs text-slate-400">Visit #{visitNumber}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Clinical Journey & Data Provenance: <span className="text-cyan-400">{patientName}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time step-by-step audit trace from patient voice intake to final clinician sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Pipeline Velocity</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5" /> 4.2 Mins Total
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          const isCompleted = stg.status === 'completed';
          const isActive = stg.status === 'active';

          return (
            <div
              key={stg.id}
              className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-b from-cyan-950/50 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : isCompleted
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-60'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {stg.status}
                  </span>
                </div>

                <h4 className="font-bold text-white text-base">{stg.title}</h4>
                <p className="text-xs text-cyan-400/90 font-medium">{stg.subtitle}</p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{stg.details}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {stg.time}
                </span>
                {stg.metrics && (
                  <span className="font-mono text-cyan-300 font-bold text-[11px] bg-slate-800 px-2 py-0.5 rounded">
                    {stg.metrics.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
