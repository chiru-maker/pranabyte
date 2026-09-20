import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { Activity, Stethoscope, UserCheck, ShieldAlert, Globe, Sparkles } from 'lucide-react';

interface NavbarProps {
  onLoadDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoadDemo }) => {
  const { role, switchRole, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">Patient Story Engine</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                SIH Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Flagship Demo Button */}
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition"
            title="Load Rahul Kumar (58Y) with Documented Diabetes, Aspirin Conflict & Red Flag"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Load Flagship Demo</span>
            <span className="md:hidden">Demo</span>
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700/70 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded ${language === 'en' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 text-xs font-medium rounded ${language === 'hi' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2 py-1 text-xs font-medium rounded ${language === 'kn' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => switchRole('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                role === 'patient'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>
            <button
              onClick={() => switchRole('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                role === 'doctor'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>
            <button
              onClick={() => switchRole('staff')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                role === 'staff'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Hospital Staff</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
