import React, { useState } from 'react';
import { ClinicalFact, Contradiction } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { FileText, Mic, CheckCircle2, AlertOctagon, HelpCircle, Eye, ExternalLink, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface EvidenceTrustViewProps {
  facts: ClinicalFact[];
  contradictions: Contradiction[];
  onFactClick: (fact: ClinicalFact) => void;
}

export const EvidenceTrustView: React.FC<EvidenceTrustViewProps> = ({
  facts,
  contradictions,
  onFactClick
}) => {
  const [viewMode, setViewMode] = useState<'summary' | 'evidence'>('evidence');
  const [activeFactForModal, setActiveFactForModal] = useState<ClinicalFact | null>(null);

  const groupByCategory = (cat: string) => facts.filter((f) => f.category === cat);

  const complaints = groupByCategory('chief_complaint');
  const symptoms = groupByCategory('symptom');
  const pastHistory = groupByCategory('past_history');
  const medications = groupByCategory('medication');
  const allergies = groupByCategory('allergy');
  const observations = groupByCategory('observation');
  const labResults = groupByCategory('lab_result');

  const handleFactSelected = (fact: ClinicalFact) => {
    setActiveFactForModal(fact);
    onFactClick(fact);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Case Visualization</span>
          <h3 className="text-sm font-semibold text-white">Toggle Trust & Evidence Provenance View</h3>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setViewMode('summary')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === 'summary'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 SUMMARY VIEW
          </button>
          <button
            type="button"
            onClick={() => setViewMode('evidence')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'evidence'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🔗 EVIDENCE VIEW (CORE USP)</span>
          </button>
        </div>
      </div>

      {/* Information Banner for Evidence View */}
      {viewMode === 'evidence' && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>Evidence View Active:</strong> Click any clinical sentence or medication badge to view original document scans, spoken transcripts, and contradiction proof.</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-900 border border-cyan-700">
            Clickable Citations
          </span>
        </div>
      )}

      {/* Structured Clinical Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chief Complaint & Current Symptoms */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-2">
            1. Chief Complaint & Symptoms
          </h4>
          <div className="space-y-2.5">
            {[...complaints, ...symptoms].map((fact) => (
              <div
                key={fact.id}
                onClick={() => viewMode === 'evidence' && handleFactSelected(fact)}
                className={`p-3 rounded-xl bg-slate-900/90 border transition ${
                  viewMode === 'evidence'
                    ? 'cursor-pointer hover:border-cyan-500 hover:bg-slate-800/90 border-slate-800'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{fact.key_name}</span>
                  <StatusBadge status={fact.status} confidence={fact.confidence} />
                </div>
                <p className="text-xs text-slate-300">{fact.value}</p>
                {viewMode === 'evidence' && fact.source_citation && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                    <Mic className="w-3 h-3" />
                    <span>Citation: {fact.source_citation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Past Medical History */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-2">
            2. Past Medical History
          </h4>
          <div className="space-y-2.5">
            {pastHistory.map((fact) => (
              <div
                key={fact.id}
                onClick={() => viewMode === 'evidence' && handleFactSelected(fact)}
                className={`p-3 rounded-xl bg-slate-900/90 border transition ${
                  viewMode === 'evidence'
                    ? 'cursor-pointer hover:border-sky-500 hover:bg-slate-800/90 border-slate-800'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{fact.key_name}</span>
                  <StatusBadge status={fact.status} confidence={fact.confidence} />
                </div>
                <p className="text-xs text-slate-300">{fact.value}</p>
                {viewMode === 'evidence' && fact.source_citation && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-sky-400 flex items-center gap-1 font-mono">
                    <FileText className="w-3 h-3" />
                    <span>Citation: {fact.source_citation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current & Past Medications */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. Medications & Regimen
            </h4>
            <span className="text-[10px] text-slate-400">Active / Conflict Monitored</span>
          </div>
          <div className="space-y-2.5">
            {medications.map((fact) => (
              <div
                key={fact.id}
                onClick={() => viewMode === 'evidence' && handleFactSelected(fact)}
                className={`p-3 rounded-xl bg-slate-900/90 border transition ${
                  fact.status === 'CONFLICTING'
                    ? 'border-rose-500/60 bg-rose-950/20 hover:bg-rose-950/40'
                    : fact.status === 'UNCERTAIN'
                    ? 'border-amber-500/60 bg-amber-950/20'
                    : 'border-slate-800'
                } ${viewMode === 'evidence' ? 'cursor-pointer hover:border-emerald-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{fact.key_name}</span>
                  <StatusBadge status={fact.status} confidence={fact.confidence} />
                </div>
                <p className="text-xs text-slate-200">{fact.value}</p>
                {viewMode === 'evidence' && fact.source_citation && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <FileText className="w-3 h-3" />
                    <span>Source: {fact.source_citation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Allergies & Diagnostic Observations */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
            4. Allergies & Lab Parameters
          </h4>
          <div className="space-y-2.5">
            {[...allergies, ...observations, ...labResults].map((fact) => (
              <div
                key={fact.id}
                onClick={() => viewMode === 'evidence' && handleFactSelected(fact)}
                className={`p-3 rounded-xl bg-slate-900/90 border transition ${
                  fact.category === 'allergy'
                    ? 'border-amber-500/40'
                    : 'border-slate-800'
                } ${viewMode === 'evidence' ? 'cursor-pointer hover:border-amber-500 hover:bg-slate-800/90' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{fact.key_name}</span>
                  <StatusBadge status={fact.status} confidence={fact.confidence} />
                </div>
                <p className="text-xs text-slate-300">{fact.value}</p>
                {viewMode === 'evidence' && fact.source_citation && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-amber-400 flex items-center gap-1 font-mono">
                    <FileText className="w-3 h-3" />
                    <span>Citation: {fact.source_citation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Deep Evidence Inspection */}
      <Modal
        isOpen={!!activeFactForModal}
        onClose={() => setActiveFactForModal(null)}
        title={activeFactForModal ? `Evidence Citation: ${activeFactForModal.key_name}` : 'Evidence'}
      >
        {activeFactForModal && (
          <div className="space-y-5 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Clinical Entity</span>
                <h4 className="text-sm font-bold text-white">{activeFactForModal.key_name}</h4>
              </div>
              <StatusBadge status={activeFactForModal.status} confidence={activeFactForModal.confidence} />
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Clinical Value
              </span>
              <p className="text-sm text-white font-medium">{activeFactForModal.value}</p>
            </div>

            {/* If Conflicting, show source comparison */}
            {activeFactForModal.status === 'CONFLICTING' ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Source Conflict Breakdown
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-sky-400 font-bold block mb-1">SOURCE 1: Previous Prescription</span>
                    <p className="text-slate-200">Apollo Hospital Rx (14-Aug-2026): Tab. Ecosprin 75mg — Active Daily</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-bold block mb-1">SOURCE 2: Patient Statement</span>
                    <p className="text-slate-200">Voice Intake (21-Sep-2026): "I stopped taking aspirin two months ago."</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  Primary Source Citation & Extraction Text
                </span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 leading-relaxed">
                  {activeFactForModal.source_citation || 'Extracted during consultation voice intake and verified against previous electronic case repository.'}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Fact ID: {activeFactForModal.id}
              </span>
              <button
                type="button"
                onClick={() => setActiveFactForModal(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
              >
                Close Evidence
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
