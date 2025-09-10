import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatedBackground } from "@/components/animated-background";
import { Navigation } from "@/components/navigation";
import { comedyStories, ComedyStory, StoryPage } from "@/data/comedy-stories";
import { ImageGenerator } from "@/lib/image-generator";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useGameData } from "@/hooks/use-game-data";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Volume2, 
  Star,
  Home,
  Loader2,
  Award
} from "lucide-react";

export default function ComedyReader() {
  const { storyId } = useParams<{ storyId: string }>();
  const [, setLocation] = useLocation();
  const [story, setStory] = useState<ComedyStory | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [totalStarsEarned, setTotalStarsEarned] = useState(0);
  const imageCache = useRef<Map<string, string>>(new Map());
  
  const { gameData, addStars, updateGameData } = useGameData();
  const { 
    isSupported: speechSupported, 
    isPlaying,
    speak, 
    pause, 
    resume, 
    stop 
  } = useSpeechSynthesis();
  const { 
    isSupported: recognitionSupported, 
    isListening, 
    result, 
    startListening, 
    stopListening,
    calculatePronunciationScore 
  } = useSpeechRecognition();

  // Load story data
  useEffect(() => {
    if (storyId) {
      const foundStory = comedyStories.find(s => s.id === storyId);
      if (foundStory) {
        setStory(foundStory);
        // Pre-generate images for better performance
        preloadImages(foundStory);
      }
    }
  }, [storyId]);

  // Generate image for current page
  useEffect(() => {
    if (story && story.pages[currentPageIndex]) {
      generateImageForPage(story.pages[currentPageIndex]);
    }
  }, [story, currentPageIndex]);

  const preloadImages = async (storyData: ComedyStory) => {
    // Pre-generate first few images
    for (let i = 0; i < Math.min(3, storyData.pages.length); i++) {
      const page = storyData.pages[i];
      if (!imageCache.current.has(page.id)) {
        try {
          const imageUrl = await ImageGenerator.generateImage({
            prompt: page.imagePrompt,
            style: 'cartoon'
          });
          imageCache.current.set(page.id, imageUrl);
          if (i === 0) setCurrentImage(imageUrl);
        } catch (error) {
          console.error('Failed to preload image:', error);
        }
      }
    }
  };

  const generateImageForPage = async (page: StoryPage) => {
    console.log('Generating image for page:', page.id, 'with prompt:', page.imagePrompt);
    
    if (imageCache.current.has(page.id)) {
      console.log('Using cached image for page:', page.id);
      setCurrentImage(imageCache.current.get(page.id)!);
      return;
    }

    setIsLoadingImage(true);
    try {
      console.log('Requesting new image generation...');
      const imageUrl = await ImageGenerator.generateImage({
        prompt: page.imagePrompt,
        style: 'cartoon'
      });
      console.log('Image generated successfully for page:', page.id);
      imageCache.current.set(page.id, imageUrl);
      setCurrentImage(imageUrl);
    } catch (error) {
      console.error('Image generation failed for page:', page.id, error);
      // Use placeholder image
      const placeholderUrl = ImageGenerator.getPlaceholderImage(page.imagePrompt);
      console.log('Using placeholder image:', placeholderUrl);
      setCurrentImage(placeholderUrl);
    } finally {
      setIsLoadingImage(false);
    }
  };

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

  const handlePlayPause = () => {
    if (!story) return;
    
    const currentPage = story.pages[currentPageIndex];
    if (isPlaying) {
      pause();
    } else {
      speak(currentPage.voiceText, {
        rate: 0.8,
        pitch: 1.1,
        volume: 0.9
      });
    }
  };

  const handleNextPage = () => {
    if (!story) return;
    
    if (currentPageIndex < story.pages.length - 1) {
      const nextIndex = currentPageIndex + 1;
      console.log('Moving to next page:', nextIndex, 'of', story.pages.length);
      setCurrentPageIndex(nextIndex);
      setPronunciationScore(null);
      stop(); // Stop current narration
      
      // Force image generation for next page
      setTimeout(() => {
        if (story) {
          generateImageForPage(story.pages[nextIndex]);
        }
      }, 100);
    } else {
      // Story completed
      const completionBonus = 100;
      addStars(completionBonus);
      setTotalStarsEarned(prev => prev + completionBonus);
      updateGameData();
      setLocation("/story-selection");
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevIndex = currentPageIndex - 1;
      console.log('Moving to previous page:', prevIndex);
      setCurrentPageIndex(prevIndex);
      setPronunciationScore(null);
      stop(); // Stop current narration
      
      // Force image generation for previous page  
      setTimeout(() => {
        if (story) {
          generateImageForPage(story.pages[prevIndex]);
        }
      }, 100);
    }
  };

  const handleClose = () => {
    stop();
    setLocation("/story-selection");
  };

  // Handle speech recognition result
  useEffect(() => {
    if (result && result.isComplete && story) {
      const currentPage = story.pages[currentPageIndex];
      const expectedText = currentPage.practiceText || currentPage.voiceText;
      const score = calculatePronunciationScore(expectedText, result.transcript);
      setPronunciationScore(score);
      setIsRecording(false);
      
      // Award stars based on pronunciation score
      const starsEarned = score >= 90 ? 30 : score >= 80 ? 20 : score >= 70 ? 15 : 10;
      addStars(starsEarned);
      setTotalStarsEarned(prev => prev + starsEarned);
      setSessionScores(prev => [...prev, score]);
    }
  }, [result, story, currentPageIndex, calculatePronunciationScore, addStars]);

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading your funny story...</p>
        </div>
      </div>
    );
  }

  const currentPage = story.pages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / story.pages.length) * 100;
  const averageScore = sessionScores.length > 0 
    ? sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length 
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AnimatedBackground />
      <Navigation />
      
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden reading-modal border-border p-0">
          <div className="flex h-[90vh]">
            {/* Left Side - Image */}
            <div className="w-1/2 relative bg-gradient-to-br from-primary/10 to-secondary/10">
              {isLoadingImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg font-gaming text-primary">
                      Creating your story picture...
                    </p>
                  </div>
                </div>
              ) : currentImage ? (
                <img 
                  src={currentImage}
                  alt={currentPage.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-lg text-muted-foreground">Loading image...</p>
                </div>
              )}
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/30" />
              
              {/* Page Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h2 className="text-3xl font-gaming text-white mb-2">
                  {currentPage.title}
                </h2>
                <Badge className="bg-primary text-primary-foreground">
                  Page {currentPageIndex + 1} of {story.pages.length}
                </Badge>
              </div>
            </div>

            {/* Right Side - Story Content */}
            <div className="w-1/2 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h1 className="text-2xl font-gaming text-primary">{story.title}</h1>
                  <p className="text-sm text-muted-foreground">{story.theme} • {story.difficulty}</p>
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

              {/* Story Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-foreground mb-6">
                    {currentPage.content}
                  </p>
                </div>

                {/* Voice Practice Section */}
                {currentPage.practiceText && (
                  <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Mic className="w-5 h-5 text-accent" />
                      <span className="font-gaming text-accent">Practice Reading!</span>
                    </div>
                    <p className="text-lg font-medium mb-4 text-foreground">
                      "{currentPage.practiceText}"
                    </p>
                    
                    {recognitionSupported ? (
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
                              <Award className="w-5 h-5 mr-2" />
                              Great! Score: {Math.round(pronunciationScore)}%
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

                {/* Audio Controls */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-gaming text-secondary">Story Narration</h4>
                    <Button
                      onClick={handlePlayPause}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-play-pause"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Volume2 className="w-4 h-4" />
                    <span>Listen to the story with computer voice</span>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="bg-card/50 rounded-lg p-4">
                  <h4 className="font-gaming text-secondary mb-3">Your Progress</h4>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-gaming text-primary">
                        {pronunciationScore ? Math.round(pronunciationScore) : '--'}%
                      </div>
                      <div className="text-xs text-muted-foreground">Last Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-gaming text-secondary">
                        {Math.round(averageScore)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Average</div>
                    </div>
                    <div>
                      <div className="text-2xl font-gaming text-accent flex items-center justify-center">
                        <Star className="w-5 h-5 mr-1" />
                        {totalStarsEarned}
                      </div>
                      <div className="text-xs text-muted-foreground">Stars Earned</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Story Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="p-6 border-t border-border">
                <div className="flex space-x-4">
                  <Button 
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    variant="outline"
                    className="px-6"
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={handleNextPage}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-next-page"
                  >
                    {currentPageIndex < story.pages.length - 1 ? (
                      <>
                        Next Page
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Story
                        <Star className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => setLocation("/")}
                    variant="outline"
                    className="px-6"
                    data-testid="button-home"
                  >
                    <Home className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}