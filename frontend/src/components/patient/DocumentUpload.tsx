import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

interface DocumentUploadProps {
  onDocumentProcessed: () => void;
  onProceedToDoctor: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentProcessed,
  onProceedToDoctor
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState('prescription');
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  const handleSimulateOCR = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setExtractedData({
        filename: 'Apollo_Prescription_14Aug2026.pdf',
        hospital: 'Apollo Multispeciality Hospitals, Bangalore',
        date: '14-Aug-2026',
        doctor: 'Dr. S. K. Narayanan, MD (Internal Medicine)',
        entities: [
          { type: 'Condition', val: 'Type 2 Diabetes Mellitus (T2DM)', status: 'DOCUMENTED', conf: 0.99 },
          { type: 'Condition', val: 'Essential Systemic Hypertension', status: 'DOCUMENTED', conf: 0.96 },
          { type: 'Medication', val: 'Tab. Metformin 500mg (1-0-1) After Food', status: 'DOCUMENTED', conf: 0.98 },
          { type: 'Medication', val: 'Tab. Ecosprin (Aspirin) 75mg (0-1-0) [ACTIVE]', status: 'DOCUMENTED', conf: 0.95 },
          { type: 'Medication', val: 'Tab. Amlodipine 5mg? (Morning) [Blurry Text]', status: 'UNCERTAIN', conf: 0.72 },
          { type: 'Allergy', val: 'Penicillin (Severe Cutaneous Hypersensitivity)', status: 'DOCUMENTED', conf: 0.95 },
          { type: 'Observation', val: 'Blood Pressure: 142/90 mmHg', status: 'DOCUMENTED', conf: 0.93 },
          { type: 'Lab Value', val: 'HbA1c: 7.8% (Borderline)', status: 'DOCUMENTED', conf: 0.97 }
        ]
      });
      onDocumentProcessed();
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-slate-700/80 shadow-2xl animate-fadeIn space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Upload Medical Records & Prescriptions</h2>
          <p className="text-xs text-slate-400">PDF, JPG, PNG supported • Automated OCR with 🔵 DOCUMENTED status tagging</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
          OCR Engine v1.0
        </span>
      </div>

      {/* Upload Dropzone */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-900/60 text-center transition">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 text-cyan-400" />
        </div>
        <h4 className="text-sm font-semibold text-white">Select Previous Hospital Prescription or Report</h4>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Click below to load sample prescription or choose from device
        </p>

        <div className="flex items-center justify-center gap-3">
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
          >
            <option value="prescription">Prescription</option>
            <option value="lab_report">Lab Report (Blood / ECG)</option>
            <option value="discharge_summary">Discharge Summary</option>
          </select>

          <button
            type="button"
            onClick={handleSimulateOCR}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{uploading ? 'Processing OCR...' : 'Process Prescription OCR'}</span>
          </button>
        </div>
      </div>

      {/* Extracted Entities List */}
      {extractedData && (
        <div className="space-y-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {extractedData.filename}
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              ✓ 8 Clinical Entities Extracted
            </span>
          </div>

          <div className="text-xs text-slate-400">
            <strong>Facility:</strong> {extractedData.hospital} | <strong>Date:</strong> {extractedData.date}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {extractedData.entities.map((ent: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 font-medium mr-2">[{ent.type}]</span>
                  <span className="text-white font-semibold">{ent.val}</span>
                </div>
                <StatusBadge status={ent.status} confidence={ent.conf} />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-300">
            ℹ️ <strong>Safety Rule:</strong> OCR extractions are never automatically treated as final clinical truth. All items marked as 🔵 DOCUMENTED or 🟡 UNCERTAIN for doctor verification.
          </div>
        </div>
      )}

      {/* Proceed to Doctor */}
      <button
        type="button"
        onClick={onProceedToDoctor}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
      >
        <span>Open Doctor Consultation Portal</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
