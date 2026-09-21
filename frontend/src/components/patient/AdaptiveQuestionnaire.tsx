import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface AdaptiveQuestionnaireProps {
  currentQuestion: string;
  category: string;
  avoidedReasons: string[];
  avoidedCount: number;
  onAnswerSubmit: (answer: string) => void;
  onFinishCase: () => void;
  isComplete: boolean;
}

export const AdaptiveQuestionnaire: React.FC<AdaptiveQuestionnaireProps> = ({
  currentQuestion,
  category,
  avoidedReasons,
  avoidedCount,
  onAnswerSubmit,
  onFinishCase,
  isComplete
}) => {
  const [answer, setAnswer] = useState('');

  const handleSendAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    onAnswerSubmit(answer.trim());
    setAnswer('');
  };

  const quickAnswers = [
    'Yes, it radiates to my left arm and shoulder.',
    'No, the pain stays strictly in the center of my chest.',
    'Sometimes it feels like tightness in my throat and jaw.'
  ];

  return (
    <div className="max-w-2xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 4: Smart Adaptive Questioning</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          Follow-Up Diagnostic Detail
        </h2>
        <p className="text-xs sm:text-sm text-ink-charcoal max-w-md mx-auto">
          Pranabyte probes only missing details, skipping questions already answered in prior records.
        </p>
      </div>

      {/* Redundant Questions Avoided Badge Box */}
      <div className="p-4 rounded-2xl bg-[#dcfce7] border border-[#86efac] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#15803d] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{avoidedCount} Redundant Questions Avoided</span>
          </span>
          <span className="text-[10px] uppercase font-mono font-bold text-[#15803d] bg-white/70 px-2 py-0.5 rounded-full">
            Time Saved: 4.5 Mins
          </span>
        </div>
        <div className="space-y-1">
          {avoidedReasons.map((reason, i) => (
            <p key={i} className="text-[11px] text-[#15803d]/90 font-medium">
              {reason}
            </p>
          ))}
        </div>
      </div>

      {/* Active Question or Completion Banner */}
      {!isComplete && currentQuestion ? (
        <div className="p-5 rounded-2xl bg-parchment border border-parchment-400 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-terracotta shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
              Doctor's AI Follow-Up Question:
            </span>
          </div>

          <p className="text-base sm:text-lg font-serif font-bold text-ink leading-snug">
            "{currentQuestion}"
          </p>

          {/* Quick Choice Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase text-ink-graphite block">Quick Response:</span>
            <div className="flex flex-col gap-2">
              {quickAnswers.map((ans, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onAnswerSubmit(ans);
                  }}
                  className="text-left px-3 py-2 rounded-xl bg-parchment-200 hover:bg-parchment-300 border border-parchment-400 text-xs text-ink transition font-medium"
                >
                  👉 {ans}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Typed Answer */}
          <form onSubmit={handleSendAnswer} className="pt-2 flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Or type custom response here..."
              className="flex-1 px-4 py-2.5 bg-[#ffffff] border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              disabled={!answer.trim()}
              className="btn-terracotta text-xs px-4 py-2.5"
            >
              <span>Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-parchment border border-parchment-400 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#dcfce7] text-[#15803d] mx-auto flex items-center justify-center border border-[#86efac]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-ink text-lg">Adaptive Intake Complete</h3>
          <p className="text-xs text-ink-charcoal max-w-sm mx-auto">
            All necessary symptom dimensions and clinical details have been gathered.
          </p>
          <button
            type="button"
            onClick={onFinishCase}
            className="btn-terracotta text-xs px-6 py-2.5 mt-2"
          >
            <span>Proceed to Document Upload & Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Skip / Next Step fallback */}
      {!isComplete && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onFinishCase}
            className="text-xs text-ink-graphite hover:text-ink font-semibold underline"
          >
            Skip remaining questions & proceed to Document Upload →
          </button>
        </div>
      )}
    </div>
  );
};
