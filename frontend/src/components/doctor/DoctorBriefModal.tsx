import React, { useState } from 'react';
import { Sparkles, Copy, Check, CheckCircle2, XCircle, Edit3, ShieldAlert, FileText, Download } from 'lucide-react';
import { Visit, Patient } from '../../types';

interface DoctorBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  visit: Visit;
  onApproveAndSign?: (finalText: string) => void;
}

export const DoctorBriefModal: React.FC<DoctorBriefModalProps> = ({
  isOpen,
  onClose,
  patient,
  visit,
  onApproveAndSign
}) => {
  if (!isOpen) return null;

  const initialDraft = visit.ai_summary_draft || `### AI DOCTOR BRIEF DRAFT
*NOTICE: AI-generated clinical draft — requires clinician verification. Not a diagnosis.*

**PATIENT:** ${patient.name} | **AGE/SEX:** ${patient.age}Y ${patient.sex} | **ID:** ${patient.patient_id_display} | **ABHA:** ${patient.abha_id || '91-8273-9912-0041'}

---

**1. CHIEF COMPLAINT:**
Central retrosternal chest pain for 3 days, accompanied by intermittent breathlessness on mild exertion.

**2. CURRENT HISTORY & SYMPTOMS:**
- Chest Pain: Moderate-Severe, onset 3 days ago, intermittent substernal pressure.
- Dyspnea / Breathlessness: Present on exertion. No radiation to left arm.

**3. PAST MEDICAL HISTORY:**
- Type 2 Diabetes Mellitus [DOCUMENTED - Apollo Hospital 2024]
- Essential Hypertension [DOCUMENTED - Apollo Hospital 2025]

**4. MEDICATIONS & ADHERENCE:**
- Tab. Metformin 500mg BD [DOCUMENTED - Active]
- Tab. Amlodipine 5mg OD [DOCUMENTED - Active]
- Tab. Ecosprin 75mg OD [🚨 CONFLICT: Documented Active vs Patient reports stopped 2 months ago]

**5. ALLERGIES:**
- Penicillin [DOCUMENTED - Severe cutaneous hypersensitivity]

**6. CLINICAL SAFETY RED FLAGS & RECONCILIATION:**
- 🚨 Urgent Safety Alert: Acute chest pain + dyspnea in known diabetic with recent aspirin cessation. Immediate 12-lead ECG recommended.`;

  const [briefText, setBriefText] = useState(initialDraft);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApprove = () => {
    if (onApproveAndSign) {
      onApproveAndSign(briefText);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-3xl w-full paper-card p-6 sm:p-8 max-h-[90vh] flex flex-col space-y-4 shadow-warm-xl border border-parchment-400">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-terracotta-light text-terracotta flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-ink text-lg">AI Doctor Brief & Clinical Summary</h2>
              <span className="text-[11px] text-ink-graphite font-mono">Patient: {patient.name} ({patient.patient_id_display})</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-graphite hover:text-ink font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Non-Diagnostic Safety Warning Banner */}
        <div className="p-3 rounded-xl bg-parchment-200 border border-parchment-400 text-xs text-ink-charcoal flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
          <span>
            <strong>Clinical Safety Guarantee:</strong> This summary is an assistive clinical draft compiled from patient statements and historical documents. It does not replace clinical judgement and must be verified by the consulting physician.
          </span>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-parchment border border-parchment-400 text-xs text-ink">
          {isEditing ? (
            <textarea
              rows={16}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              className="w-full p-3 bg-white border border-parchment-400 rounded-xl font-mono text-xs text-ink leading-relaxed focus:outline-none focus:border-terracotta"
            />
          ) : (
            <pre className="font-sans whitespace-pre-wrap leading-relaxed text-xs text-ink">
              {briefText}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-parchment-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary-paper text-xs px-3 py-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#15803d]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary-paper text-xs px-3 py-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-terracotta" />
              <span>{isEditing ? 'Preview Markdown' : 'Edit Brief'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-paper text-xs px-4 py-2"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="btn-terracotta text-xs px-5 py-2 shadow-warm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Sign Off Brief</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
