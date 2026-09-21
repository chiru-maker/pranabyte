import React from 'react';
import { RedFlag } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RedFlagsPanelProps {
  redFlags: RedFlag[];
  onRedFlagAction: (id: string, action: string) => void;
}

export const RedFlagsPanel: React.FC<RedFlagsPanelProps> = ({
  redFlags,
  onRedFlagAction
}) => {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="p-4 rounded-3xl bg-[#dcfce7] border border-[#86efac] flex items-center gap-3 text-xs text-[#15803d]">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span className="font-semibold">
          No active clinical red flags detected. Routine outpatient consultation workflow.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fadeIn">
      {redFlags.map((flag) => {
        const isDismissed = flag.status === 'DISMISSED' || flag.status === 'ACKNOWLEDGED';

        return (
          <div
            key={flag.id}
            className={`p-5 rounded-3xl border transition-all space-y-3 ${
              isDismissed
                ? 'bg-parchment border-parchment-400 opacity-70'
                : 'bg-[#fee2e2] border-[#fca5a5] shadow-warm red-flag-pulse'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-bold text-xs">
                  🚨
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 text-[#b91c1c] border border-[#fca5a5]">
                      {flag.severity} RISK RULE
                    </span>
                    <h3 className="font-serif font-bold text-[#b91c1c] text-sm sm:text-base">
                      {flag.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isDismissed ? (
                  <button
                    type="button"
                    onClick={() => onRedFlagAction(flag.id, 'ACKNOWLEDGED')}
                    className="btn-terracotta text-xs px-3 py-1 bg-[#b91c1c] hover:bg-[#991b1b]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledge Protocol</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-[#15803d] font-bold">
                    ✓ Acknowledged by Clinician
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1 text-xs text-ink-charcoal pl-9">
              <p>
                <strong>Trigger Criteria:</strong> {flag.trigger_criteria}
              </p>
              <p className="text-[#b91c1c] font-semibold">
                <strong>Clinical Action:</strong> {flag.recommendation}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
