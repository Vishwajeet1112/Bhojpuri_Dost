
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechToText } from './hooks/useSpeechToText';
import { getBhojpuriResponseStream } from './services/geminiService';
import { speak, cancelSpeech } from './utils/textToSpeech';
import Header from './components/Header';
import MicButton from './components/MicButton';
import MessageDisplay from './components/MessageDisplay';
import TextInput from './components/TextInput';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const KeyboardIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 7.5a1 1 0 0 1 1-1h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1zM7 11.5h.01M12 11.5h.01M17 11.5h.01M7 14.5h10"></path>
    </svg>
);

const MicIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);


export default function App(): React.ReactNode {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const speechRate = 1.0;
  const [error, setError] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.theme) {
      return localStorage.theme as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return newTheme;
    });
  }, []);

  // Auto-scroll logic to keep the latest message in view
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const generateAndSpeak = useCallback(async (historyWithNewUserMessage: Message[]) => {
    if (historyWithNewUserMessage.length === 0) return;
    
    setIsProcessing(true);
    setError('');
    cancelSpeech();

    setMessages(prev => [...prev, { role: 'ai', content: '' }]);
    
    let sentenceBuffer = '';
    const sentenceRegex = /([^.?!।]+[.?!।])/g;

    try {
      const stream = await getBhojpuriResponseStream(historyWithNewUserMessage);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content += chunkText;
          return newMessages;
        });
        
        if (isTtsEnabled) {
          sentenceBuffer += chunkText;

          const sentences = sentenceBuffer.match(sentenceRegex);
          if (sentences) {
            let spokenLength = 0;
            for (const sentence of sentences) {
              const trimmedSentence = sentence.trim();
              if (trimmedSentence) {
                speak(trimmedSentence, speechRate);
              }
              spokenLength += sentence.length;
            }
            sentenceBuffer = sentenceBuffer.substring(spokenLength);
          }
        }
      }
      
      if (isTtsEnabled && sentenceBuffer.trim()) {
        speak(sentenceBuffer.trim(), speechRate);
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Gemini API Error: ${errorMessage}`);
      console.error(e);
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
    } finally {
      setIsProcessing(false);
    }
  }, [speechRate, isTtsEnabled]);
  
  const handleListen = useCallback((transcript: string) => {
    if (transcript) {
      const newMessages: Message[] = [...messages, { role: 'user', content: transcript }];
      setMessages(newMessages);
      generateAndSpeak(newMessages);
    }
  }, [messages, generateAndSpeak]);

  const { isListening, startListening, stopListening, error: speechError } = useSpeechToText({ onTranscriptFinalized: handleListen });

  const handleSendMessage = (text: string) => {
    if (text.trim() && !isProcessing) {
      const newMessages: Message[] = [...messages, { role: 'user', content: text }];
      setMessages(newMessages);
      generateAndSpeak(newMessages);
    }
  };

  const toggleTts = useCallback(() => {
    setIsTtsEnabled(prev => {
      if (prev) {
        cancelSpeech();
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (speechError) {
      let friendlyMessage = '';
      switch (speechError) {
        case 'not-allowed':
        case 'service-not-allowed':
          friendlyMessage = "माइक्रोफ़ोन की अनुमति आवश्यक है। कृपया ब्राउज़र सेटिंग्स में जाकर अनुमति दें।";
          break;
        case 'audio-capture':
           friendlyMessage = "आपके माइक्रोफ़ोन में कोई समस्या लगती है। कृपया जाँच लें।";
           break;
        default:
          friendlyMessage = `एक अज्ञात त्रुटि हुई: ${speechError}। कृपया पुनः प्रयास करें।`;
      }
      setError(friendlyMessage);
    }
  }, [speechError]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setError('');
      cancelSpeech();
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const handleToggleInputMode = useCallback(() => {
    setInputMode(prev => (prev === 'voice' ? 'text' : 'voice'));
    setError('');
    cancelSpeech();
    if (isListening) {
      stopListening();
    }
  }, [isListening, stopListening]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans flex flex-col items-center p-4 transition-colors duration-200" style={{ fontFamily: "'Laila', sans-serif" }}>
      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
        <Header 
          isTtsEnabled={isTtsEnabled}
          onToggleTts={toggleTts}
          isProcessing={isProcessing}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        
        <main ref={chatContainerRef} className="flex-grow flex flex-col gap-6 py-8 overflow-y-auto">
          <MessageDisplay 
            messages={messages} 
            isListening={isListening && inputMode === 'voice'} 
            isProcessing={isProcessing}
            speak={speak}
            speechRate={speechRate}
          />
        </main>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-600 dark:text-red-300 p-3 rounded-lg text-center mx-4 mb-2">
              <p>{error}</p>
            </div>
        )}
        
        <footer className="flex flex-col items-center gap-3 w-full pt-2 pb-6">
          <div className="w-full px-4 min-h-[112px] flex items-center justify-center">
            {inputMode === 'voice' ? (
                <MicButton 
                  isListening={isListening}
                  isProcessing={isProcessing}
                  onClick={handleMicClick}
                />
            ) : (
              <TextInput onSendMessage={handleSendMessage} disabled={isProcessing} />
            )}
          </div>

          <button
            onClick={handleToggleInputMode}
            disabled={isProcessing}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`इनपुट मोड को ${inputMode === 'voice' ? 'टेक्स्ट' : 'आवाज़'} में बदलें`}
          >
            {inputMode === 'voice' ? <KeyboardIcon /> : <MicIcon />}
            <span className="text-sm font-medium">{inputMode === 'voice' ? 'कीबोर्ड का प्रयोग करें' : 'माइक्रोफ़ोन का प्रयोग करें'}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}