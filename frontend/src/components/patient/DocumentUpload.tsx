import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentProcessed?: () => void;
  onProceedToDoctor: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentProcessed,
  onProceedToDoctor
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: string; extractions: string[] }[]>([
    {
      name: 'Apollo_Cardiology_Rx_14Aug2026.pdf',
      status: 'OCR Verified (98% Confidence)',
      extractions: [
        'Tab. Metformin 500mg BD [Active]',
        'Tab. Amlodipine 5mg OD [Active]',
        'Tab. Ecosprin 75mg OD [Documented Active]',
        'Known Allergy: Penicillin (Severe Cutaneous)'
      ]
    }
  ]);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setUploadedFiles(prev => [
        {
          name: 'Echo_ECG_Report_Aug2026.pdf',
          status: 'OCR Completed (96% Confidence)',
          extractions: [
            'LVEF 55% (Normal LV systolic function)',
            'Mild concentric LVH noted'
          ]
        },
        ...prev
      ]);
      setIsUploading(false);
      if (onDocumentProcessed) onDocumentProcessed();
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 5: Optical Character Recognition (OCR)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          Upload Prior Prescriptions & Reports
        </h2>
        <p className="text-xs sm:text-sm text-ink-charcoal max-w-md mx-auto">
          Pranabyte extracts historical medications, lab values, and allergies directly from physical documents.
        </p>
      </div>

      {/* Upload Drop Area */}
      <div
        onClick={handleSimulateUpload}
        className="p-8 rounded-2xl bg-parchment border-2 border-dashed border-parchment-400 hover:border-terracotta flex flex-col items-center justify-center text-center cursor-pointer transition group"
      >
        <div className="w-14 h-14 rounded-full bg-terracotta-light text-terracotta flex items-center justify-center mb-3 group-hover:scale-110 transition">
          {isUploading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
        </div>
        <span className="text-sm font-bold text-ink block mb-1">
          {isUploading ? 'Scanning & Ingesting Medical Document...' : 'Click to Upload Prescription or Lab PDF'}
        </span>
        <span className="text-xs text-ink-graphite">
          Supports PDF, JPG, PNG from phone camera or hospital records
        </span>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-ink block">
          Ingested Documents & Clinical Extractions:
        </span>

        {uploadedFiles.map((doc, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-ink">
                <FileText className="w-4 h-4 text-terracotta" />
                <span>{doc.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-semibold text-[10px]">
                {doc.status}
              </span>
            </div>

            <div className="pl-6 space-y-1">
              {doc.extractions.map((ext, i) => (
                <div key={i} className="text-ink-charcoal flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                  <span>{ext}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProceedToDoctor}
          className="w-full btn-terracotta text-sm py-3.5"
        >
          <span>Proceed to Patient Self-Review & Verification</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
