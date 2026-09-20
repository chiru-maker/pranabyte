import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Patient, Visit, ClinicalFact } from '../../types';
import { Download, Copy, Check, FileCode, ShieldCheck } from 'lucide-react';

interface FhirExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  visit: Visit;
  facts: ClinicalFact[];
}

export const FhirExportModal: React.FC<FhirExportModalProps> = ({
  isOpen,
  onClose,
  patient,
  visit,
  facts
}) => {
  const [copied, setCopied] = useState(false);

  // Generate FHIR R4 Bundle JSON
  const fhirBundle = {
    resourceType: "Bundle",
    id: `bundle-patient-${patient.patient_id_display}`,
    type: "document",
    timestamp: new Date().toISOString(),
    total: facts.length + 2,
    entry: [
      {
        fullUrl: `urn:uuid:${patient.id}`,
        resource: {
          resourceType: "Patient",
          id: patient.id,
          identifier: [
            {
              system: "https://healthid.ndhm.gov.in",
              value: patient.abha_id || "DEMO-ABHA-91-8273-9912-0041"
            },
            {
              system: "urn:hospital:patient-id",
              value: patient.patient_id_display
            }
          ],
          active: true,
          name: [{ text: patient.name, family: patient.name.split(' ').slice(1).join(' '), given: [patient.name.split(' ')[0]] }],
          gender: patient.sex.toLowerCase(),
          telecom: [{ system: "phone", value: patient.phone, use: "mobile" }]
        }
      },
      {
        fullUrl: `urn:uuid:${visit.id}`,
        resource: {
          resourceType: "Encounter",
          id: visit.id,
          status: visit.doctor_verified ? "finished" : "in-progress",
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory"
          },
          subject: { reference: `urn:uuid:${patient.id}`, display: patient.name },
          reasonCode: [{ text: visit.chief_complaint || "Cardiopulmonary Evaluation" }]
        }
      },
      ...facts.map((fact) => ({
        fullUrl: `urn:uuid:${fact.id}`,
        resource: {
          resourceType: fact.category === 'medication' ? "MedicationStatement" : fact.category === 'allergy' ? "AllergyIntolerance" : "Condition",
          id: fact.id,
          clinicalStatus: {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
          },
          verificationStatus: {
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              code: fact.status === 'CONFIRMED' || fact.doctor_verified ? "confirmed" : "provisional"
            }]
          },
          code: { text: `${fact.key_name}: ${fact.value}` },
          subject: { reference: `urn:uuid:${patient.id}` },
          note: [{ text: `Evidence Status: ${fact.status} | Provenance: ${fact.source_citation || 'Consultation intake'}` }]
        }
      }))
    ]
  };

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_Bundle_${patient.patient_id_display}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="HL7 FHIR R4 Bundle Export (ABDM Architecture Ready)"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-500/40 text-sky-200 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Standardized Interoperability</span>
            Structured internal patient story mapped into HL7 FHIR R4 resources (`Patient`, `Encounter`, `Condition`, `MedicationStatement`, `AllergyIntolerance`) with evidence annotations.
          </div>
        </div>

        {/* JSON Display */}
        <div className="relative">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto max-h-96 leading-relaxed">
            {jsonString}
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-slate-400 font-mono">
            {fhirBundle.entry.length} FHIR Resources Generated
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download FHIR Bundle (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
