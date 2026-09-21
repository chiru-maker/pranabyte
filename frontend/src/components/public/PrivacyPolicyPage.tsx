import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-parchment-400 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary-paper text-xs px-4 py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Platform</span>
        </button>
        <span className="text-xs text-ink-graphite font-medium">Last Updated: September 2026 • Policy Version 1.0</span>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Healthcare Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink">
          Pranabyte Privacy Policy & Clinical Data Governance
        </h1>
        <p className="text-sm text-ink-charcoal leading-relaxed">
          This document outlines the strict data protection protocols, processing standards, and patient privacy safeguards implemented within the Pranabyte Clinical Intelligence Platform.
        </p>
      </div>

      {/* Mandatory Legal Review Banner */}
      <div className="p-4 rounded-2xl bg-parchment-200 border border-parchment-400 text-xs text-ink-charcoal flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-ink block mb-0.5">Notice to Healthcare Providers & System Administrators:</span>
          <span>
            This document outlines the technical privacy architecture of the Pranabyte platform. Prior to live clinical production deployment, healthcare institutions must review and tailor this privacy policy with their designated legal and data protection officers in accordance with applicable regional healthcare privacy legislation (such as India’s Digital Personal Data Protection Act / ABDM DISHA regulations, HIPAA, or GDPR).
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6 text-sm text-ink-charcoal leading-relaxed">
        {/* 1. Information Collected */}
        <section className="paper-card p-6 space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink">1. Information We Collect</h2>
          <p>
            When healthcare personnel or patients utilize Pranabyte, the platform processes the following categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-charcoal">
            <li><strong>Patient Demographics</strong>: Name, age, biological sex, contact phone number, and Ayushman Bharat Health Account (ABHA) address.</li>
            <li><strong>Clinical & Health Observations</strong>: Chief medical complaints, symptom onset, severity, historical diagnoses, past surgeries, and documented drug allergies.</li>
            <li><strong>Vital Signs & Nursing Measurements</strong>: Blood pressure, heart rate, oxygen saturation (SpO2), body temperature, and respiratory rate.</li>
            <li><strong>Medical Documents</strong>: Uploaded physical prescriptions, discharge summaries, and diagnostic laboratory reports processed via optical character recognition (OCR).</li>
          </ul>
        </section>

        {/* 2. Voice & Audio Processing */}
        <section className="paper-card p-6 space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink">2. Voice & Audio Processing (Speech-to-Text)</h2>
          <p>
            Pranabyte features speech-first case taking. Patient voice streams in Hindi, Kannada, and English are processed locally in real-time using standard Web Speech APIs or encrypted ephemeral audio pipelines:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-charcoal">
            <li>Voice data is converted directly into text transcripts for clinical fact extraction.</li>
            <li>Audio files are not retained permanently on public servers once transcription and patient review are completed unless explicitly configured for institutional training under informed consent.</li>
            <li>Patients may inspect, edit, or clear transcribed text at any stage prior to clinician submission.</li>
          </ul>
        </section>

        {/* 3. AI Processing & Non-Diagnostic Clinical Boundaries */}
        <section className="paper-card p-6 space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink">3. Artificial Intelligence & Clinical Decision Support Safeguards</h2>
          <p>
            All natural language processing, entity extraction, and summary generation performed by Pranabyte are designed with strict medical guardrails:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-charcoal">
            <li><strong>Explicit Non-Diagnostic Role</strong>: The AI does not diagnose illnesses, prescribe medications, or independently modify medical records.</li>
            <li><strong>Traceable Attribution</strong>: Every extracted clinical fact is linked directly to its source citation (e.g. spoken statement or specific prescription page).</li>
            <li><strong>Mandatory Physician Verification</strong>: Draft summaries (AI Doctor Briefs) require licensed clinician review, modification, and final legal sign-off.</li>
          </ul>
        </section>

        {/* 4. Data Security & Storage */}
        <section className="paper-card p-6 space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink">4. Data Security, Encryption & Storage</h2>
          <p>
            We implement defense-in-depth security measures to protect sensitive patient health information (PHI):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-charcoal">
            <li><strong>Encryption at Rest & in Transit</strong>: All data is encrypted using AES-256 at rest and TLS 1.3 in transit.</li>
            <li><strong>Role-Based Access Control (RBAC)</strong>: System access is strictly partitioned between Patients, Doctors, Nurses, and Administrators.</li>
            <li><strong>Immutable Audit Trails</strong>: Every access, verification, modification, or export of patient records is logged in tamper-evident audit tables.</li>
          </ul>
        </section>

        {/* 5. Patient Rights & Deletion */}
        <section className="paper-card p-6 space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink">5. Patient Rights & Data Control</h2>
          <p>
            Patients retain full sovereignty over their health data in accordance with applicable health privacy frameworks. Patients may request:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-charcoal">
            <li>A complete copy of their documented case history in standard HL7 FHIR R4 format.</li>
            <li>Correction of inaccurate biographical or historical symptom entries.</li>
            <li>Revocation of consent for AI-assisted intake processing.</li>
          </ul>
        </section>

        {/* 6. Contact Information */}
        <section className="paper-card p-6 space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink">6. Data Protection Officer Contact</h2>
          <p>
            For questions regarding privacy practices, security audits, or data rights requests, please contact our clinical compliance coordinator at:
          </p>
          <div className="p-3 rounded-xl bg-parchment border border-parchment-400 text-xs font-mono text-ink">
            Email: privacy@pranabyte.health | Clinical Data Governance Office
          </div>
        </section>
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onBack}
          className="btn-terracotta text-sm px-6 py-2.5"
        >
          <span>Acknowledge & Return</span>
        </button>
      </div>
    </div>
  );
};
