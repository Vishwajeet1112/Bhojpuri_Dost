import React from 'react';

const SpeakerOnIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

const SpeakerOffIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6.375a9 9 0 0 1 12.728 0M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

const SunIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
);

const MoonIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);


interface HeaderProps {
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  isProcessing: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header = ({ isTtsEnabled, onToggleTts, isProcessing, theme, onToggleTheme }: HeaderProps): React.ReactNode => {
  return (
    <header className="relative text-center py-4 border-b border-b-rose-400/30 dark:border-b-gray-700">
      <h1 className="text-4xl font-bold text-rose-600 dark:text-rose-400 tracking-wider">
        Bhojpuri Dost
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">आपका बातूनी AI दोस्त</p>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          disabled={isProcessing}
          className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={theme === 'light' ? "डार्क मोड में बदलें" : "लाइट मोड में बदलें"}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button 
          onClick={onToggleTts}
          disabled={isProcessing}
          className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isTtsEnabled ? "आवाज़ बंद करें" : "आवाज़ चालू करें"}
        >
          {isTtsEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;