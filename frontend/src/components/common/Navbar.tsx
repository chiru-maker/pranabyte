import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Globe, User, Stethoscope, Users, Shield, Compass, LogOut } from 'lucide-react';

interface NavbarProps {
  onLoadDemo?: () => void;
  activeView?: string;
  onNavigate?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoadDemo, activeView, onNavigate }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#fef9ef]/95 backdrop-blur-md border-b border-parchment-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Editorial Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => onNavigate && onNavigate('landing')}
        >
          <div className="w-10 h-10 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-warm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-ink block leading-none">
              Pranabyte
            </span>
            <span className="text-[10px] text-ink-graphite tracking-wider font-semibold uppercase">
              Clinical Intelligence
            </span>
          </div>
        </div>

        {/* Center: Main View Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-parchment-200 p-1 rounded-full border border-parchment-400 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('landing')}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
              activeView === 'landing' ? 'bg-terracotta text-white shadow-warm-sm' : 'text-ink-charcoal hover:text-ink'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('patient');
              if (onNavigate) onNavigate('app');
            }}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
              role === 'patient' && activeView !== 'landing' && activeView !== 'privacy' && activeView !== '404'
                ? 'bg-terracotta text-white shadow-warm-sm'
                : 'text-ink-charcoal hover:text-ink'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Intake</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('doctor');
              if (onNavigate) onNavigate('app');
            }}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
              role === 'doctor' && activeView !== 'landing' && activeView !== 'privacy' && activeView !== '404'
                ? 'bg-terracotta text-white shadow-warm-sm'
                : 'text-ink-charcoal hover:text-ink'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Workstation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('staff');
              if (onNavigate) onNavigate('app');
            }}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
              role === 'staff' && activeView !== 'landing' && activeView !== 'privacy' && activeView !== '404'
                ? 'bg-terracotta text-white shadow-warm-sm'
                : 'text-ink-charcoal hover:text-ink'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Nurse / Triage</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('admin');
              if (onNavigate) onNavigate('app');
            }}
            className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
              role === 'admin' && activeView !== 'landing' && activeView !== 'privacy' && activeView !== '404'
                ? 'bg-terracotta text-white shadow-warm-sm'
                : 'text-ink-charcoal hover:text-ink'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right: Language Selector & Demo Patient Button */}
        <div className="flex items-center gap-3">
          {/* Multilingual Selector */}
          <div className="flex items-center bg-parchment-200 border border-parchment-400 rounded-full px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-terracotta mr-1.5" />
            <select
              aria-label="Select Intake Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-ink font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          {/* Load Sample Demo Patient */}
          {onLoadDemo && (
            <button
              type="button"
              onClick={onLoadDemo}
              className="hidden sm:inline-flex btn-secondary-paper text-xs px-3.5 py-1.5 font-semibold"
            >
              <span>Demo Patient</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
