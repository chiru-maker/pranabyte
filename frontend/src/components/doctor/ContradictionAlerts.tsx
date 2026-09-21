import React, { useState } from 'react';
import { Contradiction } from '../../types';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Edit3 } from 'lucide-react';

interface ContradictionAlertsProps {
  contradictions: Contradiction[];
  onResolve: (id: string, action: string, notes: string) => void;
}

export const ContradictionAlerts: React.FC<ContradictionAlertsProps> = ({
  contradictions,
  onResolve
}) => {
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  if (!contradictions || contradictions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {contradictions.map((c) => {
        const isResolved = c.status !== 'ACTIVE';

        return (
          <div
            key={c.id}
            className={`paper-card p-6 border transition-all space-y-4 ${
              isResolved ? 'bg-parchment/70 border-parchment-400' : 'border-[#fca5a5] bg-[#fee2e2]/40 shadow-warm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-400/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-bold text-xs">
                  ⚡
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b91c1c]">
                    Clinical Evidence Contradiction
                  </span>
                  <h3 className="font-serif font-bold text-ink text-sm sm:text-base">
                    {c.title}
                  </h3>
                </div>
              </div>

              {isResolved ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#15803d] border border-[#86efac] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolved: {c.status}</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] animate-pulse">
                  Action Required
                </span>
              )}
            </div>

            {/* Side-by-Side Sources Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Source A: Historical Document */}
              <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] block">
                  Source A (Documented Medical Record):
                </span>
                <p className="font-semibold text-ink">{c.source_a_description}</p>
                <div className="p-2.5 rounded-xl bg-parchment-200 border border-parchment-300 font-mono text-ink text-xs">
                  {c.source_a_value}
                </div>
              </div>

              {/* Source B: Current Spoken Intake */}
              <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b05a36] block">
                  Source B (Patient Spoken Intake):
                </span>
                <p className="font-semibold text-ink">{c.source_b_description}</p>
                <div className="p-2.5 rounded-xl bg-parchment-200 border border-parchment-300 font-mono text-ink text-xs">
                  {c.source_b_value}
                </div>
              </div>
            </div>

            {/* Doctor Resolution Options */}
            {!isResolved && (
              <div className="pt-2 border-t border-parchment-400/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-ink">
                    Reconcile Discrepancy (Physician Decision):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onResolve(
                          c.id,
                          'RESOLVED_B',
                          'Accepted patient reported cessation; Aspirin stopped 2 months ago. Instructed to restart under cardiology supervision.'
                        )
                      }
                      className="btn-terracotta text-xs px-3 py-1.5"
                    >
                      <span>Accept Spoken Statement (Stopped)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onResolve(
                          c.id,
                          'RESOLVED_A',
                          'Confirmed patient is still actively taking Aspirin 75mg daily.'
                        )
                      }
                      className="btn-secondary-paper text-xs px-3 py-1.5"
                    >
                      <span>Retain Documented Active</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
