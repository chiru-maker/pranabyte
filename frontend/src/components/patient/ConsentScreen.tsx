import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Lock, Eye, AlertCircle } from 'lucide-react';
import { Patient } from '../../types';

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
  return (
    <div className="max-w-2xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-ink-graphite hover:text-ink flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registration</span>
        </button>
        <span className="text-xs font-mono text-ink-graphite">Patient: {patient.name} ({patient.patient_id_display})</span>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Step 2: Informed Patient Consent</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          Voice Intake & AI Clinical Consent
        </h2>
        <p className="text-xs sm:text-sm text-ink-charcoal max-w-md mx-auto">
          Please review how your spoken words and historical medical records will be processed.
        </p>
      </div>

      {/* Consent Disclosure Points */}
      <div className="space-y-3 text-xs text-ink-charcoal">
        <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 flex items-start gap-3">
          <Lock className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-ink block mb-0.5">1. Voice Recording & Speech-to-Text Transcription</span>
            <span>Your spoken description of symptoms will be converted to text in real-time. Audio streams are encrypted and processed solely for your clinical intake.</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 flex items-start gap-3">
          <Eye className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-ink block mb-0.5">2. Assistive Clinical AI Decision Support</span>
            <span>The AI will extract symptoms, identify medication discrepancies, and prepare a preliminary summary for Dr. Priya Sharma. The AI does not independently diagnose diseases.</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-ink block mb-0.5">3. Patient Verification & Control</span>
            <span>You will have the opportunity to review, correct, or amend your extracted symptoms before they are sent to the physician.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onDecline}
          className="btn-secondary-paper text-xs px-4 py-2.5"
        >
          <span>Decline & Use Standard Form</span>
        </button>

        <button
          type="button"
          onClick={onConsentGiven}
          className="btn-terracotta text-sm px-6 py-3"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Consent & Agree — Start Voice Intake</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
