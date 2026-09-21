import React, { useState } from 'react';
import { FileCode, Download, Copy, Check, CheckCircle2 } from 'lucide-react';
import { Visit, Patient, ClinicalFact } from '../../types';

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
  if (!isOpen) return null;

  const [isCopied, setIsCopied] = useState(false);

  // Generate FHIR R4 Bundle JSON
  const fhirBundle = {
    resourceType: "Bundle",
    id: `bundle-${visit.id}`,
    type: "document",
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:${patient.id}`,
        resource: {
          resourceType: "Patient",
          id: patient.id,
          identifier: [
            { system: "https://healthid.ndhm.gov.in", value: patient.abha_id || "91-8273-9912-0041" },
            { system: "hospital:patient_id", value: patient.patient_id_display }
          ],
          name: [{ text: patient.name, family: patient.name.split(' ').slice(1).join(' '), given: [patient.name.split(' ')[0]] }],
          gender: patient.sex.toLowerCase(),
          telecom: [{ system: "phone", value: patient.phone }]
        }
      },
      {
        fullUrl: `urn:uuid:${visit.id}`,
        resource: {
          resourceType: "Encounter",
          id: visit.id,
          status: "finished",
          class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "AMB", display: "ambulatory" },
          subject: { reference: `urn:uuid:${patient.id}`, display: patient.name }
        }
      },
      ...facts.map((fact) => ({
        fullUrl: `urn:uuid:${fact.id}`,
        resource: {
          resourceType: fact.category === 'medication' ? "MedicationStatement" : fact.category === 'allergy' ? "AllergyIntolerance" : "Condition",
          id: fact.id,
          status: fact.doctor_verified ? "active" : "unconfirmed",
          code: { text: fact.key_name },
          note: [{ text: fact.value }],
          verificationStatus: {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: fact.doctor_verified ? "confirmed" : "unconfirmed" }]
          }
        }
      }))
    ]
  };

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_R4_Bundle_${patient.patient_id_display}_${visit.visit_number}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-3xl w-full paper-card p-6 sm:p-8 max-h-[90vh] flex flex-col space-y-4 shadow-warm-xl border border-parchment-400">
        <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-terracotta" />
            <div>
              <h2 className="font-serif font-bold text-ink text-lg">
                HL7 FHIR R4 Clinical Bundle Export
              </h2>
              <span className="text-[11px] font-mono text-ink-graphite">
                ABDM / ABDC Health Data Interoperability Standard
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-graphite hover:text-ink font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-parchment border border-parchment-400 text-xs">
          <pre className="font-mono text-[11px] text-ink whitespace-pre-wrap leading-relaxed">
            {jsonString}
          </pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-parchment-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary-paper text-xs px-3 py-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#15803d]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="btn-terracotta text-xs px-4 py-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download FHIR Bundle (.json)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary-paper text-xs px-4 py-1.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
