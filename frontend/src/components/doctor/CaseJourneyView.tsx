import React from 'react';
import { Visit, Patient } from '../../types';
import { Mic, Cpu, HelpCircle, UserCheck, Stethoscope, FileCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CaseJourneyViewProps {
  patient: Patient;
  visit: Visit;
  onOpenBrief?: () => void;
}

export const CaseJourneyView: React.FC<CaseJourneyViewProps> = ({
  patient,
  visit,
  onOpenBrief
}) => {
  const steps = [
    {
      id: 1,
      name: "1. Patient's Spoken Words",
      icon: Mic,
      status: 'completed',
      detail: "Spoken intake in native tongue: 'Stopped aspirin 2 months ago, chest pain for 3 days...'",
      actor: 'Patient (Spoken Intake)'
    },
    {
      id: 2,
      name: "2. AI Entity Extraction",
      icon: Cpu,
      status: 'completed',
      detail: '7 clinical facts extracted across 4 information states (Confirmed, Documented, Uncertain, Conflicting).',
      actor: 'Pranabyte Extraction Engine'
    },
    {
      id: 3,
      name: "3. Adaptive Q&A & Avoidance",
      icon: HelpCircle,
      status: 'completed',
      detail: '12 redundant questions avoided based on prior Apollo Hospital records. Probed pain radiation.',
      actor: 'Adaptive Engine'
    },
    {
      id: 4,
      name: '4. Patient Self-Review',
      icon: UserCheck,
      status: visit.patient_confirmed ? 'completed' : 'active',
      detail: 'Patient reviewed extracted symptoms and confirmed timeline accuracy.',
      actor: 'Patient Self-Service'
    },
    {
      id: 5,
      name: '5. Clinician Verification',
      icon: Stethoscope,
      status: visit.doctor_verified ? 'completed' : 'active',
      detail: visit.doctor_verified
        ? 'Verified and signed off by Dr. Priya Sharma.'
        : 'In review: Clinician verifying facts and resolving medication discrepancy.',
      actor: 'Dr. Priya Sharma'
    },
    {
      id: 6,
      name: '6. Final FHIR Case & Follow-Up',
      icon: FileCheck,
      status: visit.doctor_verified ? 'completed' : 'pending',
      detail: 'Standard HL7 FHIR R4 Bundle serialized and archived to hospital EHR.',
      actor: 'Hospital EHR Integration'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Card */}
      <div className="paper-card p-6 border-terracotta/30 bg-[#f5eee1] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-400 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-terracotta tracking-wider">
              Signature Visualizer
            </span>
            <h2 className="text-xl font-serif font-bold text-ink">
              Patient Case Journey Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-parchment border border-parchment-400 text-ink">
            Visit Ref: {visit.visit_number}
          </span>
        </div>
        <p className="text-xs text-ink-charcoal leading-relaxed">
          Transparent, step-by-step lifecycle of patient health data from initial spoken complaint to final verified electronic medical record.
        </p>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <div
              key={step.id}
              className={`p-5 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-parchment border-[#86efac] shadow-warm-sm'
                  : isActive
                  ? 'bg-parchment border-terracotta shadow-warm ring-2 ring-terracotta/20'
                  : 'bg-parchment/60 border-parchment-400 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isDone
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : isActive
                      ? 'bg-terracotta text-white'
                      : 'bg-parchment-300 text-ink-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isDone
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : isActive
                      ? 'bg-terracotta-light text-terracotta'
                      : 'bg-parchment-300 text-ink-muted'
                  }`}
                >
                  {step.status}
                </span>
              </div>

              <h3 className="font-serif font-bold text-ink text-sm mb-1">{step.name}</h3>
              <p className="text-xs text-ink-charcoal leading-relaxed mb-3">{step.detail}</p>

              <div className="pt-2 border-t border-parchment-300 flex items-center justify-between text-[11px] text-ink-graphite font-medium">
                <span>Actor:</span>
                <span className="font-semibold text-ink">{step.actor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
