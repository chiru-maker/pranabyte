import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Edit3, Send, Sparkles, Volume2, ShieldCheck, RefreshCw } from 'lucide-react';
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
    { label: 'Fever & Body Ache', text: 'I have had moderate fever and body aches for two days.' }
  ];

  const handleSubmit = () => {
    if (!transcript.trim()) return;
    onProcessTranscript(transcript);
  };

  return (
    <div className="max-w-2xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta border border-terracotta/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3: Zero-Form Spoken Intake</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          {t('speakOrType')}
        </h2>
        <p className="text-xs sm:text-sm text-ink-charcoal max-w-md mx-auto">
          Describe your pain, symptoms, and when they began in your own natural language.
        </p>
      </div>

      {/* Large Terracotta Push-to-Talk Button */}
      <div className="flex flex-col items-center justify-center my-6">
        <div className="relative">
          {isRecording && (
            <div className="absolute -inset-4 rounded-full bg-terracotta/20 animate-ping" />
          )}
          <button
            type="button"
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop recording speech" : "Start recording speech"}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-warm-lg transition-all duration-300 transform hover:scale-105 ${
              isRecording
                ? 'bg-[#b91c1c] text-white ring-4 ring-[#fca5a5] animate-pulse'
                : 'bg-terracotta text-white hover:bg-terracotta-hover'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
        </div>
        <span className="mt-3 text-xs font-semibold text-ink tracking-wide">
          {isRecording ? t('stopRecording') : t('startRecording')}
        </span>
      </div>

      {/* Quick Touch/Select Options for elderly & low-typing users */}
      <div className="space-y-2">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-graphite">
          Touch to Add Quick Symptom Statement:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickSymptoms.map((sym, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTranscript((prev) => (prev ? `${prev} ${sym.text}` : sym.text))}
              className="px-3 py-1.5 rounded-full bg-parchment hover:bg-parchment-300 text-xs text-ink border border-parchment-400 hover:border-parchment-500 font-medium transition"
            >
              + {sym.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Transcript Area with Edit capability */}
      <div className="p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-terracotta uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            Patient's Spoken Words (Transcribed)
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-ink-graphite hover:text-ink font-semibold flex items-center gap-1"
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
            className="w-full p-3 bg-[#ffffff] border border-parchment-400 rounded-xl text-ink text-xs focus:outline-none focus:border-terracotta"
            placeholder="Type or correct your symptoms here..."
          />
        ) : (
          <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed bg-[#fef9ef] p-3 rounded-xl border border-parchment-300 min-h-[4rem]">
            {transcript || (
              <span className="text-ink-muted italic">
                Press the terracotta microphone button above or select a symptom button to begin...
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
        className="w-full btn-terracotta text-sm py-3.5"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Extracting Clinical Entities...</span>
          </span>
        ) : (
          <>
            <span>Extract Clinical Facts & Proceed</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
