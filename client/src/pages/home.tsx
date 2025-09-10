import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatedBackground } from "@/components/animated-background";
import { Navigation } from "@/components/navigation";
import { StoryCard } from "@/components/story-card";
import { AchievementBadge } from "@/components/achievement-badge";
import { useGameData } from "@/hooks/use-game-data";
import { StoryThemeConfig } from "@/types/game";

const storyThemes: StoryThemeConfig[] = [
  {
    id: 'space',
    name: 'Space Adventures',
    description: 'Blast off to distant planets and meet alien friends in cosmic adventures!',
    color: 'primary',
    icon: 'rocket',
    storiesCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1541185934-01b600ea069c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    achievements: [
      { id: 'space-explorer', name: 'Space Explorer', description: 'Complete 5 space stories', icon: 'rocket', earned: false },
      { id: 'cosmic-reader', name: 'Cosmic Reader', description: 'Read 10 space stories', icon: 'star', earned: false }
    ]
  },
  {
    id: 'magic',
    name: 'Magical Tales',
    description: 'Enter enchanted forests and discover spells, wizards, and magical creatures!',
    color: 'accent',
    icon: 'magic',
    storiesCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    achievements: [
      { id: 'wizard-apprentice', name: 'Wizard Apprentice', description: 'Learn 5 magic spells', icon: 'hat-wizard', earned: false },
      { id: 'enchanted-reader', name: 'Enchanted Reader', description: 'Complete magical quest', icon: 'gem', earned: false }
    ]
  },
  {
    id: 'animals',
    name: 'Animal Kingdom',
    description: 'Join wild animals on exciting adventures through jungles, oceans, and savanna!',
    color: 'green-400',
    icon: 'paw',
    storiesCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    achievements: [
      { id: 'animal-friend', name: 'Animal Friend', description: 'Meet 10 animal characters', icon: 'leaf', earned: false },
      { id: 'jungle-explorer', name: 'Jungle Explorer', description: 'Explore 3 habitats', icon: 'tree', earned: false }
    ]
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { gameData, updateStreak } = useGameData();

  // Get reading score from localStorage
  const getReadingScore = () => {
    const savedScore = localStorage.getItem('readingScore');
    return savedScore ? parseInt(savedScore) : 0;
  };

  const readingScore = getReadingScore();


  const handleThemeSelect = (themeId: string) => {
    updateStreak();
    setLocation(`/story/${themeId}/0`);
  };

  const handleContinueReading = () => {
    if (gameData.currentStory) {
      setLocation(`/story/${gameData.currentStory.theme}/${gameData.currentStory.id}`);
    }
  };

  const readingProgress = Math.min(100, (gameData.totalStoriesRead / 5) * 100);
  const pronunciationProgress = 85; // Mock data

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AnimatedBackground />
      <Navigation />
      
      <main className="relative z-10 max-w-7xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12 space-y-6">
          <h2 className="text-4xl md:text-6xl font-gaming text-primary animate-pulse">
            Welcome to Tale Galaxy!
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Embark on magical adventures with AI-powered stories. Read, listen, and improve your skills while exploring the universe!
          </p>
          
          {/* Featured Stories */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation("/story-selection")}
                className="px-8 py-4 bg-primary text-primary-foreground font-gaming text-lg hover:bg-primary/90 rounded-xl"
                data-testid="button-comedy-stories"
              >
                🎭 Fun Comedy Stories
              </Button>
              <Button 
                onClick={() => setLocation("/storybook")}
                className="px-8 py-4 bg-secondary text-secondary-foreground font-gaming text-lg hover:bg-secondary/90 rounded-xl"
                data-testid="button-featured-story"
              >
                <i className="fas fa-book-open mr-3" />
                Space Adventure Story
              </Button>
            </div>
          </div>
          
          {/* Reading Score & Daily Progress */}
          <div className="bg-card/30 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-border">
            <h3 className="text-lg font-gaming text-secondary mb-4">Your Reading Journey</h3>
            
            {/* Reading Score Display */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-4 border border-purple-200">
              <div className="text-center">
                <div className="text-3xl font-gaming text-purple-600 mb-1">
                  {readingScore}
                </div>
                <div className="text-sm text-purple-600 font-medium">Reading Score</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Complete stories and improve pronunciation to increase your score!
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Reading Goal</span>
                  <span data-testid="text-reading-progress">{gameData.totalStoriesRead}/5 stories</span>
                </div>
                <Progress value={readingProgress} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Pronunciation Practice</span>
                  <span data-testid="text-pronunciation-progress">{pronunciationProgress}%</span>
                </div>
                <Progress value={pronunciationProgress} className="h-3" />
              </div>
            </div>
          </div>
        </section>

        {/* Story Categories */}
        <section className="space-y-6">
          <h3 className="text-3xl font-gaming text-center text-secondary">Choose Your Adventure</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyThemes.map((theme) => (
              <StoryCard 
                key={theme.id}
                theme={theme}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="space-y-6">
          <h3 className="text-3xl font-gaming text-center text-secondary">Recent Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AchievementBadge
              icon="book-open"
              name="Story Master"
              description="Read 10 stories"
              earned={gameData.totalStoriesRead >= 10}
            />
            <AchievementBadge
              icon="microphone"
              name="Clear Speaker"
              description="90% pronunciation"
              earned={pronunciationProgress >= 90}
            />
            <AchievementBadge
              icon="calendar-check"
              name="Daily Reader"
              description="7 day streak"
              earned={gameData.streak >= 7}
            />
            <AchievementBadge
              icon="lock"
              name="Space Explorer"
              description="Complete 5 space stories"
              earned={false}
            />
          </div>
        </section>

        {/* Continue Reading */}
        {gameData.currentStory && (
          <section className="space-y-6">
            <h3 className="text-3xl font-gaming text-center text-secondary">Continue Your Journey</h3>
            <div className="bg-card/30 backdrop-blur-md rounded-2xl p-6 border border-border">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                    alt="Current story scene"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-rocket text-primary" />
                    <span className="text-sm text-muted-foreground capitalize">
                      {gameData.currentStory.theme} Adventures
                    </span>
                  </div>
                  <h4 className="text-2xl font-gaming text-primary">{gameData.currentStory.title}</h4>
                  <p className="text-muted-foreground">
                    Continue your amazing adventure and discover what happens next!
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span data-testid="text-current-progress">
                        Chapter {gameData.currentStory.currentChapter} of {gameData.currentStory.totalChapters}
                      </span>
                    </div>
                    <Progress value={gameData.currentStory.progress} className="h-3" />
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleContinueReading}
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                      data-testid="button-continue-reading"
                    >
                      <i className="fas fa-play mr-2" />
                      Continue Reading
                    </Button>
                    <Button 
                      variant="secondary"
                      className="px-4 py-3"
                      data-testid="button-audio-preview"
                    >
                      <i className="fas fa-volume-up" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
