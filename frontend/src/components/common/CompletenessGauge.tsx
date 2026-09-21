import React from 'react';
import { Activity, HelpCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface CompletenessGaugeProps {
  score: number;
  missingFields?: string[];
  avoidedCount?: number;
  onAskPatientNow?: (field: string) => void;
}

export const CompletenessGauge: React.FC<CompletenessGaugeProps> = ({
  score,
  missingFields = ['Radiation / Spread of pain', 'Dosage clarification for Amlodipine'],
  avoidedCount = 12,
  onAskPatientNow
}) => {
  // SVG Circular progress math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return '#15803d'; // Forest Green
    if (score >= 50) return '#b05a36'; // Terracotta
    return '#b91c1c'; // Crimson
  };

  return (
    <div className="paper-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-terracotta" />
          <h3 className="font-serif font-bold text-ink text-sm">
            Case Completeness Engine
          </h3>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#86efac]">
          {avoidedCount} Redundant Qs Avoided
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Circular Gauge */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#d1c9bf"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={getScoreColor()}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-lg font-bold text-ink leading-none">
              {score}%
            </span>
            <span className="text-[9px] uppercase font-bold text-ink-graphite tracking-tight">
              Complete
            </span>
          </div>
        </div>

        {/* Missing Fields Breakdown */}
        <div className="flex-1 space-y-2">
          <span className="text-xs font-bold text-ink block">
            {missingFields.length > 0 ? 'Missing Diagnostic Detail:' : 'Case History Fully Detailed'}
          </span>
          {missingFields.length > 0 ? (
            <div className="space-y-1.5">
              {missingFields.map((field, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-ink-charcoal gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span>{field}</span>
                  </div>
                  {onAskPatientNow && (
                    <button
                      type="button"
                      onClick={() => onAskPatientNow(field)}
                      className="text-[11px] text-terracotta font-semibold hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      <span>Ask Patient Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#15803d] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All essential clinical dimensions covered.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
