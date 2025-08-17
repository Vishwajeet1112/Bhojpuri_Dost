import React from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface MessageDisplayProps {
  messages: Message[];
  isListening: boolean;
  isProcessing: boolean;
  speak: (text: string, rate: number) => void;
  speechRate: number;
}

const StatusIndicator = ({ text }: { text: string }): React.ReactNode => (
  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 dark:bg-rose-500 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 dark:bg-rose-600"></span>
    </span>
    {text}
  </div>
);

const MessageDisplay = ({ messages, isListening, isProcessing, speak, speechRate }: MessageDisplayProps): React.ReactNode => {
  const showInitialPlaceholder = messages.length === 0 && !isListening && !isProcessing;

  const handleReplay = (text: string) => {
    window.speechSynthesis.cancel();
    speak(text, speechRate);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-end min-h-[200px] px-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`p-4 rounded-2xl max-w-lg ${
            msg.role === 'user' 
            ? 'bg-rose-500 dark:bg-rose-600 rounded-br-none text-white' 
            : 'bg-white dark:bg-slate-700 rounded-bl-none text-gray-800 dark:text-gray-200 shadow-md dark:shadow-none dark:border dark:border-slate-600 flex items-center gap-3'
          }`}>
            {msg.role === 'ai' && msg.content && !isProcessing && (
               <button onClick={() => handleReplay(msg.content)} className="flex-shrink-0 text-rose-400 hover:text-rose-600 dark:text-rose-500 dark:hover:text-rose-400 transition-colors" aria-label="Replay audio">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 22.334a10.834 10.834 0 1 1 10.834-10.834A10.846 10.846 0 0 1 11.5 22.334Zm0-19.668a8.834 8.834 0 1 0 8.834 8.834A8.844 8.844 0 0 0 11.5 2.666Z" /><path d="m10.63 15.422 4.985-3.323a.614.614 0 0 0 0-1.026L10.63 7.75a.614.614 0 0 0-.94.513v6.646a.614.614 0 0 0 .94.513Z" /></svg>
               </button>
            )}
            <p className="whitespace-pre-wrap">
              {msg.content}
              {msg.role === 'ai' && isProcessing && index === messages.length - 1 && <span className="inline-block w-2 h-4 bg-rose-500 dark:bg-rose-400 animate-pulse ml-1" />}
            </p>
          </div>
        </div>
      ))}
      
      {isListening && (
         <div className="flex justify-end">
          <div className="bg-rose-500 dark:bg-rose-600 p-4 rounded-2xl rounded-br-none max-w-lg">
            <p className="text-rose-100 dark:text-rose-200 italic">Sun rahe hain...</p>
          </div>
        </div>
      )}

      {showInitialPlaceholder && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-slate-700 dark:border dark:border-slate-600 shadow-md p-4 rounded-2xl rounded-bl-none max-w-lg">
            <p className="text-gray-500 dark:text-gray-400 italic">
              Tohār dost javāb deī खातिर taiyār bā...
            </p>
          </div>
        </div>
      )}

      {isProcessing && messages.length > 0 && messages[messages.length-1].role === 'ai' && messages[messages.length-1].content === '' && (
         <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-700 dark:border dark:border-slate-600 shadow-md p-4 rounded-2xl rounded-bl-none max-w-lg">
                <p className="text-gray-500 dark:text-gray-400 italic"><StatusIndicator text="Dost soch raha hai..." /></p>
            </div>
          </div>
      )}
    </div>
  );
};

export default MessageDisplay;