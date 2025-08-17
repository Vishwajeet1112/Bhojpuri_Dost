
let voices: SpeechSynthesisVoice[] = [];

// Function to populate and update the voices array
const populateVoiceList = () => {
  if (typeof window.speechSynthesis === 'undefined') {
    return;
  }
  voices = window.speechSynthesis.getVoices();
};

// Initial population
populateVoiceList();

// Update voices when they are loaded asynchronously
if (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = populateVoiceList;
}

export const speak = (text: string, rate: number): void => {
  if (typeof window.speechSynthesis === 'undefined' || !text) {
    console.error("Speech synthesis not supported or text is empty.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Always try to get the latest voices, but use the cached `voices` as a fallback.
  const currentVoices = window.speechSynthesis.getVoices();
  const voiceList = currentVoices.length ? currentVoices : voices;
  
  const hindiVoice = voiceList.find(voice => voice.lang === 'hi-IN');
  
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  } else {
    // It's useful to log if the specific voice isn't found
    console.warn("Hindi (hi-IN) voice not found. Using browser default.");
  }
  
  utterance.lang = 'hi-IN'; // Helps browsers pick a suitable voice if one isn't set explicitly
  utterance.rate = Math.max(0.5, Math.min(2, rate)); // Clamp rate between 0.5 and 2
  utterance.pitch = 1;
  utterance.volume = 1;

  // Do not cancel here. This allows multiple `speak` calls to queue up,
  // which is essential for our sentence-by-sentence streaming playback.
  window.speechSynthesis.speak(utterance);
};

export const cancelSpeech = (): void => {
    if (typeof window.speechSynthesis === 'undefined') return;
    window.speechSynthesis.cancel();
}
