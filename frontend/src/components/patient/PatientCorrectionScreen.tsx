import React, { useState } from 'react';
import { UserCheck, CheckCircle2, Edit3, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Plus } from 'lucide-react';

interface PatientCorrectionScreenProps {
  visitId: string;
  patientName: string;
  onDone: () => void;
}

export const PatientCorrectionScreen: React.FC<PatientCorrectionScreenProps> = ({
  visitId,
  patientName,
  onDone
}) => {
  const [symptoms, setSymptoms] = useState<string[]>([
    'Substernal chest pain (3 days duration, moderate-severe)',
    'Shortness of breath / dyspnea on mild physical exertion',
    'Pain does not radiate to left arm',
    'Stopped taking Aspirin (Ecosprin 75mg) 2 months ago'
  ]);

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [newSymptomText, setNewSymptomText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleStartEdit = (idx: number) => {
    setIsEditing(idx);
    setEditText(symptoms[idx]);
  };

  const handleSaveEdit = (idx: number) => {
    if (!editText.trim()) return;
    const updated = [...symptoms];
    updated[idx] = editText.trim();
    setSymptoms(updated);
    setIsEditing(null);
  };

  const handleAddSymptom = () => {
    if (!newSymptomText.trim()) return;
    setSymptoms([...symptoms, newSymptomText.trim()]);
    setNewSymptomText('');
  };

  const handleFinalSubmit = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onDone();
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Step 6: Patient Self-Review & Verification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          Verify Your Extracted Case
        </h2>
        <p className="text-xs sm:text-sm text-ink-charcoal max-w-md mx-auto">
          Please confirm that these statements accurately reflect what you experienced before submitting to Dr. Priya Sharma.
        </p>
      </div>

      {/* Verification Notice */}
      <div className="p-3.5 rounded-2xl bg-parchment-200 border border-parchment-400 text-xs text-ink-charcoal flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-terracotta shrink-0" />
        <span>You may edit or add symptoms at this stage. Your verified statements will be highlighted for the clinician.</span>
      </div>

      {/* Symptom List with Edit Capabilities */}
      <div className="space-y-3">
        {symptoms.map((sym, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-2 text-xs">
            {isEditing === idx ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2.5 bg-[#ffffff] border border-parchment-400 rounded-xl text-ink text-xs focus:outline-none focus:border-terracotta font-medium"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(null)}
                    className="btn-secondary-paper text-xs px-3 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(idx)}
                    className="btn-terracotta text-xs px-3 py-1"
                  >
                    Save Correction
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 text-ink font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>{sym}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartEdit(idx)}
                  className="text-ink-graphite hover:text-ink flex items-center gap-1 font-semibold text-[11px] shrink-0"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Missing Symptom Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSymptomText}
          onChange={(e) => setNewSymptomText(e.target.value)}
          placeholder="Add any additional symptom you forgot to mention..."
          className="flex-1 px-4 py-2.5 bg-parchment border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta"
        />
        <button
          type="button"
          onClick={handleAddSymptom}
          disabled={!newSymptomText.trim()}
          className="btn-secondary-paper text-xs px-4 py-2"
        >
          <Plus className="w-3.5 h-3.5 text-terracotta" />
          <span>Add</span>
        </button>
      </div>

      {/* Confirmation & Submit to Queue */}
      <div className="pt-3 border-t border-parchment-400">
        <button
          type="button"
          onClick={handleFinalSubmit}
          className="w-full btn-terracotta text-sm py-3.5 shadow-warm"
        >
          {isConfirmed ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified! Queuing for Dr. Priya Sharma...</span>
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Submit Case to Doctor Workstation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
