import React, { useState } from 'react';
import { Patient } from '../../types';
import { Users, Search, Plus, Activity, Heart, ArrowRight, UserPlus, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface StaffDashboardProps {
  onSelectPatient: (patient: Patient) => void;
  onNewPatient: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onSelectPatient,
  onNewPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [queuePatients] = useState<Patient[]>([
    {
      id: 'pat_demo_01',
      patient_id_display: 'PAT-DEMO-001',
      name: 'Demo Patient',
      age: 58,
      sex: 'Male',
      phone: '+91 90000 00001',
      abha_id: '91-0000-1111-2222',
      is_existing: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'pat_sunita_02',
      patient_id_display: 'PAT-DEMO-002',
      name: 'Sunita Devi',
      age: 46,
      sex: 'Female',
      phone: '+91 90000 00002',
      abha_id: '91-4412-3321-9988',
      is_existing: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'pat_manjunath_03',
      patient_id_display: 'PAT-DEMO-003',
      name: 'Manjunath Gowda',
      age: 62,
      sex: 'Male',
      phone: '+91 90000 00003',
      abha_id: '91-6677-8899-0011',
      is_existing: false,
      created_at: new Date().toISOString()
    }
  ]);

  const filtered = queuePatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-parchment-400 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Hospital Triage & Reception Workstation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            OPD Patient Queue & Vitals Desk
          </h1>
        </div>

        <button
          type="button"
          onClick={onNewPatient}
          className="btn-terracotta text-xs px-5 py-2.5 shadow-warm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Nursing Triage Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="paper-card p-5 space-y-1">
          <span className="text-xs font-semibold text-ink-graphite">Patients in OPD Queue</span>
          <p className="text-2xl font-serif font-bold text-ink">3 Waiting</p>
          <span className="text-[11px] text-terracotta font-medium">1 High Priority (Chest Pain)</span>
        </div>

        <div className="paper-card p-5 space-y-1">
          <span className="text-xs font-semibold text-ink-graphite">Average Voice Intake Time</span>
          <p className="text-2xl font-serif font-bold text-ink">1.8 Mins</p>
          <span className="text-[11px] text-[#15803d] font-medium">78% faster than paper forms</span>
        </div>

        <div className="paper-card p-5 space-y-1">
          <span className="text-xs font-semibold text-ink-graphite">OCR Prescription Ingestion</span>
          <p className="text-2xl font-serif font-bold text-ink">98.4% Accuracy</p>
          <span className="text-[11px] text-[#1e40af] font-medium">Verified Prescription Ingestion</span>
        </div>
      </div>

      {/* Search & Patient List */}
      <div className="paper-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-400 pb-3">
          <h2 className="text-lg font-serif font-bold text-ink">
            Active Patients Awaiting Consultation
          </h2>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-ink-graphite" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, or phone..."
              className="pl-9 pr-4 py-2 text-xs bg-parchment border border-parchment-400 rounded-full text-ink focus:outline-none focus:border-terracotta w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment-200 text-ink-graphite uppercase font-semibold border-b border-parchment-400">
              <tr>
                <th className="p-3">Patient Name</th>
                <th className="p-3">ID / ABHA</th>
                <th className="p-3">Age/Sex</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-400">
              {filtered.map((pat) => (
                <tr key={pat.id} className="hover:bg-parchment-300/50 transition">
                  <td className="p-3 font-bold text-ink">{pat.name}</td>
                  <td className="p-3 font-mono text-ink-graphite">
                    <div>{pat.patient_id_display}</div>
                    <div className="text-[10px] text-terracotta">{pat.abha_id || '91-0000-1111-2222'}</div>
                  </td>
                  <td className="p-3 text-ink-charcoal">{pat.age}Y, {pat.sex}</td>
                  <td className="p-3 font-mono text-ink-graphite">{pat.phone}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-parchment border border-parchment-400 text-ink text-[10px] font-semibold">
                      Waiting for Doctor
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectPatient(pat)}
                      className="btn-terracotta text-xs px-3.5 py-1.5"
                    >
                      <span>Open Doctor Station</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
