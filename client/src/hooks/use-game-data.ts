import { useState, useEffect } from 'react';
import { GameData, Achievement, CurrentStory } from '@/types/game';
import { GameStorage } from '@/lib/game-storage';

export function useGameData() {
  const [gameData, setGameData] = useState<GameData>(() => GameStorage.loadGameData());

  const updateGameData = () => {
    setGameData(GameStorage.loadGameData());
  };

  const addStars = (amount: number) => {
    GameStorage.updateStars(amount);
    updateGameData();
  };

  const addAchievement = (achievement: Achievement) => {
    GameStorage.addAchievement(achievement);
    updateGameData();
  };

  const setCurrentStory = (story: CurrentStory | null) => {
    GameStorage.setCurrentStory(story);
    updateGameData();
  };

  const updateStreak = () => {
    GameStorage.updateStreak();
    updateGameData();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      GameStorage.saveGameData(gameData);
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [gameData]);

  return {
    gameData,
    addStars,
    addAchievement,
    setCurrentStory,
    updateStreak,
    updateGameData
  };
}
