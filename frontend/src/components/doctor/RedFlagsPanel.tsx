import React from 'react';
import { RedFlag } from '../../types';
import { AlertTriangle, Check, Eye, X } from 'lucide-react';

interface RedFlagsPanelProps {
  redFlags: RedFlag[];
  onAction: (id: string, action: string) => void;
}

export const RedFlagsPanel: React.FC<RedFlagsPanelProps> = ({ redFlags, onAction }) => {
  if (redFlags.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
          Safety Red-Flag Alerts ({redFlags.length})
        </h3>
      </div>

      {redFlags.map((rf) => (
        <div 
          key={rf.id}
          className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-3 shadow-lg animate-fadeIn"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span>🚨 {rf.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-amber-900 text-amber-200 border border-amber-600">
                  {rf.severity}
                </span>
              </div>
              <p className="text-xs text-amber-200/90 mt-1 font-medium">
                {rf.recommendation}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              Rule: {rf.rule_name}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <strong>Trigger Criteria:</strong> {rf.trigger_criteria}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-900/60 text-xs">
            <span className="text-[11px] text-slate-400 italic">
              AI Safety Guardrail: Clinician review recommended. Non-diagnostic alert.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAction(rf.id, 'ACKNOWLEDGED')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-semibold text-xs transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Acknowledge</span>
              </button>

              <button
                type="button"
                onClick={() => onAction(rf.id, 'DISMISSED')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 font-semibold text-xs transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
