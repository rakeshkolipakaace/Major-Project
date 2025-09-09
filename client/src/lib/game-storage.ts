import { GameData, Achievement, CurrentStory, StoryProgress } from '@/types/game';

const STORAGE_KEY = 'tale-galaxy-data';

const defaultGameData: GameData = {
  stars: 0,
  achievements: [],
  currentStory: null,
  readingProgress: {},
  streak: 0,
  totalStoriesRead: 0
};

export class GameStorage {
  static saveGameData(data: GameData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static loadGameData(): GameData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultGameData, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load game data:', error);
    }
    return defaultGameData;
  }

  static updateStars(amount: number): void {
    const data = this.loadGameData();
    data.stars = Math.max(0, data.stars + amount);
    this.saveGameData(data);
  }

  static updateProgress(storyId: string, progress: Partial<StoryProgress>): void {
    const data = this.loadGameData();
    data.readingProgress[storyId] = {
      ...data.readingProgress[storyId],
      ...progress
    };
    this.saveGameData(data);
  }

  static addAchievement(achievement: Achievement): void {
    const data = this.loadGameData();
    if (!data.achievements.find(a => a.id === achievement.id)) {
      data.achievements.push({ ...achievement, earned: true, earnedAt: new Date() });
      data.stars += 50; // Bonus stars for achievements
      this.saveGameData(data);
    }
  }

  static setCurrentStory(story: CurrentStory | null): void {
    const data = this.loadGameData();
    data.currentStory = story;
    this.saveGameData(data);
  }

  static updateStreak(): void {
    const data = this.loadGameData();
    const today = new Date().toDateString();
    const lastRead = localStorage.getItem('tale-galaxy-last-read');
    
    if (lastRead !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastRead === yesterday.toDateString()) {
        data.streak += 1;
      } else if (lastRead !== today) {
        data.streak = 1;
      }
      
      localStorage.setItem('tale-galaxy-last-read', today);
      this.saveGameData(data);
    }
  }
}
