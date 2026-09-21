import React from 'react';
import { FactStatus } from '../../types';
import { CheckCircle2, FileText, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

interface BadgeProps {
  status: FactStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ status, showIcon = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  switch (status) {
    case 'CONFIRMED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-[#dcfce7] text-[#15803d] border border-[#86efac] ${sizeClasses[size]}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>CONFIRMED</span>
        </span>
      );
    case 'DOCUMENTED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd] ${sizeClasses[size]}`}>
          {showIcon && <FileText className="w-3.5 h-3.5" />}
          <span>DOCUMENTED</span>
        </span>
      );
    case 'UNCERTAIN':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-[#fef3c7] text-[#b45309] border border-[#fde68a] ${sizeClasses[size]}`}>
          {showIcon && <AlertCircle className="w-3.5 h-3.5" />}
          <span>UNCERTAIN</span>
        </span>
      );
    case 'CONFLICTING':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] animate-pulse ${sizeClasses[size]}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5" />}
          <span>CONFLICTING</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-parchment-300 text-ink-muted border border-parchment-400 line-through ${sizeClasses[size]}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5" />}
          <span>REJECTED</span>
        </span>
      );
    default:
      return null;
  }
};
