import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, Sparkles, AlertCircle, Check, X } from 'lucide-react';

export interface SpeechToTextProps {
  value?: string;
  onChange?: (val: string) => void;
  language?: string;
  mode?: 'append' | 'replace';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonClassName?: string;
  placeholder?: string;
  showLiveTranscript?: boolean;
  onListeningChange?: (listening: boolean) => void;
  onInterimTranscript?: (transcript: string) => void;
}

export const SpeechToText: React.FC<SpeechToTextProps> = ({
  value = '',
  onChange,
  language = 'en-IN',
  mode = 'append',
  size = 'md',
  className = '',
  buttonClassName = '',
  placeholder = 'Click to speak',
  showLiveTranscript = true,
  onListeningChange,
  onInterimTranscript
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const errorTimeoutRef = useRef<any>(null);
  const currentValRef = useRef(value);
  currentValRef.current = value;

  // Check browser compatibility on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const triggerError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setIsListening(false);
    setIsProcessing(false);
    setInterimText('');
    if (onListeningChange) onListeningChange(false);

    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  }, [onListeningChange]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    }
    setIsListening(false);
    setIsProcessing(false);
    setInterimText('');
    if (onListeningChange) onListeningChange(false);
  }, [onListeningChange]);

  const startListening = useCallback(() => {
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      triggerError('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language || 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
        setInterimText('');
        if (onListeningChange) onListeningChange(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';
          if (result.isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
          if (onInterimTranscript) onInterimTranscript(interim);
        }

        if (final) {
          const trimmedFinal = final.trim();
          if (trimmedFinal && onChange) {
            const current = currentValRef.current || '';
            let updated = '';
            if (mode === 'append' && current.trim()) {
              // Add space or punctuation if needed
              const needsSpace = !current.endsWith(' ') && !current.endsWith('\n');
              updated = `${current}${needsSpace ? ' ' : ''}${trimmedFinal}`;
            } else {
              updated = trimmedFinal;
            }
            onChange(updated);
          }
          setInterimText('');
          if (onInterimTranscript) onInterimTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        const error = event.error;
        if (error === 'no-speech') {
          triggerError('No speech detected. Please speak clearly into your microphone.');
        } else if (error === 'not-allowed' || error === 'service-not-allowed') {
          triggerError('Microphone permission denied. Please allow microphone access in browser settings.');
        } else if (error === 'audio-capture') {
          triggerError('Microphone hardware unavailable or disconnected.');
        } else if (error === 'network') {
          triggerError('Network error occurred while processing voice recognition.');
        } else if (error !== 'aborted') {
          triggerError(`Speech error: ${error}`);
        } else {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
        setInterimText('');
        if (onListeningChange) onListeningChange(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      triggerError('Could not start microphone. Please check browser permissions.');
    }
  }, [language, mode, onChange, onInterimTranscript, onListeningChange, triggerError]);

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Sizing definitions
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Microphone Trigger Button */}
      <button
        type="button"
        onClick={toggleRecording}
        aria-label={isListening ? 'Stop voice input' : (placeholder || 'Start voice input')}
        aria-pressed={isListening}
        title={isListening ? 'Click to stop listening' : placeholder}
        className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-300 select-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
          sizeClasses[size]
        } ${
          isListening
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-500/25 animate-pulse'
            : isProcessing
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 border border-slate-700/60 shadow-sm'
        } ${buttonClassName}`}
      >
        {/* Animated listening wave ping */}
        {isListening && (
          <span className="absolute inset-0 rounded-xl bg-rose-500/30 animate-ping pointer-events-none" />
        )}

        {isProcessing ? (
          <Loader2 className={`${iconSizes[size]} animate-spin text-amber-400`} />
        ) : isListening ? (
          <Mic className={`${iconSizes[size]} text-rose-400 animate-bounce`} />
        ) : (
          <Mic className={`${iconSizes[size]} transition-transform duration-200 hover:scale-110`} />
        )}

        {/* Live Audio Waves graphic when active */}
        {isListening && (
          <span className="ml-1.5 flex items-center space-x-0.5" aria-hidden="true">
            <span className="w-1 h-3 bg-rose-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
            <span className="w-1 h-4 bg-rose-300 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
            <span className="w-1 h-2 bg-rose-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
          </span>
        )}
      </button>

      {/* Floating Listening Indicator & Live Interim Transcription Popup */}
      {isListening && showLiveTranscript && (
        <div
          role="status"
          aria-live="polite"
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-50 min-w-[220px] max-w-xs px-3.5 py-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-900/40 text-xs text-white flex flex-col gap-1 pointer-events-none animate-fadeIn"
        >
          <div className="flex items-center justify-between text-[11px] text-cyan-300 font-semibold border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Listening ({language})...
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Speak clearly</span>
          </div>

          <p className="text-slate-200 text-xs italic min-h-[1.25rem]">
            {interimText || 'Say symptoms, medications, or inquiries...'}
          </p>
        </div>
      )}

      {/* Error Floating Banner / Tooltip */}
      {errorMessage && (
        <div
          role="alert"
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-50 min-w-[240px] max-w-sm px-3.5 py-2.5 bg-rose-950/95 backdrop-blur-md border border-rose-500/60 rounded-xl shadow-2xl text-xs text-rose-200 flex items-start gap-2 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] leading-tight">
            <p className="font-semibold text-rose-300 mb-0.5">Voice Input</p>
            <p className="text-rose-200/90">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-400 hover:text-white rounded-md transition"
            aria-label="Dismiss error"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
