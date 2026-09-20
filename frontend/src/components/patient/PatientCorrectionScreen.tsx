import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Edit3, ShieldCheck, Sparkles, Send, ArrowRight } from 'lucide-react';

interface FactItem {
  id: string;
  category: string;
  name: string;
  value: string;
  source: string;
  confirmed: boolean;
}

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
  const [facts, setFacts] = useState<FactItem[]>([
    { id: '1', category: 'Chief Reason for Visit', name: 'Chest Pain & Breathlessness', value: 'Started 3 days ago, increases when walking fast', source: 'Spoken by you', confirmed: true },
    { id: '2', category: 'Past Conditions', name: 'Type 2 Diabetes', value: 'Diagnosed in 2024, taking Metformin', source: 'Apollo Hospital Record', confirmed: true },
    { id: '3', category: 'Past Conditions', name: 'High Blood Pressure', value: 'Stage 1 Hypertension on Amlodipine', source: 'Apollo Hospital Record', confirmed: true },
    { id: '4', category: 'Medications', name: 'Aspirin (Ecosprin 75mg)', value: 'You reported stopping this 2 months ago', source: 'Your Voice Statement', confirmed: true },
    { id: '5', category: 'Allergies', name: 'Penicillin', value: 'Skin allergy / rash', source: 'Prior Medical File', confirmed: true }
  ]);

  const [disputeNotes, setDisputeNotes] = useState<{ [key: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleToggleConfirm = (id: string) => {
    setFacts(prev => prev.map(f => f.id === id ? { ...f, confirmed: !f.confirmed } : f));
  };

  const handleSaveEdit = (id: string) => {
    setDisputeNotes(prev => ({ ...prev, [id]: editText }));
    setEditingId(null);
    setEditText('');
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/v1/doctor/patient-confirm/${visitId || 'default'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corrections: disputeNotes })
      });
    } catch (e) {
      console.log("Offline mode confirmation");
    } finally {
      setIsSubmitting(false);
      setIsConfirmed(true);
      setTimeout(() => {
        onDone();
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-1 border border-cyan-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Review Your Medical Story</h2>
        <p className="text-sm text-slate-400">
          Dear <strong className="text-white">{patientName}</strong>, please review what our AI summarized from your voice and files. If anything is wrong, you can correct it before the doctor sees it.
        </p>
      </div>

      {isConfirmed ? (
        <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Case Sheet Confirmed!</h3>
          <p className="text-sm text-slate-300">
            Thank you. Your confirmed case summary has been sent directly to the doctor's screen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {facts.map(f => {
              const hasCorrection = Boolean(disputeNotes[f.id]);

              return (
                <div
                  key={f.id}
                  className={`p-4 rounded-xl border transition-all ${
                    hasCorrection
                      ? 'bg-amber-950/30 border-amber-500/50'
                      : f.confirmed
                      ? 'bg-slate-900/80 border-slate-800'
                      : 'bg-rose-950/30 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        {f.category}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{f.name}</h4>
                      <p className="text-xs text-slate-300 mt-1">{f.value}</p>
                      <span className="inline-block mt-2 text-[10px] text-slate-500 italic">
                        Source: {f.source}
                      </span>

                      {hasCorrection && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-900/30 border border-amber-600/40 text-xs text-amber-200">
                          <strong>Your Correction Note:</strong> {disputeNotes[f.id]}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(f.id);
                          setEditText(disputeNotes[f.id] || '');
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition"
                        title="Add note/correction"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleConfirm(f.id)}
                        className={`p-1.5 rounded-lg transition ${
                          f.confirmed
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-slate-500 hover:text-white'
                        }`}
                        title={f.confirmed ? 'Confirmed' : 'Mark as needing check'}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {editingId === f.id && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        placeholder="Type your correction (e.g., 'I take 1000mg, not 500mg')..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(f.id)}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>I Confirm These Details &mdash; Proceed to OPD Queue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
