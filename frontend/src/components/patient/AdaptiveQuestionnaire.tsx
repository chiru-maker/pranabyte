import React, { useState } from 'react';
import { Send, CheckCircle, ShieldCheck, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [answer, setAnswer] = useState('');

  const quickAnswers = [
    'Yes, it radiates to my left arm and shoulder',
    'No, the pain stays strictly in the center',
    'Yes, especially when walking or after meals',
    'No other symptoms noticed'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    onAnswerSubmit(answer);
    setAnswer('');
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-slate-700/80 shadow-2xl animate-fadeIn space-y-6">
      {/* Ask Less, Know More Notification Banner */}
      {avoidedReasons.length > 0 && (
        <div className="p-4 rounded-xl bg-sky-950/70 border border-sky-500/40 text-sky-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Ask Less, Know More Engine Active
            </span>
          </div>
          <p className="text-xs text-sky-300/90 font-medium mb-2">
            {avoidedCount} redundant questions avoided using your existing hospital history & prescriptions:
          </p>
          <ul className="space-y-1">
            {avoidedReasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-emerald-300 flex items-start gap-1.5 font-mono">
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Question Box */}
      {!isComplete && currentQuestion ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
              Adaptive Clinical Question ({category.replace('_', ' ')})
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-semibold text-white leading-snug">
              "{currentQuestion}"
            </h3>
          </div>

          {/* Quick Tap Answers */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick One-Touch Responses:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickAnswers.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAnswer(opt)}
                  className="text-left px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 hover:border-slate-700 transition"
                >
                  👉 {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak or type your answer here..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onFinishCase}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Skip remaining questions
              </button>

              <button
                type="submit"
                disabled={!answer.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition ${
                  answer.trim()
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-cyan-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{t('submitAnswer')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Intake Intake Synthesized</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              All essential symptoms and evidence-linked facts have been collected and structured for your doctor.
            </p>
          </div>

          <button
            type="button"
            onClick={onFinishCase}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition"
          >
            <span>Proceed to Document Upload & Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
