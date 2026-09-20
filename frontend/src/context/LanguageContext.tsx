import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'kn';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

const translations: Translations = {
  appName: {
    en: 'Patient Story Engine',
    hi: 'पेशेंट स्टोरी इंजन',
    kn: 'ಪೇಷೆಂಟ್ ಸ್ಟೋರಿ ಇಂಜಿನ್',
  },
  tagline: {
    en: 'Evidence-Linked Clinical Case Intake & Triage',
    hi: 'साक्ष्य-आधारित क्लिनिकल केस इनटेक',
    kn: 'ಸಾಕ್ಷ್ಯ ಆಧಾರಿತ ವೈದ್ಯಕೀಯ ವಿವರ ಸಂಗ್ರಹ',
  },
  giveConsent: {
    en: 'I Give Consent',
    hi: 'मैं सहमति देता हूँ',
    kn: 'ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ',
  },
  declineConsent: {
    en: 'Decline',
    hi: 'अस्वीकार करें',
    kn: 'ತಿರಸ್ಕರಿಸಿ',
  },
  speakOrType: {
    en: 'Speak your health concern or type below',
    hi: 'अपनी बीमारी या परेशानी बोलें या नीचे लिखें',
    kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯದ ತೊಂದರೆಯನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ',
  },
  startRecording: {
    en: 'Tap to Speak',
    hi: 'बोलने के लिए दबाएं',
    kn: 'ಮಾತನಾಡಲು ಒತ್ತಿ',
  },
  stopRecording: {
    en: 'Listening... Tap to Stop',
    hi: 'सुन रहा है... रोकने के लिए दबाएं',
    kn: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ... ನಿಲ್ಲಿಸಲು ಒತ್ತಿ',
  },
  questionsAvoidedNotice: {
    en: 'Questions avoided using existing records',
    hi: 'मौजूदा रिकॉर्ड से प्रश्नों की बचत हुई',
    kn: 'ಹಳೆಯ ದಾಖಲೆಗಳಿಂದ ಪ್ರಶ್ನೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಲಾಗಿದೆ',
  },
  submitAnswer: {
    en: 'Submit Response',
    hi: 'उत्तर जमा करें',
    kn: 'ಉತ್ತರ ಸಲ್ಲಿಸಿ',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
