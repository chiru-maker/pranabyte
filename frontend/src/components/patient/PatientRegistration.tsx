import React, { useState } from 'react';
import { User, Phone, Calendar, Heart, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types';

interface PatientRegistrationProps {
  onPatientCreated: (patient: Patient) => void;
  onSelectDemoPatient: () => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onPatientCreated,
  onSelectDemoPatient
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male');
  const [phone, setPhone] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || !phone.trim()) {
      setError('Please provide name, age, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const newPatient: Patient = {
        id: `pat_${Date.now()}`,
        patient_id_display: `PAT-DEMO-${Math.floor(100 + Math.random() * 900)}`,
        name: name.trim(),
        age: parseInt(age, 10),
        sex,
        phone: phone.trim(),
        abha_id: abhaId.trim() || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-0001`,
        is_existing: false,
        created_at: new Date().toISOString()
      };
      setIsSubmitting(false);
      onPatientCreated(newPatient);
    }, 300);
  };

  return (
    <div className="max-w-xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Patient Identity & ABHA Link</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          Patient Registration
        </h2>
        <p className="text-xs sm:text-sm text-ink-charcoal">
          Enter patient details to begin a new clinical intake session.
        </p>
      </div>

      {/* Quick Demo Case Selector */}
      <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-ink block">Quick Start: Standard Demo Case</span>
          <span className="text-[11px] text-ink-graphite block">Simulates a patient consultation with prior documented records</span>
        </div>
        <button
          type="button"
          onClick={onSelectDemoPatient}
          className="btn-terracotta text-xs px-4 py-2"
        >
          <span>Load Demo Case</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#fee2e2] text-[#b91c1c] text-xs font-semibold border border-[#fca5a5]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label htmlFor="reg-name" className="block text-ink font-semibold mb-1">
            Patient Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3 text-ink-graphite" />
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full pl-10 pr-4 py-2.5 bg-parchment border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-age" className="block text-ink font-semibold mb-1">
              Age (Years) *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-ink-graphite" />
              <input
                id="reg-age"
                type="number"
                min="1"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="45"
                className="w-full pl-10 pr-4 py-2.5 bg-parchment border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-sex" className="block text-ink font-semibold mb-1">
              Biological Sex *
            </label>
            <select
              id="reg-sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full px-4 py-2.5 bg-parchment border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta cursor-pointer font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="reg-phone" className="block text-ink font-semibold mb-1">
            Contact Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-3 text-ink-graphite" />
            <input
              id="reg-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 90000 00000"
              className="w-full pl-10 pr-4 py-2.5 bg-parchment border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-abha" className="block text-ink font-semibold mb-1">
            ABHA Health ID <span className="text-ink-graphite font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Heart className="w-4 h-4 absolute left-3.5 top-3 text-terracotta" />
            <input
              id="reg-abha"
              type="text"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="e.g. 91-0000-0000-0001"
              className="w-full pl-10 pr-4 py-2.5 bg-parchment border border-parchment-400 rounded-full text-ink text-xs focus:outline-none focus:border-terracotta font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-terracotta text-sm py-3 mt-4"
        >
          {isSubmitting ? (
            <span>Saving Patient Profile...</span>
          ) : (
            <>
              <span>Proceed to Informed Consent</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
