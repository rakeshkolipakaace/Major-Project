import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoryCustomizerProps {
  currentStory: any;
  onStoryUpdated: (updatedStory: any) => void;
}

export function StoryCustomizer({ currentStory, onStoryUpdated }: StoryCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  const handleCustomizeStory = async () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe how you want to change the story.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate a new version of the current story with the custom prompt
      const response = await fetch('/api/customize-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalStory: currentStory,
          customPrompt: customPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to customize story');
      }

      const customizedStory = await response.json();
      
      // Generate new images for the customized story
      const storyWithNewImages = await generateImagesForCustomizedStory(customizedStory);
      
      // Update reading score
      const currentScore = parseInt(localStorage.getItem('readingScore') || '0');
      localStorage.setItem('readingScore', (currentScore + 25).toString());
      
      onStoryUpdated(storyWithNewImages);
      setIsOpen(false);
      setCustomPrompt('');
      
      toast({
        title: "Story Customized!",
        description: "Your story has been updated with your creative changes and new images!",
      });
      
    } catch (error) {
      console.error('Error customizing story:', error);
      toast({
        title: "Customization Failed",
        description: "There was an error customizing your story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImagesForCustomizedStory = async (story: any) => {
    const chaptersWithImages = await Promise.all(
      story.chapters.map(async (chapter: any, index: number) => {
        try {
          // Create image prompt based on chapter content and custom changes
          const imagePrompt = `${chapter.content} ${customPrompt}, children's book illustration, cartoon style, colorful, child-friendly`;
          
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: imagePrompt,
              style: 'children_book'
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            return {
              ...chapter,
              imageUrl: imageData.imageUrl,
              isCustomGenerated: true
            };
          }
        } catch (error) {
          console.error('Error generating image for chapter:', error);
        }
        
        // Keep existing image or use fallback
        return {
          ...chapter,
          imageUrl: chapter.imageUrl || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          isCustomGenerated: false
        };
      })
    );

    return {
      ...story,
      chapters: chaptersWithImages,
      isCustomized: true
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Edit className="mr-2 h-5 w-5" />
          Add StoryLine
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-purple-500" />
            <span>Customize This Story</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="customPrompt" className="text-base font-semibold">How would you like to change the story?</Label>
            <Textarea
              id="customPrompt"
              placeholder="Describe how you want to modify this story. For example: 'Add a friendly dragon who helps the main character', 'Make the adventure happen in a magical underwater world', 'Include a special treasure hunt with puzzles to solve'..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[140px] mt-3 text-lg"
            />
            <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <p className="text-sm text-purple-700 font-medium mb-2">
                ✨ Story Customization Features:
              </p>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>• Change characters, settings, or plot elements</li>
                <li>• Add new adventures or magical elements</li>
                <li>• Generate new AI images for your custom story</li>
                <li>• Make the story uniquely yours!</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleCustomizeStory}
              disabled={isGenerating}
              className="flex-1 bg-purple-500 hover:bg-purple-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Customizing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Apply Changes
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}