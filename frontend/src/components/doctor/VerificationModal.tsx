import React, { useState } from 'react';
import { ClinicalFact, FactStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Edit3, XCircle, AlertCircle, ShieldCheck, FileText } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fact: ClinicalFact | null;
  onVerify: (factId: string, action: string, editedValue?: string, notes?: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  fact,
  onVerify
}) => {
  if (!isOpen || !fact) return null;

  const [editedValue, setEditedValue] = useState(fact.value);
  const [notes, setNotes] = useState(fact.doctor_notes || '');
  const [action, setAction] = useState<string>('confirmed');

  const handleSave = () => {
    onVerify(fact.id, action, editedValue, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-xl w-full paper-card p-6 sm:p-8 space-y-5 shadow-warm-xl border border-parchment-400">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-terracotta" />
            <h2 className="font-serif font-bold text-ink text-lg">
              Physician Fact Verification
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-graphite hover:text-ink font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Fact Summary */}
        <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ink text-sm">{fact.key_name}</span>
            <Badge status={fact.status} size="sm" />
          </div>
          {fact.source_citation && (
            <p className="text-ink-graphite">
              <strong>Source:</strong> {fact.source_citation}
            </p>
          )}
        </div>

        {/* Edit Value */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-ink font-semibold">
            Clinical Statement / Dosage Value:
          </label>
          <textarea
            rows={3}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full p-3 bg-white border border-parchment-400 rounded-xl text-ink text-xs focus:outline-none focus:border-terracotta"
          />
        </div>

        {/* Action Choice */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-ink font-semibold">Physician Action:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAction('confirmed')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                action === 'confirmed'
                  ? 'bg-[#dcfce7] text-[#15803d] border-[#86efac]'
                  : 'bg-parchment border-parchment-400 text-ink'
              }`}
            >
              ✓ Confirm (Legal)
            </button>
            <button
              type="button"
              onClick={() => setAction('marked_uncertain')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                action === 'marked_uncertain'
                  ? 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
                  : 'bg-parchment border-parchment-400 text-ink'
              }`}
            >
              ? Mark Uncertain
            </button>
            <button
              type="button"
              onClick={() => setAction('rejected')}
              className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                action === 'rejected'
                  ? 'bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5]'
                  : 'bg-parchment border-parchment-400 text-ink'
              }`}
            >
              ✕ Reject Fact
            </button>
          </div>
        </div>

        {/* Doctor Notes */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-ink font-semibold">Clinician Verification Notes (Optional):</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Verified during physical examination; restart Aspirin under care."
            className="w-full px-3 py-2 bg-white border border-parchment-400 rounded-xl text-ink text-xs focus:outline-none focus:border-terracotta"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-parchment-400">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary-paper text-xs px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-terracotta text-xs px-5 py-2 shadow-warm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save & Apply Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
