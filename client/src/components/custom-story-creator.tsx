import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomStoryCreatorProps {
  onStoryCreated: (story: any) => void;
}

interface CustomStoryData {
  title: string;
  theme: string;
  customPrompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mainCharacter: string;
  setting: string;
}

export function CustomStoryCreator({ onStoryCreated }: CustomStoryCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyData, setStoryData] = useState<CustomStoryData>({
    title: '',
    theme: 'space',
    customPrompt: '',
    difficulty: 'easy',
    mainCharacter: '',
    setting: ''
  });
  const { toast } = useToast();

  const themes = [
    { value: 'space', label: 'Space Adventures' },
    { value: 'magic', label: 'Magical Tales' },
    { value: 'animals', label: 'Animal Kingdom' },
    { value: 'comedy', label: 'Comedy Stories' },
    { value: 'custom', label: 'Custom Theme' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy (5-7 years)' },
    { value: 'medium', label: 'Medium (8-10 years)' },
    { value: 'hard', label: 'Hard (11+ years)' }
  ];

  const handleInputChange = (field: keyof CustomStoryData, value: string) => {
    setStoryData(prev => ({ ...prev, [field]: value }));
  };

  const generateCustomStory = async () => {
    if (!storyData.title || !storyData.customPrompt) {
      toast({
        title: "Missing Information",
        description: "Please fill in the story title and your custom storyline.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate the story using the custom prompt
      const storyResponse = await fetch('/api/generate-custom-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: storyData.title,
          theme: storyData.theme,
          customPrompt: storyData.customPrompt,
          difficulty: storyData.difficulty,
          mainCharacter: storyData.mainCharacter,
          setting: storyData.setting
        }),
      });

      if (!storyResponse.ok) {
        throw new Error('Failed to generate story');
      }

      const customStory = await storyResponse.json();
      
      // Generate images for each chapter
      const storyWithImages = await generateImagesForStory(customStory);
      
      onStoryCreated(storyWithImages);
      setIsOpen(false);
      resetForm();
      
      toast({
        title: "Story Created!",
        description: "Your custom story has been generated with images. Enjoy reading!",
      });
      
    } catch (error) {
      console.error('Error generating custom story:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error creating your custom story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImagesForStory = async (story: any) => {
    const chaptersWithImages = await Promise.all(
      story.chapters.map(async (chapter: any, index: number) => {
        try {
          // Create image prompt based on chapter content and custom prompt
          const imagePrompt = `${chapter.content} ${storyData.customPrompt}, children's book illustration, cartoon style, colorful, child-friendly`;
          
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
        
        // Fallback to default image
        return {
          ...chapter,
          imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          isCustomGenerated: false
        };
      })
    );

    return {
      ...story,
      chapters: chaptersWithImages,
      isCustomStory: true
    };
  };

  const resetForm = () => {
    setStoryData({
      title: '',
      theme: 'space',
      customPrompt: '',
      difficulty: 'easy',
      mainCharacter: '',
      setting: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-gaming text-lg hover:from-purple-600 hover:to-pink-600 rounded-xl"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Create Custom Story
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span>Create Your Custom Story</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Story Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Story Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., The Amazing Adventure of Luna"
                  value={storyData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={storyData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={storyData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => handleInputChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Story Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mainCharacter">Main Character (Optional)</Label>
                <Input
                  id="mainCharacter"
                  placeholder="e.g., A brave young explorer named Sam"
                  value={storyData.mainCharacter}
                  onChange={(e) => handleInputChange('mainCharacter', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="setting">Setting (Optional)</Label>
                <Input
                  id="setting"
                  placeholder="e.g., A magical forest with talking animals"
                  value={storyData.setting}
                  onChange={(e) => handleInputChange('setting', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="customPrompt">Your Custom Storyline</Label>
                <Textarea
                  id="customPrompt"
                  placeholder="Describe how you want the story to unfold. For example: 'I want the story to include a friendly dragon who helps the main character solve puzzles, and they discover a hidden treasure in an underwater castle.' Be as creative as you want!"
                  value={storyData.customPrompt}
                  onChange={(e) => handleInputChange('customPrompt', e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  💡 Tip: The more detailed your storyline, the better your custom story will be!
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button
              onClick={generateCustomStory}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Your Story...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Story
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