import { Story, StoryTheme, Chapter } from '@/types/game';

const storyTemplates = {
  space: [
    {
      title: "The Purple Planet Mystery",
      description: "Luna the astronaut discovers a mysterious purple planet with singing crystals.",
      chapters: [
        {
          title: "The Discovery",
          content: "Luna stepped out of her shiny rocket ship and gasped. The ground beneath her feet was covered in sparkling purple crystals that made beautiful music when the wind blew through them.",
          interactiveSection: '"What a magical sound!" Luna said with wonder. "I must discover the secret of these singing crystals."'
        },
        {
          title: "The Crystal Cave",
          content: "Following the melodic sounds, Luna found a glowing cave. Inside, the crystals grew larger and their songs grew louder, creating a symphony of cosmic music.",
          interactiveSection: '"This cave is incredible!" Luna exclaimed. "The crystals are trying to tell me something important."'
        }
      ]
    }
  ],
  magic: [
    {
      title: "The Enchanted Forest Quest",
      description: "Mia the young wizard enters an enchanted forest to find the lost wand of wisdom.",
      chapters: [
        {
          title: "Into the Woods",
          content: "Mia clutched her spell book tightly as she entered the enchanted forest. The trees whispered ancient secrets and glowing butterflies danced around her.",
          interactiveSection: '"I must find the wand of wisdom," Mia said bravely. "The forest creatures need my help."'
        }
      ]
    }
  ],
  animals: [
    {
      title: "Safari Adventure",
      description: "Join Zara the explorer as she photographs amazing animals in the African savanna.",
      chapters: [
        {
          title: "The Great Migration",
          content: "Zara watched in amazement as thousands of zebras and wildebeest crossed the river. Her camera captured every magical moment of their journey.",
          interactiveSection: '"Look at those beautiful stripes!" Zara whispered excitedly. "Each zebra has a unique pattern, just like fingerprints!"'
        }
      ]
    }
  ]
};

export class StoryGenerator {
  static generateStory(theme: StoryTheme, storyIndex: number = 0): Story {
    const templates = storyTemplates[theme];
    const template = templates[storyIndex % templates.length];
    
    const story: Story = {
      id: `${theme}_${storyIndex}`,
      title: template.title,
      theme,
      description: template.description,
      difficulty: 'easy',
      estimatedTime: template.chapters.length * 3, // 3 minutes per chapter
      chapters: template.chapters.map((chapter, index) => ({
        id: `${theme}_${storyIndex}_${index}`,
        title: chapter.title,
        content: chapter.content,
        interactiveSection: chapter.interactiveSection
      }))
    };

    return story;
  }

  static getStoriesByTheme(theme: StoryTheme): Story[] {
    const templates = storyTemplates[theme];
    return templates.map((_, index) => this.generateStory(theme, index));
  }

  static getAllStories(): Story[] {
    const allStories: Story[] = [];
    (['space', 'magic', 'animals'] as StoryTheme[]).forEach(theme => {
      allStories.push(...this.getStoriesByTheme(theme));
    });
    return allStories;
  }
}
