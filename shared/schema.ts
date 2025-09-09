import { z } from "zod";

// Game Data Schemas
export const userProgressSchema = z.object({
  id: z.string(),
  stars: z.number().min(0),
  achievements: z.array(z.string()),
  currentStoryId: z.string().nullable(),
  streak: z.number().min(0),
  totalStoriesRead: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const storySchema = z.object({
  id: z.string(),
  title: z.string(),
  theme: z.enum(['space', 'magic', 'animals']),
  description: z.string(),
  chapters: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    interactiveSection: z.string().optional()
  })),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedTime: z.number() // minutes
});

export const achievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  earned: z.boolean(),
  earnedAt: z.date().optional()
});

export const readingSessionSchema = z.object({
  id: z.string(),
  storyId: z.string(),
  userId: z.string(),
  chapterProgress: z.number(),
  pronunciationScores: z.array(z.number()),
  timeSpent: z.number(), // seconds
  starsEarned: z.number(),
  completedAt: z.date().optional(),
  createdAt: z.date()
});

// Insert schemas
export const insertUserProgressSchema = userProgressSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertStorySchema = storySchema.omit({ id: true });

export const insertAchievementSchema = achievementSchema.omit({ 
  earned: true, 
  earnedAt: true 
});

export const insertReadingSessionSchema = readingSessionSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type UserProgress = z.infer<typeof userProgressSchema>;
export type Story = z.infer<typeof storySchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type ReadingSession = z.infer<typeof readingSessionSchema>;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;
