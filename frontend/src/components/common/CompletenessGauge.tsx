import React from 'react';
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react';

interface CompletenessGaugeProps {
  score: number;
  factsCount?: number;
  avoidedCount?: number;
}

export const CompletenessGauge: React.FC<CompletenessGaugeProps> = ({
  score = 85,
  factsCount = 8,
  avoidedCount = 12
}) => {
  const collectedItems = [
    { label: 'Chief Complaint', present: true },
    { label: 'Symptom Duration & Severity', present: true },
    { label: 'Current & Past Medications', present: true },
    { label: 'Drug Allergies', present: true },
    { label: 'Documented Past Medical History', present: true },
    { label: 'Family Cardiac History', present: score > 80 },
    { label: 'Social & Tobacco History', present: score >= 90 },
  ];

  return (
    <div className="glass-card rounded-xl p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Case Intake Completeness</span>
          <p className="text-xs text-slate-500">Measures clinical data completeness (Not a clinical risk score)</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-cyan-400">{score}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 mb-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2.5 rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {collectedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {item.present ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className={item.present ? 'text-slate-300' : 'text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {avoidedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-medium bg-sky-950/30 -mx-4 -mb-4 p-3 rounded-b-xl">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            {avoidedCount} redundant questions skipped using prior records
          </span>
          <span className="text-sky-300 font-bold">Ask Less, Know More</span>
        </div>
      )}
    </div>
  );
};
