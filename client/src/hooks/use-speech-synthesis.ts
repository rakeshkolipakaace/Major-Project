import { useState, useEffect, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
    onProgress?: (progress: number) => void;
    onEnd?: () => void;
  }) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find child-friendly voice
    const childVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('child') || 
      voice.name.toLowerCase().includes('young') ||
      voice.gender === 'female'
    ) || voices[0];

    if (childVoice) {
      utterance.voice = childVoice;
    }

    utterance.rate = options?.rate || 0.9;
    utterance.pitch = options?.pitch || 1.2;
    utterance.volume = options?.volume || 0.8;

    utterance.onstart = () => {
      setIsPlaying(true);
      progressRef.current = 0;
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
      options?.onEnd?.();
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const progress = (event.charIndex / text.length) * 100;
        progressRef.current = progress;
        options?.onProgress?.(progress);
      }
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentUtterance(null);
  };

  return {
    isSupported,
    voices,
    isPlaying,
    speak,
    pause,
    resume,
    stop,
    progress: progressRef.current
  };
}
