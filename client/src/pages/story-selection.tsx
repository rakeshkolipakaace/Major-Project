import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/animated-background";
import { Navigation } from "@/components/navigation";
import { comedyStories } from "@/data/comedy-stories";
import { Clock, Star, Smile, Users, ArrowRight } from "lucide-react";

const difficultyColors = {
  easy: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-white"
};

const themeIcons = {
  cooking: "🍳",
  sports: "🏏", 
  school: "📚",
  animals: "🦁"
};

export default function StorySelection() {
  const [, setLocation] = useLocation();
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleStorySelect = (storyId: string) => {
    setLocation(`/comedy-reader/${storyId}`);
  };

  const goHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AnimatedBackground />
      <Navigation />
      
      <main className="relative z-10 max-w-6xl mx-auto p-4 space-y-8">
        {/* Header */}
        <section className="text-center py-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-gaming text-primary">
            🎭 Fun Comedy Stories 🎭
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your favorite funny story! Read along, practice your voice, and laugh while learning!
          </p>
          <Button 
            onClick={goHome}
            variant="outline" 
            className="mt-4"
            data-testid="button-back-home"
          >
            ← Back to Home
          </Button>
        </section>

        {/* Story Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comedyStories.map((story) => (
            <div 
              key={story.id}
              className={`story-card rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                selectedStory === story.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedStory(story.id)}
              data-testid={`card-story-${story.id}`}
            >
              {/* Story Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">
                    {themeIcons[story.theme as keyof typeof themeIcons]}
                  </div>
                  <div>
                    <h3 className="text-xl font-gaming text-primary mb-1">
                      {story.title}
                    </h3>
                    <Badge className={difficultyColors[story.difficulty]}>
                      {story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{story.estimatedTime} min</span>
                  </div>
                </div>
              </div>

              {/* Story Description */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {story.description}
              </p>

              {/* Story Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Pages</span>
                  </div>
                  <span className="text-lg font-gaming text-primary">
                    {story.pages.length}
                  </span>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Smile className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Fun Level</span>
                  </div>
                  <div className="flex justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className="w-3 h-3 text-accent fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Story Preview */}
              <div className="bg-accent/10 border-l-4 border-accent rounded p-3 mb-4">
                <h4 className="text-sm font-gaming text-accent mb-2">Story Preview:</h4>
                <p className="text-sm text-foreground italic">
                  "{story.pages[0].content.substring(0, 120)}..."
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>🎵 Computer voice narration</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>🎤 Voice practice & scoring</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span>🖼️ AI-generated story images</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span>📊 Reading progress tracking</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStorySelect(story.id);
                }}
                className="w-full bg-primary text-primary-foreground font-gaming hover:bg-primary/90 transition-colors"
                data-testid={`button-start-${story.id}`}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Start Reading Adventure!
              </Button>
            </div>
          ))}
        </section>

        {/* Fun Facts Section */}
        <section className="bg-card/30 backdrop-blur-md rounded-2xl p-6 border border-border">
          <h3 className="text-2xl font-gaming text-secondary text-center mb-4">
            🌟 Fun Reading Features 🌟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🖼️</div>
              <h4 className="font-gaming text-primary mb-2">Smart Images</h4>
              <p className="text-sm text-muted-foreground">
                Each page shows pictures that match exactly what's happening in the story!
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-gaming text-primary mb-2">Reading Score</h4>
              <p className="text-sm text-muted-foreground">
                Practice reading aloud and get scores to improve your pronunciation!
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">😄</div>
              <h4 className="font-gaming text-primary mb-2">Super Funny</h4>
              <p className="text-sm text-muted-foreground">
                All stories are designed to make you laugh while you learn!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}