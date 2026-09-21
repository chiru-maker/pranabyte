import React from 'react';
import { ClinicalFact, FactStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Edit3, XCircle, AlertCircle, FileText, Check, Sparkles } from 'lucide-react';

interface EvidenceTrustViewProps {
  facts: ClinicalFact[];
  onOpenVerify: (fact: ClinicalFact) => void;
  onQuickVerify?: (factId: string) => void;
}

export const EvidenceTrustView: React.FC<EvidenceTrustViewProps> = ({
  facts,
  onOpenVerify,
  onQuickVerify
}) => {
  const categories = [
    { key: 'chief_complaint', title: 'Chief Complaint & Symptoms' },
    { key: 'symptom', title: 'Detailed Symptom Manifestations' },
    { key: 'medication', title: 'Current Medications & Adherence' },
    { key: 'past_history', title: 'Past Medical History & Chronic Diagnoses' },
    { key: 'allergy', title: 'Documented Drug Allergies & Reactions' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {categories.map((cat) => {
        const catFacts = facts.filter(f => f.category === cat.key);
        if (catFacts.length === 0) return null;

        return (
          <div key={cat.key} className="paper-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
              <h3 className="font-serif font-bold text-ink text-base">
                {cat.title}
              </h3>
              <span className="text-[11px] font-mono text-ink-graphite font-semibold">
                {catFacts.length} Fact{catFacts.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {catFacts.map((fact) => {
                const isVerified = fact.doctor_verified;

                return (
                  <div
                    key={fact.id}
                    className={`p-4 rounded-2xl bg-parchment border transition-all space-y-2 ${
                      fact.status === 'CONFLICTING'
                        ? 'border-[#fca5a5] shadow-warm'
                        : fact.status === 'UNCERTAIN'
                        ? 'border-[#fde68a]'
                        : isVerified
                        ? 'border-[#86efac]'
                        : 'border-parchment-400'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge status={fact.status} size="sm" />
                        <span className="font-bold text-ink text-xs">{fact.key_name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isVerified ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold border border-[#86efac] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Dr. Verified</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {onQuickVerify && (
                              <button
                                type="button"
                                onClick={() => onQuickVerify(fact.id)}
                                className="px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] text-[11px] font-bold border border-[#86efac] transition flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Verify</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onOpenVerify(fact)}
                              className="btn-secondary-paper text-[11px] px-2.5 py-1"
                            >
                              <Edit3 className="w-3 h-3 text-terracotta" />
                              <span>Edit/Review</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-ink-charcoal font-medium leading-relaxed pl-1">
                      {fact.value}
                    </p>

                    {fact.source_citation && (
                      <div className="pt-1.5 border-t border-parchment-300 text-[11px] text-ink-graphite flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="truncate">
                          <strong>Source:</strong> {fact.source_citation}
                        </span>
                        <span className="font-mono text-[10px] text-ink-graphite shrink-0 ml-auto">
                          ({Math.round(fact.confidence * 100)}% Conf.)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
