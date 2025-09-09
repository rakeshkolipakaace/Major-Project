import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, VolumeX, Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

interface AudioControlsProps {
  text: string;
  onProgressUpdate?: (progress: number) => void;
  className?: string;
}

export function AudioControls({ text, onProgressUpdate, className }: AudioControlsProps) {
  const [volume, setVolume] = useState([0.8]);
  const [progress, setProgress] = useState(0);
  const { isSupported, isPlaying, speak, pause, resume, stop } = useSpeechSynthesis();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (progress > 0) {
      resume();
    } else {
      speak(text, {
        volume: volume[0],
        onProgress: (prog) => {
          setProgress(prog);
          onProgressUpdate?.(prog);
        },
        onEnd: () => {
          setProgress(0);
        }
      });
    }
  };

  const handleStop = () => {
    stop();
    setProgress(0);
  };

  if (!isSupported) {
    return (
      <div className={`bg-muted/30 rounded-xl p-4 ${className}`}>
        <p className="text-sm text-muted-foreground">
          Speech synthesis not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-muted/30 rounded-xl p-4 ${className}`} data-testid="audio-controls">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handlePlayPause}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90"
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <div className="text-sm">
            <div className="text-foreground font-medium">AI Narration</div>
            <div className="text-muted-foreground">Child-friendly voice</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <VolumeX className="w-4 h-4 text-muted-foreground" />
          <div className="w-20">
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              min={0}
              step={0.1}
              data-testid="slider-volume"
            />
          </div>
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-1">
        <div 
          className="bg-secondary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span data-testid="text-current-time">
          {Math.floor((progress / 100) * 180)}s
        </span>
        <span data-testid="text-total-time">3:00</span>
      </div>
    </div>
  );
}
