import React from 'react';
import { Sparkles, Mic, FileText, ShieldAlert, CheckCircle2, ArrowRight, Activity, Clock, ShieldCheck, HeartPulse, UserCheck } from 'lucide-react';

interface LandingPageProps {
  onStartIntake: () => void;
  onDoctorLogin: () => void;
  onStaffLogin: () => void;
  onViewPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartIntake,
  onDoctorLogin,
  onStaffLogin,
  onViewPrivacy
}) => {
  return (
    <div className="space-y-16 py-6 animate-fadeIn">
      {/* Editorial Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evidence-Linked Clinical Case Intelligence</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-ink tracking-tight leading-[1.15]">
          A Humane, Voice-First Intake Platform for Modern Healthcare.
        </h1>
        
        <p className="text-base sm:text-lg text-ink-charcoal max-w-2xl mx-auto leading-relaxed font-normal">
          Pranabyte converts natural patient speech in Hindi, Kannada, and English into structured clinical facts, computes case completeness, screens safety red-flags, and prepares physician briefs in seconds.
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onStartIntake}
            className="btn-terracotta text-base px-8 py-3.5 shadow-warm hover:shadow-warm-lg"
          >
            <Mic className="w-5 h-5" />
            <span>Start Voice Intake</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            type="button"
            onClick={onDoctorLogin}
            className="btn-secondary-paper text-base px-6 py-3.5"
          >
            <HeartPulse className="w-5 h-5 text-terracotta" />
            <span>Physician Workstation</span>
          </button>
        </div>

        {/* Clinical Transparency Notice */}
        <p className="text-xs text-ink-graphite max-w-lg mx-auto italic">
          *Notice: Pranabyte provides non-diagnostic clinical decision support. All AI summaries require licensed clinician verification before becoming legal medical records.
        </p>
      </section>

      {/* Signature Capabilities Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            Engineered for Precision, Safety & Empathy
          </h2>
          <p className="text-sm text-ink-graphite max-w-xl mx-auto">
            Eliminating 80% of repetitive documentation while surfacing critical medication conflicts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="paper-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center border border-[#86efac]">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink">
              Multilingual Voice Intake
            </h3>
            <p className="text-sm text-ink-charcoal leading-relaxed">
              Patients describe their symptoms naturally in their mother tongue. The engine extracts timeline, severity, and duration without forcing rigid forms.
            </p>
            <div className="text-xs font-semibold text-[#15803d] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hindi, Kannada & English Supported</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="paper-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center border border-[#fca5a5]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink">
              Red-Flag & Conflict Screening
            </h3>
            <p className="text-sm text-ink-charcoal leading-relaxed">
              Automatically flags unsupervised medication cessation, acute coronary symptom clusters, and allergic contraindications across historic records.
            </p>
            <div className="text-xs font-semibold text-[#b91c1c] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deterministic Clinical Safety Guardrails</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="paper-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] text-[#1e40af] flex items-center justify-center border border-[#93c5fd]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink">
              Case Completeness Engine
            </h3>
            <p className="text-sm text-ink-charcoal leading-relaxed">
              Computes missing clinical data in real-time. Features one-click "Ask Patient Now" prompts to probe only unconfirmed diagnostic details.
            </p>
            <div className="text-xs font-semibold text-[#1e40af] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Avoids 12+ Redundant Questions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Case Journey Pipeline Preview */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="paper-card p-8 border-terracotta/30 bg-[#f5eee1]/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-parchment-400/60 pb-4">
            <div>
              <span className="text-xs uppercase font-bold text-terracotta tracking-wider">The Pranabyte Pipeline</span>
              <h3 className="text-xl font-serif font-bold text-ink">End-to-End Evidence-Linked Journey</h3>
            </div>
            <button
              type="button"
              onClick={onDoctorLogin}
              className="btn-terracotta text-xs px-4 py-2"
            >
              Explore Live Clinical Station
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-parchment border border-parchment-400 space-y-1">
              <span className="text-[10px] font-bold text-ink-graphite">STAGE 1</span>
              <p className="text-xs font-semibold text-ink">Patient's Spoken Words</p>
            </div>
            <div className="p-3 rounded-2xl bg-parchment border border-parchment-400 space-y-1">
              <span className="text-[10px] font-bold text-ink-graphite">STAGE 2</span>
              <p className="text-xs font-semibold text-ink">AI Entity Extraction</p>
            </div>
            <div className="p-3 rounded-2xl bg-parchment border border-parchment-400 space-y-1">
              <span className="text-[10px] font-bold text-ink-graphite">STAGE 3</span>
              <p className="text-xs font-semibold text-ink">Adaptive Questions</p>
            </div>
            <div className="p-3 rounded-2xl bg-parchment border border-parchment-400 space-y-1">
              <span className="text-[10px] font-bold text-ink-graphite">STAGE 4</span>
              <p className="text-xs font-semibold text-ink">Patient Self-Review</p>
            </div>
            <div className="p-3 rounded-2xl bg-parchment border border-parchment-400 space-y-1">
              <span className="text-[10px] font-bold text-ink-graphite">STAGE 5</span>
              <p className="text-xs font-semibold text-ink">Doctor Verification</p>
            </div>
            <div className="p-3 rounded-2xl bg-terracotta-light border border-terracotta/30 space-y-1">
              <span className="text-[10px] font-bold text-terracotta">STAGE 6</span>
              <p className="text-xs font-semibold text-terracotta font-bold">FHIR R4 Final Case</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Navigation Footer Hub */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4 pt-4">
        <h3 className="text-lg font-serif font-bold text-ink">Access Dedicated Hospital Portals</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartIntake}
            className="btn-secondary-paper text-xs px-4 py-2"
          >
            <UserCheck className="w-3.5 h-3.5 text-terracotta" />
            <span>Patient Intake</span>
          </button>
          <button
            type="button"
            onClick={onDoctorLogin}
            className="btn-secondary-paper text-xs px-4 py-2"
          >
            <HeartPulse className="w-3.5 h-3.5 text-terracotta" />
            <span>Doctor Workstation</span>
          </button>
          <button
            type="button"
            onClick={onStaffLogin}
            className="btn-secondary-paper text-xs px-4 py-2"
          >
            <FileText className="w-3.5 h-3.5 text-terracotta" />
            <span>Nurse / Triage Desk</span>
          </button>
          <button
            type="button"
            onClick={onViewPrivacy}
            className="btn-secondary-paper text-xs px-4 py-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
            <span>Privacy & Health Data Policy</span>
          </button>
        </div>
      </section>
    </div>
  );
};
