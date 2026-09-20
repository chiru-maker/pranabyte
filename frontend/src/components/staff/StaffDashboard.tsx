import React from 'react';
import { Users, Clock, AlertTriangle, AlertOctagon, CheckCircle2, UserPlus, Eye, ArrowRight } from 'lucide-react';
import { Patient } from '../../types';

interface StaffDashboardProps {
  onSelectPatient: (patient: Patient) => void;
  onNewPatient: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onSelectPatient,
  onNewPatient
}) => {
  const stats = [
    { label: 'Waiting Patients', count: 7, color: 'text-sky-400', bg: 'bg-sky-950/60', border: 'border-sky-500/40', icon: Clock },
    { label: 'Ready for Doctor', count: 4, color: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-500/40', icon: CheckCircle2 },
    { label: 'Requires Verification', count: 2, color: 'text-amber-400', bg: 'bg-amber-950/60', border: 'border-amber-500/40', icon: AlertTriangle },
    { label: 'Red-Flag Alert Cases', count: 1, color: 'text-rose-400', bg: 'bg-rose-950/60', border: 'border-rose-500/40', icon: AlertOctagon },
  ];

  const queuePatients = [
    { id: 'pat_01', name: 'Rahul Kumar', age: 58, sex: 'Male', status: 'RED FLAG ALERT', complaint: 'Chest pain + Breathlessness for 3 days', time: '10:42 AM', isDemo: true },
    { id: 'pat_02', name: 'Meenakshi Sundaram', age: 64, sex: 'Female', status: 'Ready for Doctor', complaint: 'Follow up for Diabetic Retinopathy review', time: '10:50 AM', isDemo: false },
    { id: 'pat_03', name: 'Siddharth Varma', age: 34, sex: 'Male', status: 'Requires Verification', complaint: 'Uncertain penicillin allergy declaration', time: '11:05 AM', isDemo: false },
    { id: 'pat_04', name: 'Kavita Joshi', age: 49, sex: 'Female', status: 'Waiting Intake', complaint: 'Mild hypertension checkup', time: '11:15 AM', isDemo: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Hospital Staff Operations</span>
          <h1 className="text-xl font-bold text-white tracking-tight">Triage & Patient Queue Coordinator</h1>
          <p className="text-xs text-slate-400">OPD Department • Apollo Multispeciality Bangalore</p>
        </div>
        <button
          type="button"
          onClick={onNewPatient}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient Intake</span>
        </button>
      </div>

      {/* Operational Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl ${st.bg} border ${st.border} glass-card space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{st.label}</span>
                <Icon className={`w-5 h-5 ${st.color}`} />
              </div>
              <div className={`text-3xl font-black ${st.color}`}>{st.count}</div>
            </div>
          );
        })}
      </div>

      {/* Queue Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Active Triage Queue</span>
          </h3>
          <span className="text-xs text-slate-400">Auto-refreshes with intake updates</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {queuePatients.map((p) => (
            <div 
              key={p.id} 
              className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                  p.status.includes('RED FLAG') ? 'bg-rose-600 animate-pulse' : 'bg-slate-800'
                }`}>
                  {p.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    <span className="text-[11px] text-slate-400">({p.sex}, {p.age}Y)</span>
                    {p.isDemo && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Demo Patient
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{p.complaint}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    p.status.includes('RED FLAG')
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : p.status.includes('Ready')
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-slate-900 text-amber-300 border-slate-700'
                  }`}>
                    {p.status}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 font-mono">{p.time}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const mockP: Patient = {
                      id: p.id,
                      patient_id_display: 'PAT-2026-0891',
                      name: p.name,
                      age: p.age,
                      sex: p.sex,
                      phone: '+91 98765 43210',
                      abha_id: '91-8273-9912-0041',
                      is_existing: true,
                      created_at: new Date().toISOString()
                    };
                    onSelectPatient(mockP);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Story</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
