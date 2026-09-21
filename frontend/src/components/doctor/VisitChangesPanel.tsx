import React from 'react';
import { History, PlusCircle, AlertTriangle, CheckCircle2, ArrowRight, MinusCircle, RefreshCw } from 'lucide-react';
import { Patient, Visit } from '../../types';

interface VisitChangesPanelProps {
  patient: Patient;
  visit: Visit;
}

export const VisitChangesPanel: React.FC<VisitChangesPanelProps> = ({
  patient,
  visit
}) => {
  const changes = [
    {
      category: 'NEW_SYMPTOM',
      title: 'Acute Retrosternal Chest Pain (3 Days Duration)',
      detail: 'Moderate to severe pressure, onset 18-Sep-2026. Accompanied by dyspnea on exertion.',
      type: 'new',
      source: 'Patient Spoken Intake (21-Sep-2026)'
    },
    {
      category: 'CHANGED_MEDICATION',
      title: 'Unsupervised Aspirin (Ecosprin 75mg) Discontinuation',
      detail: 'Documented Active in Apollo Rx 14-Aug-2026 vs. Patient reports self-stopping 2 months ago due to gastric discomfort.',
      type: 'conflict',
      source: 'Discrepancy: Prescription vs Spoken Statement'
    },
    {
      category: 'UNCHANGED_CHRONIC',
      title: 'Type 2 Diabetes Mellitus & Metformin Adherence',
      detail: 'Tab. Metformin 500mg BD reported continued without interruption. Diagnosed 2024.',
      type: 'unchanged',
      source: 'Apollo Cardiology OPD Record (14-Aug-2026)'
    },
    {
      category: 'UNCHANGED_CHRONIC',
      title: 'Essential Hypertension & Amlodipine 5mg',
      detail: 'Tab. Amlodipine 5mg morning dose active. Stage 1 HTN documented 2025.',
      type: 'unchanged',
      source: 'Apollo Cardiology OPD Record (14-Aug-2026)'
    },
    {
      category: 'UNCHANGED_ALLERGY',
      title: 'Penicillin Allergy Documented',
      detail: 'Severe cutaneous rash / hypersensitivity reaction confirmed in history.',
      type: 'unchanged',
      source: 'Hospital EHR Allergy Registry'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Card */}
      <div className="paper-card p-6 border-terracotta/30 bg-[#f5eee1] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-400 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-terracotta tracking-wider">
              Longitudinal Delta Engine
            </span>
            <h2 className="text-xl font-serif font-bold text-ink">
              Previous Visit Comparison (What's Changed?)
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-parchment border border-parchment-400 text-ink">
            Comparing: 14-Aug-2026 vs Today (21-Sep-2026)
          </span>
        </div>
        <p className="text-xs text-ink-charcoal leading-relaxed">
          Pranabyte compares documented records against current intake to highlight new acute complaints, changed medication adherence, and stable chronic conditions without diagnostic speculation.
        </p>
      </div>

      {/* Changes List */}
      <div className="space-y-3">
        {changes.map((item, idx) => {
          let badgeBg = 'bg-[#dbeafe] text-[#1e40af] border-[#93c5fd]';
          let icon = <CheckCircle2 className="w-4 h-4" />;
          let label = 'UNCHANGED';

          if (item.type === 'new') {
            badgeBg = 'bg-[#dcfce7] text-[#15803d] border-[#86efac]';
            icon = <PlusCircle className="w-4 h-4" />;
            label = 'NEW ONSET';
          } else if (item.type === 'conflict') {
            badgeBg = 'bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5]';
            icon = <AlertTriangle className="w-4 h-4" />;
            label = 'MEDICATION DISCREPANCY';
          }

          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border bg-parchment transition-all space-y-2 ${
                item.type === 'conflict' ? 'border-[#fca5a5] shadow-warm ring-1 ring-[#b91c1c]/10' : 'border-parchment-400'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badgeBg}`}>
                    {icon}
                    <span>{label}</span>
                  </span>
                  <h3 className="font-serif font-bold text-ink text-sm">{item.title}</h3>
                </div>
                <span className="text-[11px] text-ink-graphite font-mono">
                  {item.source}
                </span>
              </div>

              <p className="text-xs text-ink-charcoal leading-relaxed pl-1">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
