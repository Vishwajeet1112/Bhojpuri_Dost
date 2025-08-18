import React, { useState } from 'react';

interface TextInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const SendIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Z"/>
    </svg>
);


const TextInput = ({ onSendMessage, disabled }: TextInputProps): React.ReactNode => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="अपना संदेश लिखें..."
        disabled={disabled}
        className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-full p-3 px-5 focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:outline-none transition duration-200 disabled:opacity-50"
        aria-label="आपका संदेश"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-rose-500 dark:bg-rose-600 text-white rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center hover:bg-rose-600 dark:hover:bg-rose-500 transition duration-200 disabled:bg-rose-300 dark:disabled:bg-rose-800 dark:disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="संदेश भेजें"
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default TextInput;