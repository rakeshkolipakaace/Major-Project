import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatedBackground } from "@/components/animated-background";
import { Navigation } from "@/components/navigation";
import { AudioControls } from "@/components/audio-controls";
import { useGameData } from "@/hooks/use-game-data";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { StoryGenerator } from "@/lib/story-generator";
import { Story, StoryTheme } from "@/types/game";
import { X, Mic, MicOff, Check, ArrowRight, Bookmark } from "lucide-react";

export default function StoryReader() {
  const { theme, storyId } = useParams<{ theme: StoryTheme; storyId: string }>();
  const [, setLocation] = useLocation();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [story, setStory] = useState<Story | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [sessionStars, setSessionStars] = useState(0);
  
  const { gameData, addStars, setCurrentStory, updateGameData } = useGameData();
  const { 
    isSupported: speechSupported, 
    isListening, 
    result, 
    startListening, 
    stopListening,
    calculatePronunciationScore 
  } = useSpeechRecognition();

  useEffect(() => {
    if (theme && storyId) {
      if (theme === 'custom') {
        // Load custom story from localStorage
        const customStoryData = localStorage.getItem('currentCustomStory');
        if (customStoryData) {
          const customStory = JSON.parse(customStoryData);
          setStory(customStory);
          
          // Update current story in game data
          setCurrentStory({
            id: customStory.id,
            title: customStory.title,
            theme: customStory.theme,
            currentChapter: 0,
            totalChapters: customStory.chapters.length,
            progress: 0
          });
        }
      } else {
        const generatedStory = StoryGenerator.generateStory(theme, parseInt(storyId));
        setStory(generatedStory);
        
        // Update current story in game data
        setCurrentStory({
          id: generatedStory.id,
          title: generatedStory.title,
          theme: generatedStory.theme,
          currentChapter: 0,
          totalChapters: generatedStory.chapters.length,
          progress: 0
        });
      }
    }
  }, [theme, storyId, setCurrentStory]);

  const handleStartRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setPronunciationScore(null);
      startListening();
    } else {
      setIsRecording(false);
      stopListening();
    }
  };

  useEffect(() => {
    if (result && result.isComplete && story) {
      const expectedText = story.chapters[currentChapter].interactiveSection || "";
      const score = calculatePronunciationScore(expectedText, result.transcript);
      setPronunciationScore(score);
      setIsRecording(false);
      
      // Award stars based on pronunciation score
      const starsEarned = score >= 90 ? 20 : score >= 80 ? 15 : score >= 70 ? 10 : 5;
      addStars(starsEarned);
      setSessionStars(prev => prev + starsEarned);
    }
  }, [result, story, currentChapter, calculatePronunciationScore, addStars]);

  const handleNextChapter = () => {
    if (story && currentChapter < story.chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
      setPronunciationScore(null);
      
      // Update progress
      const newProgress = ((currentChapter + 2) / story.chapters.length) * 100;
      setCurrentStory({
        id: story.id,
        title: story.title,
        theme: story.theme,
        currentChapter: currentChapter + 1,
        totalChapters: story.chapters.length,
        progress: newProgress
      });
    } else {
      // Story completed
      addStars(50); // Completion bonus
      setCurrentStory(null);
      setLocation("/");
    }
  };

  const handleClose = () => {
    setLocation("/");
  };

  const handleSaveProgress = () => {
    updateGameData();
  };

  if (!story) {
    return <div>Loading story...</div>;
  }

  const currentChapterData = story.chapters[currentChapter];
  const progress = ((currentChapter + 1) / story.chapters.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AnimatedBackground />
      <Navigation />
      
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto reading-modal border-border">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-gaming text-primary">{story.title}</h3>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Chapter {currentChapter + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              data-testid="button-close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Audio Controls */}
          <AudioControls 
            text={currentChapterData.content + " " + (currentChapterData.interactiveSection || "")}
            className="mb-6"
          />

          {/* Story Image */}
          {currentChapterData.imageUrl && (
            <div className="mb-6">
              <img 
                src={currentChapterData.imageUrl}
                alt={`Illustration for ${currentChapterData.title}`}
                className="w-full h-64 object-cover rounded-xl"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                }}
              />
              {story.isCustomStory && currentChapterData.isCustomGenerated && (
                <div className="mt-2 flex items-center justify-center">
                  <span className="text-xs text-purple-500 bg-purple-100 px-2 py-1 rounded">
                    ✨ AI Generated Image
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Story Content */}
          <div className="bg-background/50 rounded-xl p-6 space-y-4 max-h-96 overflow-y-auto mb-6">
            <h4 className="text-xl font-gaming text-primary mb-3">{currentChapterData.title}</h4>
            <p className="text-lg leading-relaxed">
              {currentChapterData.content}
            </p>
            
            {currentChapterData.interactiveSection && (
              <div className="bg-accent/10 border-l-4 border-accent rounded p-4 my-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="w-5 h-5 text-accent" />
                  <span className="text-accent font-gaming">Your Turn to Read!</span>
                </div>
                <p className="text-lg font-medium mb-3">
                  {currentChapterData.interactiveSection}
                </p>
                
                {speechSupported ? (
                  <div className="space-y-3">
                    <Button
                      onClick={handleStartRecording}
                      className={`w-full py-3 font-medium transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : pronunciationScore !== null
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-accent text-accent-foreground hover:bg-accent/90'
                      }`}
                      disabled={isListening && !isRecording}
                      data-testid="button-record"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Recording
                        </>
                      ) : pronunciationScore !== null ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Great Job! {Math.round(pronunciationScore)}%
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          Start Reading Aloud
                        </>
                      )}
                    </Button>
                    
                    {result && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                        <strong>You said:</strong> "{result.transcript}"
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Speech recognition not supported in this browser
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reading Progress */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-gaming text-secondary">Reading Progress</h4>
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-primary" />
                <span className="text-sm font-medium" data-testid="text-session-stars">
                  +{sessionStars} stars earned
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-gaming text-primary mb-1">
                  {pronunciationScore ? Math.round(pronunciationScore) : '--'}%
                </div>
                <div className="text-xs text-muted-foreground">Pronunciation</div>
              </div>
              <div>
                <div className="text-2xl font-gaming text-secondary mb-1">
                  {currentChapter + 1}/{story.chapters.length}
                </div>
                <div className="text-xs text-muted-foreground">Chapters</div>
              </div>
              <div>
                <div className="text-2xl font-gaming text-accent mb-1">
                  {Math.round(story.estimatedTime * ((currentChapter + 1) / story.chapters.length))}min
                </div>
                <div className="text-xs text-muted-foreground">Reading Time</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Chapter Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleNextChapter}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
              data-testid="button-next-chapter"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              {currentChapter < story.chapters.length - 1 ? 'Next Chapter' : 'Complete Story'}
            </Button>
            <Button 
              onClick={handleSaveProgress}
              variant="secondary"
              className="px-6 py-3"
              data-testid="button-save-progress"
            >
              <Bookmark className="w-5 h-5 mr-2" />
              Save Progress
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
