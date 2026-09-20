import React from 'react';
import { FactStatus } from '../../types';
import { CheckCircle2, FileText, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface BadgeProps {
  status: FactStatus;
  confidence?: number;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, confidence, className = '', showIcon = true }) => {
  switch (status) {
    case 'CONFIRMED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 ${className}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          <span>CONFIRMED</span>
          {confidence && <span className="opacity-75">({Math.round(confidence * 100)}%)</span>}
        </span>
      );
    case 'DOCUMENTED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950/80 text-sky-400 border border-sky-500/30 ${className}`}>
          {showIcon && <FileText className="w-3.5 h-3.5 text-sky-400" />}
          <span>DOCUMENTED</span>
          {confidence && <span className="opacity-75">({Math.round(confidence * 100)}%)</span>}
        </span>
      );
    case 'UNCERTAIN':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30 ${className}`}>
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-amber-400" />}
          <span>UNCERTAIN</span>
          {confidence && <span className="opacity-75">({Math.round(confidence * 100)}%)</span>}
        </span>
      );
    case 'CONFLICTING':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/90 text-rose-400 border border-rose-500/40 animate-pulse ${className}`}>
          {showIcon && <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />}
          <span>CONFLICTING</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
          <span>{status}</span>
        </span>
      );
  }
};
