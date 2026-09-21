import React, { useState } from 'react';
import { Patient } from '../../types';
import { User, Phone, Calendar, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import { SpeechToText } from '../SpeechToText';

interface PatientRegistrationProps {
  onPatientCreated: (patient: Patient) => void;
  onSelectDemoPatient: () => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onPatientCreated,
  onSelectDemoPatient
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Male',
    phone: '',
    abha_id: '',
    is_existing: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone) return;

    setLoading(true);
    const mockPatient: Patient = {
      id: `pat_${Date.now()}`,
      patient_id_display: `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      age: parseInt(formData.age),
      sex: formData.sex,
      phone: formData.phone,
      abha_id: formData.abha_id || '91-8832-1142-9901',
      is_existing: formData.is_existing,
      created_at: new Date().toISOString()
    };
    setTimeout(() => {
      setLoading(false);
      onPatientCreated(mockPatient);
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Patient Identification</h2>
          <p className="text-xs text-slate-400">Step 1: Patient registration & hospital identity</p>
        </div>
        <button
          type="button"
          onClick={onSelectDemoPatient}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Load Demo (Rahul Kumar)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Kumar"
              className="w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <SpeechToText
                value={formData.name}
                onChange={(name) => setFormData(prev => ({ ...prev, name }))}
                language="en-IN"
                size="sm"
                placeholder="Speak patient name"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Age (Years) *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="58"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Sex *
            </label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              ABHA ID (Ayushman Bharat Health Account)
            </label>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Demo Safe Link
            </span>
          </div>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={formData.abha_id}
              onChange={(e) => setFormData({ ...formData, abha_id: e.target.value })}
              placeholder="e.g. 91-8273-9912-0041"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={formData.is_existing}
              onChange={(e) => setFormData({ ...formData, is_existing: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700 focus:ring-cyan-500"
            />
            <span>Patient has previous case records in Apollo Multispeciality database</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/30 transition duration-200"
        >
          {loading ? 'Registering...' : 'Proceed to Consent'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
