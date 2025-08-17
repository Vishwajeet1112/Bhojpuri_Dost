
import React from 'react';

interface SpeedControlProps {
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  disabled: boolean;
}

const SpeedControl = ({ speechRate, setSpeechRate, disabled }: SpeedControlProps): React.ReactNode => {
  return (
    <div className={`w-full max-w-xs transition-opacity duration-300 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      <label htmlFor="speed" className="block text-center text-gray-400 mb-2">
        Voice Speed: {speechRate.toFixed(1)}x
      </label>
      <input
        id="speed"
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={speechRate}
        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default SpeedControl;
