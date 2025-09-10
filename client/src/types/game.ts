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
  isCustomStory?: boolean;
  isCustomized?: boolean;
  customPrompt?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  interactiveSection?: string;
  audioUrl?: string;
  imageUrl?: string;
  imagePrompt?: string;
  isCustomGenerated?: boolean;
}

export type StoryTheme = 'space' | 'magic' | 'animals' | 'custom';

export interface StoryThemeConfig {
  id: Exclude<StoryTheme, 'custom'>;
  name: string;
  description: string;
  color: string;
  icon: string;
  storiesCount: number;
  imageUrl: string;
  achievements: Achievement[];
}

export interface CustomStory extends Story {
  isCustomStory: true;
  customPrompt: string;
  chapters: (Chapter & {
    imageUrl?: string;
    imagePrompt?: string;
    isCustomGenerated?: boolean;
  })[];
}
