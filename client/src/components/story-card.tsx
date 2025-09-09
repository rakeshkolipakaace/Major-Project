import { Button } from "@/components/ui/button";
import { StoryThemeConfig } from "@/types/game";
import { Rocket, Wand2, PawPrint } from "lucide-react";

interface StoryCardProps {
  theme: StoryThemeConfig;
  onSelect: (themeId: string) => void;
}

const themeIcons = {
  space: Rocket,
  magic: Wand2,
  animals: PawPrint
};

const themeColors = {
  space: "text-primary",
  magic: "text-accent", 
  animals: "text-green-400"
};

const buttonColors = {
  space: "bg-primary text-primary-foreground hover:bg-primary/90",
  magic: "bg-accent text-accent-foreground hover:bg-accent/90",
  animals: "bg-green-400 text-green-900 hover:bg-green-400/90"
};

export function StoryCard({ theme, onSelect }: StoryCardProps) {
  const Icon = themeIcons[theme.id];
  const colorClass = themeColors[theme.id];
  const buttonClass = buttonColors[theme.id];

  return (
    <div 
      className="story-card rounded-2xl p-6 cursor-pointer"
      onClick={() => onSelect(theme.id)}
      data-testid={`card-theme-${theme.id}`}
    >
      <img 
        src={theme.imageUrl}
        alt={`${theme.name} adventure scene`}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-xl font-gaming ${colorClass}`}>{theme.name}</h4>
        <div className="flex items-center space-x-1">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <span className="text-sm text-muted-foreground" data-testid={`text-story-count-${theme.id}`}>
            {theme.storiesCount} stories
          </span>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4">
        {theme.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {theme.achievements.slice(0, 3).map((achievement, index) => (
              <div 
                key={achievement.id}
                className="achievement-badge w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs"
                data-testid={`badge-achievement-${achievement.id}`}
              >
                <i className={`fas fa-${achievement.icon}`} />
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {theme.achievements.length} achievements
          </span>
        </div>
        <Button 
          className={buttonClass}
          data-testid={`button-explore-${theme.id}`}
        >
          Explore
        </Button>
      </div>
    </div>
  );
}
