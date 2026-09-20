import React, { useState } from 'react';
import { Patient } from '../../types';
import { ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ConsentScreenProps {
  patient: Patient;
  onConsentGiven: () => void;
  onDecline: () => void;
  onBack: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  patient,
  onConsentGiven,
  onDecline,
  onBack
}) => {
  const { t } = useLanguage();
  const [agreedTerms, setAgreedTerms] = useState(true);

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-slate-700/80 shadow-2xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Patient Informed Consent</h2>
          <p className="text-xs text-slate-400">Consent Version: <span className="text-emerald-400 font-mono">v1.0.0</span> | Patient: {patient.name} ({patient.patient_id_display})</p>
        </div>
      </div>

      {/* Structured Disclosure Points */}
      <div className="space-y-4 mb-6 text-sm text-slate-300">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-start gap-2.5">
            <FileCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">1. What Information is Collected</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Voice recordings of your symptom description, uploaded prescription images/PDFs, lab report parameters, and past hospital visits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <FileCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">2. Why It Is Collected</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                To organize a clear chronological medical history for your doctor and avoid repeatedly asking questions you have already answered.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-300">3. How AI is Used & Safety Guarantee</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Artificial Intelligence is used solely to transcribe speech, structure timelines, and link facts to evidence. <strong className="text-amber-200">The AI DOES NOT diagnose diseases or prescribe medications.</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-300">4. Doctor Makes the Final Clinical Decision</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Every clinical observation and medical summary will be verified and approved directly by your treating doctor during consultation.
              </p>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-5 h-5 rounded text-cyan-600 bg-slate-800 border-slate-700 focus:ring-cyan-500"
          />
          <span className="text-xs text-slate-200">
            I understand how my information will be processed and agree to proceed with the structured AI intake assistant.
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDecline}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-rose-950/40 hover:border-rose-800 text-rose-300 text-xs font-semibold transition"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>{t('declineConsent')}</span>
          </button>

          <button
            type="button"
            disabled={!agreedTerms}
            onClick={onConsentGiven}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition duration-200 ${
              agreedTerms
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('giveConsent')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
