import React, { useState } from 'react';
import { TimelineEvent } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { Calendar, FileText, Mic, Stethoscope, ChevronRight, Eye } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface MedicalTimelineProps {
  events: TimelineEvent[];
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'voice_intake':
        return <Mic className="w-4 h-4 text-amber-400" />;
      case 'prescription':
      case 'uploaded_document':
      case 'lab':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'doctor_note':
        return <Stethoscope className="w-4 h-4 text-emerald-400" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Chronological Medical Story Timeline</span>
          </h3>
          <p className="text-xs text-slate-400">Reconstructed across hospital visits, uploads & patient statements</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
          {events.length} Milestones
        </span>
      </div>

      {/* Timeline Graphic */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-sky-500 before:to-indigo-500">
        {events.map((event, idx) => (
          <div 
            key={event.id || idx}
            onClick={() => setSelectedEvent(event)}
            className="group relative cursor-pointer"
          >
            {/* Dot Node */}
            <div className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition group-hover:scale-125 ${
              event.status === 'CONFLICTING'
                ? 'bg-rose-950 border-rose-500'
                : event.status === 'CONFIRMED'
                ? 'bg-emerald-950 border-emerald-500'
                : 'bg-slate-900 border-cyan-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                event.status === 'CONFLICTING' ? 'bg-rose-400' : event.status === 'CONFIRMED' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`} />
            </div>

            {/* Event Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 group-hover:border-cyan-500/50 group-hover:bg-slate-800/80 transition space-y-2 shadow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                    {event.event_date}
                  </span>
                  <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                    {event.event_title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={event.status} confidence={event.confidence} />
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {event.event_description}
              </p>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                {getSourceIcon(event.source_type)}
                <span className="capitalize">Source: {event.source_type.replace('_', ' ')}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 hover:underline flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Click to inspect evidence
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drill-down Modal for Timeline Event Evidence */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent ? `Evidence Inspection: ${selectedEvent.event_title}` : 'Evidence'}
      >
        {selectedEvent && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-400 block">Timeline Date</span>
                <span className="text-sm font-bold text-white">{selectedEvent.event_date}</span>
              </div>
              <StatusBadge status={selectedEvent.status} confidence={selectedEvent.confidence} />
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Event Description
              </span>
              <p className="text-white text-sm leading-relaxed">{selectedEvent.event_description}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Evidence Provenance & Citation
              </span>
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800">
                Source Type: {selectedEvent.source_type.toUpperCase()}<br/>
                Verification Confidence: {Math.round(selectedEvent.confidence * 100)}%<br/>
                Reference: Apollo Multi-Encounter Case Repository
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 font-semibold text-xs"
              >
                Close Evidence Viewer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
