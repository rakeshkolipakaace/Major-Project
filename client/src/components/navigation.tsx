import { Rocket, Star, Trophy, Flame, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameData } from "@/hooks/use-game-data";

export function Navigation() {
  const { gameData } = useGameData();

  return (
    <nav className="relative z-50 p-4 bg-card/20 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Rocket className="text-xl text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-gaming text-primary">Tale Galaxy</h1>
        </div>
        
        {/* Progress Stats */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium" data-testid="text-stars">{gameData.stars}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium" data-testid="text-achievements">{gameData.achievements.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium" data-testid="text-streak">{gameData.streak} days</span>
          </div>
        </div>

        <Button variant="secondary" size="sm" data-testid="button-profile">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}
