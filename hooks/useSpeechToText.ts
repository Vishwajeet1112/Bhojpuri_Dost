
import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions for the Web Speech API to ensure TypeScript compilation.
// These are based on the MDN documentation.
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  grammars: any; // Simplified as SpeechGrammarList is complex and not used here.
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

// Augment the global Window interface to include SpeechRecognition APIs.
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

interface SpeechToTextOptions {
  onTranscriptFinalized: (transcript: string) => void;
}

// Check for browser support and assign the correct implementation.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechToText = ({ onTranscriptFinalized }: SpeechToTextOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('यह ब्राउज़र वाक् पहचान का समर्थन नहीं करता है।');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'hi-IN'; // Set to Hindi for better recognition of Bhojpuri/Hindi speech
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscriptFinalized(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // The 'no-speech' error is a common timeout. We handle it by simply stopping
      // the listening state, without propagating it as a user-facing error.
      if (event.error === 'no-speech') {
        setIsListening(false);
        return;
      }

      console.error('Speech recognition error:', event.error, event.message);
      setError(event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscriptFinalized]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (e) {
        console.error("Error starting recognition:", e);
        setError("माइक्रोफ़ोन शुरू नहीं हो सका। कृपया अनुमतियों की जाँच करें।");
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, startListening, stopListening, error };
};