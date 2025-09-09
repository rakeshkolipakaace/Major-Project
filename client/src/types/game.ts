export interface GameData {
  stars: number;
  achievements: Achievement[];
  currentStory: CurrentStory | null;
  readingProgress: Record<string, StoryProgress>;
  streak: number;
  totalStoriesRead: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface CurrentStory {
  id: string;
  title: string;
  theme: StoryTheme;
  currentChapter: number;
  totalChapters: number;
  progress: number;
}

export interface StoryProgress {
  completed: boolean;
  currentChapter: number;
  totalChapters: number;
  pronunciationScores: number[];
  timeSpent: number;
  starsEarned: number;
}

export interface Story {
  id: string;
  title: string;
  theme: StoryTheme;
  description: string;
  chapters: Chapter[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  interactiveSection?: string;
  audioUrl?: string;
}

export type StoryTheme = 'space' | 'magic' | 'animals';

export interface StoryThemeConfig {
  id: StoryTheme;
  name: string;
  description: string;
  color: string;
  icon: string;
  storiesCount: number;
  imageUrl: string;
  achievements: Achievement[];
}
