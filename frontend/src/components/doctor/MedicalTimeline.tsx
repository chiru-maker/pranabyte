import React from 'react';
import { TimelineEvent } from '../../types';
import { Badge } from '../ui/Badge';
import { Calendar, Clock, FileText, CheckCircle2, History } from 'lucide-react';

interface MedicalTimelineProps {
  timelineEvents: TimelineEvent[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ timelineEvents }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="paper-card p-6 border-terracotta/30 bg-[#f5eee1] space-y-3">
        <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-terracotta" />
            <h2 className="text-xl font-serif font-bold text-ink">
              Chronological Medical Timeline
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-parchment border border-parchment-400 text-ink">
            {timelineEvents.length} Events Reconstructed
          </span>
        </div>
        <p className="text-xs text-ink-charcoal leading-relaxed">
          Reconstructed longitudinal patient trajectory combining past hospital encounters, prescriptions, and current acute complaints.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-parchment-400">
        {timelineEvents.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline Pin Node */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-[#fef9ef] shadow-warm-sm">
              {idx + 1}
            </div>

            <div className="paper-card p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-300 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-ink text-sm">
                    {evt.event_title}
                  </span>
                  <Badge status={evt.status} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-terracotta font-semibold font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.event_date}</span>
                </div>
              </div>

              <p className="text-xs text-ink-charcoal leading-relaxed">
                {evt.event_description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-ink-graphite font-mono">
                <span>Source: {evt.source_type}</span>
                <span>Confidence: {Math.round(evt.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
