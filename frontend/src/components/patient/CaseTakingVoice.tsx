import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Edit3, Send, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CaseTakingVoiceProps {
  onProcessTranscript: (transcript: string) => void;
  loading: boolean;
}

export const CaseTakingVoice: React.FC<CaseTakingVoiceProps> = ({
  onProcessTranscript,
  loading
}) => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback preset demo voice simulation
      simulateSpokenVoice();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };
      recognition.onerror = () => {
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      simulateSpokenVoice();
    }
  };

  const simulateSpokenVoice = () => {
    setIsRecording(true);
    let demoText = "I stopped taking aspirin two months ago and I've been having chest pain for three days. Sometimes I feel breathless.";
    if (language === 'hi') {
      demoText = "Maine do mahine pehle aspirin lena band kar diya tha aur teen din se mere seene mein dard ho raha hai. Kabhi-kabhi saans lene mein bhi takleef hoti hai.";
    } else if (language === 'kn') {
      demoText = "Naanu eradu tingala hinde aspirin nilliside, eega mooru dinagalinda ede novu ide mathu usiradaatada samasye aagthide.";
    }

    let i = 0;
    setTranscript('');
    const timer = setInterval(() => {
      if (i < demoText.length) {
        setTranscript((prev) => prev + demoText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsRecording(false);
      }
    }, 25);
  };

  const quickSymptoms = [
    { label: 'Chest Pain (3 Days)', text: 'I have had central chest pain for three days and feel mild tightness.' },
    { label: 'Breathlessness on Exertion', text: 'I get breathless whenever I climb stairs or walk briskly.' },
    { label: 'Stopped Aspirin 2 Mo. Ago', text: 'I stopped taking aspirin two months ago due to gastric irritation.' },
    { label: 'Fever & Chills', text: 'I have had moderate fever and body aches for two days.' }
  ];

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    onProcessTranscript(transcript);
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-slate-700/80 shadow-2xl animate-fadeIn">
      {/* Voice-First Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero-Form AI Intake</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {t('speakOrType')}
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Tell us about your pain, when it started, and any symptoms in your own natural words.
        </p>
      </div>

      {/* Large Microphone Push-to-Talk Button */}
      <div className="flex flex-col items-center justify-center my-8">
        <div className="relative">
          {isRecording && (
            <div className="absolute -inset-4 rounded-full bg-cyan-500/20 animate-ping" />
          )}
          <button
            type="button"
            onClick={toggleRecording}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 ${
              isRecording
                ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-pulse'
                : 'bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
        </div>
        <span className="mt-3 text-xs font-semibold text-slate-300 tracking-wide">
          {isRecording ? t('stopRecording') : t('startRecording')}
        </span>
      </div>

      {/* Quick Touch/Select Options for elderly & low-typing users */}
      <div className="mb-6">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Touch to Add Quick Statement:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickSymptoms.map((sym, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTranscript((prev) => (prev ? `${prev} ${sym.text}` : sym.text))}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 hover:border-slate-600 transition"
            >
              + {sym.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Transcript Area with Edit capability */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            Patient Said (Transcribed Text)
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
          </button>
        </div>

        {isEditing ? (
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
            placeholder="Type your medical complaint here..."
          />
        ) : (
          <p className="text-sm text-slate-100 min-h-[4rem] font-medium leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            {transcript || (
              <span className="text-slate-500 italic">
                Press the microphone above or select a symptom button to begin...
              </span>
            )}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={loading || !transcript.trim()}
        onClick={handleSubmit}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition duration-200 ${
          transcript.trim() && !loading
            ? 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-cyan-600/30'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <span>Analyzing Voice Context...</span>
        ) : (
          <>
            <span>Analyze Case & Proceed</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
