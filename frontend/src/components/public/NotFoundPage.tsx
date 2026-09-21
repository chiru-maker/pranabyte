import React from 'react';
import { Home, Compass, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
  onViewFeatures: () => void;
  onContactSupport?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onViewFeatures,
  onContactSupport
}) => {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-fadeIn">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-terracotta-light text-terracotta flex items-center justify-center border border-terracotta/30 shadow-warm">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase font-bold text-terracotta tracking-widest">HTTP 404 Status</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-ink tracking-tight">
          Clinical Document Not Found
        </h1>
        <p className="text-sm sm:text-base text-ink-charcoal max-w-md mx-auto leading-relaxed">
          The requested page, patient record, or clinical route could not be located in the current session. Please verify the destination or return to the main workstation.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={onGoHome}
          className="btn-terracotta text-sm px-6 py-3 shadow-warm"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          type="button"
          onClick={onViewFeatures}
          className="btn-secondary-paper text-sm px-5 py-3"
        >
          <Compass className="w-4 h-4 text-terracotta" />
          <span>View Platform Features</span>
        </button>

        {onContactSupport && (
          <button
            type="button"
            onClick={onContactSupport}
            className="btn-secondary-paper text-sm px-5 py-3"
          >
            <Mail className="w-4 h-4 text-terracotta" />
            <span>Contact Support</span>
          </button>
        )}
      </div>

      <div className="pt-8 border-t border-parchment-400/60 text-xs text-ink-graphite">
        <span>Pranabyte Clinical Decision Support • System Safe State Guaranteed</span>
      </div>
    </div>
  );
};
