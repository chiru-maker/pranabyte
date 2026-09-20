import React from 'react';
import { Contradiction } from '../../types';
import { AlertOctagon, CheckCircle2, Edit3, XCircle, ArrowRight } from 'lucide-react';

interface ContradictionAlertsProps {
  contradictions: Contradiction[];
  onResolve: (id: string, action: string, notes: string) => void;
}

export const ContradictionAlerts: React.FC<ContradictionAlertsProps> = ({
  contradictions,
  onResolve
}) => {
  if (contradictions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
          Source Contradictions Detected ({contradictions.length})
        </h3>
      </div>

      {contradictions.map((contra) => (
        <div 
          key={contra.id}
          className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-4 shadow-lg animate-fadeIn"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{contra.title}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-900/80 text-rose-300 border border-rose-700">
              🔴 CONFLICTING
            </span>
          </div>

          {/* Comparison Cards: Source A vs Source B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Source A */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                📄 SOURCE A: {contra.source_a_description}
              </span>
              <p className="text-white font-medium">{contra.source_a_value}</p>
            </div>

            {/* Source B */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                🎙️ SOURCE B: {contra.source_b_description}
              </span>
              <p className="text-white font-medium">{contra.source_b_value}</p>
            </div>
          </div>

          {/* Doctor Actions */}
          <div className="pt-2 border-t border-rose-900/60 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-rose-200/80 font-medium">
              Doctor Action Required: System does not decide which source is correct.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onResolve(contra.id, 'RESOLVED_B', 'Doctor confirmed patient stopped taking aspirin 2 months ago.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Stopped</span>
              </button>

              <button
                type="button"
                onClick={() => onResolve(contra.id, 'RESOLVED_A', 'Doctor instructed to keep aspirin active.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 text-xs font-semibold transition"
              >
                <span>Keep Active</span>
              </button>

              <button
                type="button"
                onClick={() => onResolve(contra.id, 'RESOLVED_EDIT', 'Doctor edited dosage.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Medication</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
