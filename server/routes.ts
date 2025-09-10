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

  // Generate image using Clipdrop API
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, style } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.CLIPDROP_API_KEY;
      
      if (!apiKey) {
        console.warn('Clipdrop API key not found, using placeholder image');
        return res.json({ 
          imageUrl: getPlaceholderImageUrl(prompt),
          isPlaceholder: true 
        });
      }

      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('output_format', 'jpeg');
      
      const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Clipdrop API error:', response.status, await response.text());
        return res.json({ 
          imageUrl: getPlaceholderImageUrl(prompt),
          isPlaceholder: true 
        });
      }

      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      
      res.json({ imageUrl, isPlaceholder: false });
    } catch (error) {
      console.error('Image generation error:', error);
      res.json({ 
        imageUrl: getPlaceholderImageUrl(req.body.prompt || ''),
        isPlaceholder: true 
      });
    }
  });

  function getPlaceholderImageUrl(prompt: string): string {
    // Return themed placeholder based on prompt content
    if (prompt.includes('playground') || prompt.includes('cricket') || prompt.includes('playing')) {
      return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
    } else if (prompt.includes('kitchen') || prompt.includes('cooking') || prompt.includes('food')) {
      return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
    } else if (prompt.includes('park') || prompt.includes('outdoor') || prompt.includes('garden')) {
      return 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
    } else if (prompt.includes('school') || prompt.includes('classroom') || prompt.includes('learning')) {
      return 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
    } else if (prompt.includes('animal') || prompt.includes('pet') || prompt.includes('zoo')) {
      return 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
    }
    
    // Default child-friendly placeholder
    return 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
  }

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
