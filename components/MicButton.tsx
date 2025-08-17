import React from 'react';

interface MicButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

const MicSpinnerIcon = (): React.ReactNode => (
  <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const MicOnIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
    <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
  </svg>
);

const MicButton = ({ isListening, isProcessing, onClick }: MicButtonProps): React.ReactNode => {
  const isDisabled = isProcessing;
  const buttonStateClass = isListening 
    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
    : 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500';
  
  const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg shadow-rose-500/20 dark:shadow-lg dark:shadow-rose-500/30 ${buttonStateClass} ${disabledClass}`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      <div className="absolute inset-0 rounded-full border-2 border-rose-400/50 dark:border-rose-500/50 animate-ping-slow"></div>
      {isProcessing ? <MicSpinnerIcon /> : <MicOnIcon />}
    </button>
  );
};

export default MicButton;