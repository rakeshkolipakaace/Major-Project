import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isComplete: boolean;
}

export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          let confidence = 0;
          let isComplete = false;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            confidence = event.results[i][0].confidence;
            isComplete = event.results[i].isFinal;
          }

          setResult({ transcript: transcript.trim(), confidence, isComplete });
        };

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setError(event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setResult(null);
      setError(null);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const calculatePronunciationScore = (expected: string, actual: string): number => {
    // Simple pronunciation scoring algorithm
    const expectedWords = expected.toLowerCase().replace(/[^\w\s]/g, '').split(' ');
    const actualWords = actual.toLowerCase().replace(/[^\w\s]/g, '').split(' ');
    
    let matches = 0;
    const maxLength = Math.max(expectedWords.length, actualWords.length);
    
    expectedWords.forEach((word, index) => {
      if (actualWords[index] && actualWords[index].includes(word)) {
        matches++;
      }
    });
    
    return Math.min(100, Math.max(0, (matches / maxLength) * 100));
  };

  return {
    isSupported,
    isListening,
    result,
    error,
    startListening,
    stopListening,
    calculatePronunciationScore
  };
}
