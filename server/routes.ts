import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { storySchema } from "@shared/schema";

const storyTemplatesPath = path.join(process.cwd(), 'server/data/story-templates.json');

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get story templates by theme
  app.get("/api/stories/:theme", (req, res) => {
    try {
      const theme = req.params.theme;
      
      if (!['space', 'magic', 'animals'].includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme' });
      }

      const templates = JSON.parse(fs.readFileSync(storyTemplatesPath, 'utf-8'));
      const themeStories = templates[theme] || [];
      
      res.json(themeStories);
    } catch (error) {
      console.error('Error loading story templates:', error);
      res.status(500).json({ error: 'Failed to load stories' });
    }
  });

  // Generate a specific story
  app.get("/api/stories/:theme/:storyId", (req, res) => {
    try {
      const { theme, storyId } = req.params;
      
      if (!['space', 'magic', 'animals'].includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme' });
      }

      const templates = JSON.parse(fs.readFileSync(storyTemplatesPath, 'utf-8'));
      const themeStories = templates[theme] || [];
      const storyIndex = parseInt(storyId);
      
      if (storyIndex >= themeStories.length) {
        return res.status(404).json({ error: 'Story not found' });
      }

      const template = themeStories[storyIndex];
      const story = {
        id: `${theme}_${storyIndex}`,
        title: template.title,
        theme,
        description: template.description,
        difficulty: template.difficulty || 'easy',
        estimatedTime: template.chapters.length * 3,
        chapters: template.chapters.map((chapter: any, index: number) => ({
          id: `${theme}_${storyIndex}_${index}`,
          title: chapter.title,
          content: chapter.content,
          interactiveSection: chapter.interactiveSection
        }))
      };

      // Validate the story structure
      const validatedStory = storySchema.parse(story);
      res.json(validatedStory);
    } catch (error) {
      console.error('Error generating story:', error);
      res.status(500).json({ error: 'Failed to generate story' });
    }
  });

  // Get achievement definitions
  app.get("/api/achievements", (req, res) => {
    const achievements = [
      {
        id: 'story-master',
        name: 'Story Master',
        description: 'Read 10 stories',
        icon: 'book-open'
      },
      {
        id: 'clear-speaker',
        name: 'Clear Speaker',
        description: '90% pronunciation accuracy',
        icon: 'microphone'
      },
      {
        id: 'daily-reader',
        name: 'Daily Reader',
        description: 'Maintain a 7-day reading streak',
        icon: 'calendar-check'
      },
      {
        id: 'space-explorer',
        name: 'Space Explorer',
        description: 'Complete 5 space adventure stories',
        icon: 'rocket'
      },
      {
        id: 'magic-apprentice',
        name: 'Magic Apprentice',
        description: 'Complete 5 magical tales',
        icon: 'hat-wizard'
      },
      {
        id: 'animal-friend',
        name: 'Animal Friend',
        description: 'Complete 5 animal kingdom stories',
        icon: 'paw'
      }
    ];

    res.json(achievements);
  });

  const httpServer = createServer(app);
  return httpServer;
}
