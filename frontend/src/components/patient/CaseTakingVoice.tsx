import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, MicOff, Edit3, Send, Sparkles, Volume2, ShieldCheck, 
  AlertCircle, ArrowRight, ArrowLeft, RotateCcw, Keyboard, 
  CheckCircle2, Loader2, StopCircle, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface VoiceAnswerRecord {
  questionId: string;
  question: string;
  category: string;
  patient_response: string;
  transcript: string;
  timestamp: string;
  input_method: 'voice' | 'text';
}

interface CaseTakingVoiceProps {
  onProcessTranscript: (answers: VoiceAnswerRecord[], combinedTranscript: string) => void;
  loading: boolean;
}

export type VoiceStatus = 
  | 'idle' 
  | 'requesting_permission' 
  | 'listening' 
  | 'processing' 
  | 'transcript_available' 
  | 'permission_denied' 
  | 'unsupported' 
  | 'error';

export const CaseTakingVoice: React.FC<CaseTakingVoiceProps> = ({
  onProcessTranscript,
  loading
}) => {
  const { t, language } = useLanguage();

  // Clinical Question Schedule
  const questions = [
    {
      id: 'q1_chief_complaint',
      category: 'chief_complaint',
      title: '1. Chief Complaint',
      text: language === 'hi' 
        ? 'आज आपको क्या मुख्य समस्या या तकलीफ हो रही है?' 
        : language === 'kn' 
        ? 'ಇಂದು ನಿಮಗೆ ಮುಖ್ಯವಾಗಿ ಯಾವ ರೀತಿಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಅಥವಾ ತೊಂದರೆ ಇದೆ?' 
        : 'What is your main symptom or health concern today?'
    },
    {
      id: 'q2_onset_duration',
      category: 'symptom_duration',
      title: '2. Onset & Duration',
      text: language === 'hi'
        ? 'यह समस्या कब शुरू हुई, और कितने दिनों से हो रही है?'
        : language === 'kn'
        ? 'ಈ ಸಮಸ್ಯೆ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು ಮತ್ತು ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?'
        : 'When did this symptom start, and how long has it lasted?'
    },
    {
      id: 'q3_severity_radiation',
      category: 'symptom_severity',
      title: '3. Severity & Spread',
      text: language === 'hi'
        ? 'दर्द या तकलीफ कितनी तेज है, और क्या यह शरीर के किसी अन्य हिस्से में फैलता है?'
        : language === 'kn'
        ? 'ನೋವು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ ಮತ್ತು ಅದು ದೇಹದ ಬೇರೆ ಯಾವುದೇ ಭಾಗಕ್ಕೆ ಹರಡುತ್ತದೆಯೇ?'
        : 'How severe is the discomfort (mild, moderate, or severe), and does it spread anywhere (like arm, jaw, back)?'
    },
    {
      id: 'q4_medications',
      category: 'medications',
      title: '4. Medications & Adherence',
      text: language === 'hi'
        ? 'आप वर्तमान में कौन सी दवाएं ले रहे हैं, और क्या आपने हाल ही में कोई दवा बंद की है?'
        : language === 'kn'
        ? 'ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ, ಮತ್ತು ಇತ್ತೀಚೆಗೆ ಯಾವುದಾದರೂ ಔಷಧಿಯನ್ನು ನಿಲ್ಲಿಸಿದ್ದೀರಾ?'
        : 'What medications are you currently taking, and have you stopped or changed any medicines recently?'
    },
    {
      id: 'q5_allergies',
      category: 'allergies',
      title: '5. Known Allergies',
      text: language === 'hi'
        ? 'क्या आपको किसी दवा, भोजन या अन्य चीज से कोई एलर्जी है?'
        : language === 'kn'
        ? 'ನಿಮಗೆ ಯಾವುದೇ ಔಷಧ ಅಥವಾ ಆಹಾರದಿಂದ ಅಲರ್ಜಿ ಇದೆಯೇ?'
        : 'Do you have any known drug, food, or environmental allergies?'
    }
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<string, VoiceAnswerRecord>>({});
  
  // Voice Recording State Machine
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [liveInterim, setLiveInterim] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualText, setManualText] = useState('');

  const recognitionRef = useRef<any>(null);
  const activeQuestion = questions[currentQIndex];

  // Sync current question stored answer if moving between questions
  useEffect(() => {
    const existing = recordedAnswers[activeQuestion.id];
    if (existing) {
      setCurrentTranscript(existing.transcript);
      setManualText(existing.patient_response);
      setVoiceStatus(existing.transcript ? 'transcript_available' : 'idle');
    } else {
      setCurrentTranscript('');
      setManualText('');
      setLiveInterim('');
      setVoiceStatus('idle');
    }
    setErrorMessage(null);
  }, [currentQIndex]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Map app language to speech recognition locale
  const getRecognitionLang = () => {
    if (language === 'hi') return 'hi-IN';
    if (language === 'kn') return 'kn-IN';
    return 'en-IN';
  };

  // Start Real Browser Speech Recognition
  const startRecording = async () => {
    setErrorMessage(null);
    setLiveInterim('');

    // 1. Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('unsupported');
      setErrorMessage(
        'Voice input is not supported in this browser. Please use Chrome/Edge or type your answer using the keyboard below.'
      );
      return;
    }

    setVoiceStatus('requesting_permission');

    // 2. Explicit microphone check for clean permission error catch
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (permErr: any) {
      setVoiceStatus('permission_denied');
      setErrorMessage(
        'Microphone access was blocked. Please allow microphone permissions in your browser settings and try again.'
      );
      return;
    }

    // 3. Initialize Recognition
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getRecognitionLang();
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceStatus('listening');
        setLiveInterim('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            final += text + ' ';
          } else {
            interim += text;
          }
        }

        if (interim) {
          setLiveInterim(interim);
        }

        if (final) {
          setCurrentTranscript((prev) => (prev ? `${prev.trim()} ${final.trim()}` : final.trim()));
          setLiveInterim('');
        }
      };

      recognition.onerror = (event: any) => {
        const error = event.error;
        if (error === 'not-allowed' || error === 'service-not-allowed') {
          setVoiceStatus('permission_denied');
          setErrorMessage('Microphone access was blocked. Please enable microphone permissions in your browser.');
        } else if (error === 'no-speech') {
          setVoiceStatus('idle');
          setErrorMessage('No speech was detected. Please click Start Speaking and speak clearly into your microphone.');
        } else if (error === 'audio-capture') {
          setVoiceStatus('error');
          setErrorMessage('No microphone hardware detected. Please ensure your microphone is plugged in.');
        } else if (error === 'network') {
          setVoiceStatus('error');
          setErrorMessage('Network issue occurred during speech recognition. Please try again or type your answer.');
        } else if (error !== 'aborted') {
          setVoiceStatus('error');
          setErrorMessage(`Speech recognition error: ${error}`);
        }
      };

      recognition.onend = () => {
        setVoiceStatus((prev) => (prev === 'listening' ? 'transcript_available' : prev));
        setLiveInterim('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setVoiceStatus('error');
      setErrorMessage('Could not initiate microphone recognition. Please try typing instead.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    }
    setVoiceStatus('transcript_available');
    setLiveInterim('');
  };

  // Confirm Answer and Move to Next Question
  const handleConfirmAnswer = () => {
    const finalAnswerText = (isManualInput ? manualText : currentTranscript).trim();
    if (!finalAnswerText) {
      setErrorMessage('Please provide or speak an answer before confirming.');
      return;
    }

    const answerRecord: VoiceAnswerRecord = {
      questionId: activeQuestion.id,
      question: activeQuestion.text,
      category: activeQuestion.category,
      patient_response: finalAnswerText,
      transcript: finalAnswerText,
      timestamp: new Date().toISOString(),
      input_method: isManualInput ? 'text' : 'voice'
    };

    const updated = {
      ...recordedAnswers,
      [activeQuestion.id]: answerRecord
    };
    setRecordedAnswers(updated);

    // If more questions exist, proceed to next
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setIsManualInput(false);
    } else {
      // Finished all questions! Compile complete conversation transcript
      finalizeAllQuestions(updated);
    }
  };

  // Finalize Intake and Send to AI Processor
  const finalizeAllQuestions = (answersMap: Record<string, VoiceAnswerRecord>) => {
    const answersList = Object.values(answersMap);
    const combined = answersList
      .map((a) => `[Question: ${a.question}]\nPatient Statement: ${a.patient_response}`)
      .join('\n\n');

    onProcessTranscript(answersList, combined);
  };

  return (
    <div className="max-w-2xl mx-auto paper-card p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-parchment-400 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-xs">
            {currentQIndex + 1}/{questions.length}
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-terracotta tracking-wider">
              {activeQuestion.title}
            </span>
            <span className="text-[11px] text-ink-graphite block">
              Language: {language === 'hi' ? 'Hindi (हिंदी)' : language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English (EN)'}
            </span>
          </div>
        </div>

        {/* Question Progress Indicator */}
        <div className="flex gap-1.5">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`w-5 h-2 rounded-full transition-all ${
                idx === currentQIndex
                  ? 'bg-terracotta w-7'
                  : recordedAnswers[q.id]
                  ? 'bg-[#15803d]'
                  : 'bg-parchment-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Active Question Prompt */}
      <div className="p-5 rounded-2xl bg-parchment border border-parchment-400 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-terracotta font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Clinical Interview Question:</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink leading-snug">
          "{activeQuestion.text}"
        </h2>
      </div>

      {/* Status & Error Alerts */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-[#fee2e2] text-[#b91c1c] text-xs border border-[#fca5a5] flex items-start gap-2 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Notice:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Primary Voice Recording Station */}
      {!isManualInput ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="relative">
            {voiceStatus === 'listening' && (
              <div className="absolute -inset-4 rounded-full bg-terracotta/25 animate-ping" />
            )}

            {voiceStatus === 'listening' ? (
              <button
                type="button"
                onClick={stopRecording}
                aria-label="Stop recording speech"
                className="relative z-10 w-24 h-24 rounded-full bg-[#b91c1c] hover:bg-[#991b1b] text-white flex flex-col items-center justify-center shadow-warm-lg ring-4 ring-[#fca5a5] animate-pulse transition transform hover:scale-105"
              >
                <StopCircle className="w-10 h-10" />
                <span className="text-[10px] font-bold uppercase mt-1">Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                disabled={loading || voiceStatus === 'requesting_permission'}
                aria-label="Start speaking into microphone"
                className="relative z-10 w-24 h-24 rounded-full bg-terracotta hover:bg-terracotta-hover text-white flex flex-col items-center justify-center shadow-warm-lg transition transform hover:scale-105"
              >
                {voiceStatus === 'requesting_permission' ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
                <span className="text-[10px] font-bold uppercase mt-1">
                  {voiceStatus === 'requesting_permission' ? 'Allow Mic' : 'Speak'}
                </span>
              </button>
            )}
          </div>

          {/* Real State Badge */}
          <div className="text-center">
            {voiceStatus === 'listening' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#b91c1c] animate-ping" />
                <span>🔴 Listening... Speak clearly into your microphone</span>
              </div>
            )}
            {voiceStatus === 'requesting_permission' && (
              <span className="text-xs text-terracotta font-semibold">
                Requesting microphone access from your browser...
              </span>
            )}
            {voiceStatus === 'idle' && (
              <span className="text-xs text-ink-graphite font-semibold">
                Click the microphone to speak your answer
              </span>
            )}
            {voiceStatus === 'transcript_available' && (
              <div className="inline-flex items-center gap-1 text-xs text-[#15803d] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Speech recorded. Review or confirm below.</span>
              </div>
            )}
          </div>

          {/* Live Audio Transcript Box */}
          <div className="w-full p-4 rounded-2xl bg-parchment border border-parchment-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                Recognized Spoken Transcript:
              </span>
              {currentTranscript && (
                <button
                  type="button"
                  onClick={() => {
                    setManualText(currentTranscript);
                    setIsManualInput(true);
                  }}
                  className="text-xs text-ink-graphite hover:text-ink font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit as Text</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed bg-[#fef9ef] p-3.5 rounded-xl border border-parchment-300 min-h-[4rem]">
              {currentTranscript ? (
                <span>
                  {currentTranscript}
                  {liveInterim && <span className="text-terracotta italic font-normal"> {liveInterim}...</span>}
                </span>
              ) : liveInterim ? (
                <span className="text-terracotta italic font-normal">{liveInterim}...</span>
              ) : (
                <span className="text-ink-muted italic">
                  Press the microphone button above to start speaking...
                </span>
              )}
            </p>
          </div>
        </div>
      ) : (
        /* Manual Keyboard Fallback */
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-terracotta" />
              <span>Type Your Answer Manually:</span>
            </span>
            <button
              type="button"
              onClick={() => setIsManualInput(false)}
              className="text-xs text-terracotta hover:underline font-semibold flex items-center gap-1"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Switch to Voice Input</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type your response to the question here..."
            className="w-full p-3 bg-white border border-parchment-400 rounded-xl text-xs text-ink leading-relaxed focus:outline-none focus:border-terracotta"
          />
        </div>
      )}

      {/* Switch between Voice & Keyboard if in voice mode */}
      {!isManualInput && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setManualText(currentTranscript);
              setIsManualInput(true);
            }}
            className="text-xs text-ink-graphite hover:text-ink font-semibold underline flex items-center gap-1 mx-auto"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Prefer to type instead of speaking? Click here</span>
          </button>
        </div>
      )}

      {/* Navigation & Confirmation Action Buttons */}
      <div className="pt-3 border-t border-parchment-400 flex flex-wrap items-center justify-between gap-3">
        <div>
          {currentQIndex > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentQIndex(currentQIndex - 1)}
              className="btn-secondary-paper text-xs px-3.5 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Question</span>
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Skip button */}
          <button
            type="button"
            onClick={() => {
              if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(currentQIndex + 1);
              } else {
                finalizeAllQuestions(recordedAnswers);
              }
            }}
            className="btn-secondary-paper text-xs px-3.5 py-2"
          >
            <span>Skip</span>
          </button>

          {/* Confirm & Proceed Button */}
          <button
            type="button"
            disabled={loading || !(isManualInput ? manualText.trim() : currentTranscript.trim())}
            onClick={handleConfirmAnswer}
            className="btn-terracotta text-xs px-5 py-2.5 shadow-warm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Structuring Case...</span>
              </span>
            ) : currentQIndex === questions.length - 1 ? (
              <>
                <span>Confirm & Finish Voice Interview</span>
                <CheckCircle2 className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <span>Confirm Answer & Next Question</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
