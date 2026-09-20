import React, { useState } from 'react';
import { ClinicalFact } from '../../types';
import { Modal } from '../ui/Modal';
import { CheckCircle2, Edit3, XCircle, AlertTriangle, Save } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

interface VerificationModalProps {
  fact: ClinicalFact | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (factId: string, action: string, editedValue?: string, notes?: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  fact,
  isOpen,
  onClose,
  onVerify
}) => {
  if (!fact) return null;

  const [action, setAction] = useState<string>('confirmed');
  const [editedValue, setEditedValue] = useState(fact.value);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(fact.id, action, action === 'edited' ? editedValue : undefined, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Doctor Verification: ${fact.key_name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Fact Header */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
            <div className="text-sm font-semibold text-white">{fact.key_name}</div>
          </div>
          <StatusBadge status={fact.status} confidence={fact.confidence} />
        </div>

        {/* Current Value */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Clinical Value</label>
          {action === 'edited' ? (
            <textarea
              rows={2}
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-xs"
            />
          ) : (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200">
              {fact.value}
            </div>
          )}
        </div>

        {/* Doctor Verification Actions */}
        <div>
          <label className="block text-slate-400 font-semibold mb-2">Select Clinician Verification Action</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAction('confirmed')}
              className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition ${
                action === 'confirmed'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm Fact (🟢)</span>
            </button>

            <button
              type="button"
              onClick={() => setAction('edited')}
              className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition ${
                action === 'edited'
                  ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4 text-sky-400" />
              <span>Edit Value</span>
            </button>

            <button
              type="button"
              onClick={() => setAction('marked_uncertain')}
              className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition ${
                action === 'marked_uncertain'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Mark Uncertain (🟡)</span>
            </button>

            <button
              type="button"
              onClick={() => setAction('rejected')}
              className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition ${
                action === 'rejected'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Reject / Dismiss</span>
            </button>
          </div>
        </div>

        {/* Doctor clinical notes */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Clinician Notes & Rationale</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Verified with patient, ECG ordered..."
            className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Verification</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
