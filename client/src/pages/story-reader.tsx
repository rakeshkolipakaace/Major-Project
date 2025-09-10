import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatedBackground } from "@/components/animated-background";
import { AudioControls } from "@/components/audio-controls";
import { StoryCustomizer } from "@/components/story-customizer";
import { useGameData } from "@/hooks/use-game-data";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { StoryGenerator } from "@/lib/story-generator";
import { Story, StoryTheme } from "@/types/game";
import { Home, Mic, MicOff, Check, ArrowRight, ArrowLeft, Edit, Sparkles, Bookmark } from "lucide-react";

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

  const handleStoryUpdated = (updatedStory: Story) => {
    setStory(updatedStory);
    // Reset to first chapter to see the changes
    setCurrentChapter(0);
    setPronunciationScore(null);
    
    // Update current story in game data
    setCurrentStory({
      id: updatedStory.id,
      title: updatedStory.title,
      theme: updatedStory.theme,
      currentChapter: 0,
      totalChapters: updatedStory.chapters.length,
      progress: 0
    });
  };

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
      // Story completed - add to reading score
      const currentScore = parseInt(localStorage.getItem('readingScore') || '0');
      localStorage.setItem('readingScore', (currentScore + 50).toString());
      
      addStars(50); // Completion bonus
      setCurrentStory(null);
      setLocation("/");
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      setPronunciationScore(null);
      
      // Update progress
      const newProgress = (currentChapter / story!.chapters.length) * 100;
      setCurrentStory({
        id: story!.id,
        title: story!.title,
        theme: story!.theme,
        currentChapter: currentChapter - 1,
        totalChapters: story!.chapters.length,
        progress: newProgress
      });
    }
  };

  const handleClose = () => {
    setLocation("/");
  };

  const handleSaveProgress = () => {
    updateGameData();
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-lg text-gray-600 mt-4 text-center">Loading your story...</p>
        </div>
      </div>
    );
  }

  const currentChapterData = story.chapters[currentChapter];
  const progress = ((currentChapter + 1) / story.chapters.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Modern Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button */}
            <Button 
              variant="ghost" 
              onClick={handleClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            {/* Center: Story Info */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                  {story.title}
                </h1>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span>Chapter {currentChapter + 1} of {story.chapters.length}</span>
                  {story.isCustomized && (
                    <span className="flex items-center space-x-1 text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      <span>Customized</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right: Add StoryLine Button */}
            <div className="flex items-center space-x-2">
              <div className="transform hover:scale-105 transition-transform">
                <StoryCustomizer 
                  currentStory={story}
                  onStoryUpdated={handleStoryUpdated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Story Image */}
          <div className="space-y-6">
            <div className="relative group">
              {currentChapterData.imageUrl && (
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
                  <img 
                    src={currentChapterData.imageUrl}
                    alt={`Illustration for ${currentChapterData.title}`}
                    className="w-full h-96 lg:h-[500px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Chapter Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {currentChapterData.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Page {currentChapter + 1} of {story.chapters.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {story.isCustomStory && currentChapterData.isCustomGenerated && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="flex items-center space-x-1 text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Generated</span>
                  </span>
                </div>
              )}
            </div>

            {/* Audio Controls */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <AudioControls 
                text={currentChapterData.content + " " + (currentChapterData.interactiveSection || "")}
                className=""
              />
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="space-y-6">
            
            {/* Story Text */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-gray-800 font-medium">
                  {currentChapterData.content}
                </p>
                
                {/* Interactive Reading Section */}
                {currentChapterData.interactiveSection && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-indigo-700 font-bold text-lg">Practice Reading!</span>
                    </div>
                    
                    <div className="bg-white/80 rounded-xl p-4 border border-indigo-100">
                      <p className="text-lg font-medium text-gray-800 leading-relaxed">
                        "{currentChapterData.interactiveSection}"
                      </p>
                    </div>
                    
                    {speechSupported ? (
                      <div className="space-y-4">
                        <Button
                          onClick={handleStartRecording}
                          size="lg"
                          className={`w-full py-4 font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                            isRecording 
                              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                              : pronunciationScore !== null
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-indigo-500 text-white hover:bg-indigo-600'
                          }`}
                          disabled={isListening && !isRecording}
                          data-testid="button-record"
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="w-6 h-6 mr-3" />
                              Stop Recording
                            </>
                          ) : pronunciationScore !== null ? (
                            <>
                              <Check className="w-6 h-6 mr-3" />
                              Excellent! {Math.round(pronunciationScore)}%
                            </>
                          ) : (
                            <>
                              <Mic className="w-6 h-6 mr-3" />
                              Start Reading Aloud
                            </>
                          )}
                        </Button>
                        
                        {result && (
                          <div className="bg-white/80 border border-gray-200 rounded-xl p-4">
                            <p className="text-sm text-gray-600 mb-1 font-medium">You said:</p>
                            <p className="text-gray-800 italic">"{result.transcript}"</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 bg-white/80 p-4 rounded-xl">
                        Speech recognition not supported in this browser
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Progress and Stats */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reading Progress</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {pronunciationScore ? Math.round(pronunciationScore) : '--'}%
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Pronunciation</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {currentChapter + 1}/{story.chapters.length}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Chapters</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    +{sessionStars}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Stars Earned</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>Story Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-200" />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={handlePreviousChapter}
                variant="outline"
                disabled={currentChapter === 0}
                className="flex-1 py-4 font-bold text-lg border-2 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                data-testid="button-prev-chapter"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNextChapter}
                className="flex-1 py-4 font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-200 transform hover:scale-[1.02]"
                data-testid="button-next-chapter"
              >
                {currentChapter < story.chapters.length - 1 ? 'Next Chapter' : 'Complete Story'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}