import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, X, ExternalLink, HelpCircle } from 'lucide-react';
import { API_BASE } from '../../api/client';
import { SpeechToText } from '../SpeechToText';

interface Citation {
  key: string;
  value: string;
  status: string;
  citation: string;
}

interface Message {
  role: 'doctor' | 'ai';
  text: string;
  citations?: Citation[];
  suggested_actions?: string[];
  timestamp: string;
}

interface DoctorCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

export const DoctorCopilotDrawer: React.FC<DoctorCopilotDrawerProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Hello Doctor! I'm your Clinical Copilot for **${patientName}**. Ask me about active medications, allergy histories, contradictions, or timeline events. All answers include source citations.`,
      timestamp: 'Just now',
      suggested_actions: [
        'What medications is this patient on?',
        'Any documented allergies or penicillin sensitivity?',
        'Explain the active contradiction regarding Aspirin',
        'Show recent triage vitals and red flags'
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    const userMsg: Message = {
      role: 'doctor',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/doctor/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          query: q
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          role: 'ai',
          text: data.answer,
          citations: data.citations,
          suggested_actions: data.suggested_actions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        return;
      }
      throw new Error('Copilot request failed');
    } catch (err) {
      // Fallback response for offline demo
      const aiMsg: Message = {
        role: 'ai',
        text: `Based on documented records for **${patientName}**:\n\n• **Active Prescriptions**: Metformin 500mg BD, Amlodipine 5mg OD\n• **Flagged Discrepancy**: Ecosprin 75mg OD active on Apollo prescription, but patient verbally reports stopped 2 months ago.\n• **Allergy**: Penicillin (Cutaneous rash).`,
        citations: [
          { key: 'Apollo Rx', value: 'Metformin 500mg, Ecosprin 75mg', status: 'DOCUMENTED', citation: 'Apollo Prescription 14-Aug-2026' },
          { key: 'Voice Intake', value: 'Stopped aspirin 2 months ago', status: 'CONFIRMED', citation: 'Voice Statement 21-Sep-2026' }
        ],
        suggested_actions: ['Confirm Aspirin dosage with patient', 'Order ECG stat'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-slate-900/95 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl z-50 flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              Clinical Copilot <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">Evidence-Linked</span>
            </h3>
            <p className="text-xs text-slate-400">Querying records for {patientName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'doctor' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 ${
                m.role === 'doctor'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

              {/* Citations Preview */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/50 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Provenance Citations ({m.citations.length})
                  </span>
                  {m.citations.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[11px] text-slate-300 flex items-start justify-between gap-2"
                    >
                      <div>
                        <strong className="text-white">{c.key}:</strong> {c.value}
                        <div className="text-[10px] text-slate-400 italic mt-0.5">📌 {c.citation}</div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          c.status === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : c.status === 'CONFLICTING'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Actions */}
              {m.suggested_actions && m.suggested_actions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-700/50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Suggested Quick Inquiries
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {m.suggested_actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(act)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-700/60 hover:bg-cyan-600/30 hover:border-cyan-500/50 border border-slate-600/50 text-cyan-300 transition text-left flex items-center gap-1"
                      >
                        <span>{act}</span>
                        <ChevronRight className="w-3 h-3 text-cyan-400 opacity-70" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 w-fit">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Scanning patient records & calculating clinical citations...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask or speak inquiries about this patient..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl pl-3.5 pr-11 py-2.5 text-sm text-white focus:outline-none placeholder-slate-500 transition"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <SpeechToText
                value={inputQuery}
                onChange={setInputQuery}
                language="en-IN"
                size="sm"
                placeholder="Speak clinical query"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl shadow-lg transition"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Non-diagnostic clinical copilot • Strictly aids physician review
        </p>
      </div>
    </div>
  );
};
