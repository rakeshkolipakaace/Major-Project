interface ImageGenerationOptions {
  prompt: string;
  style?: 'cartoon' | 'realistic' | 'watercolor';
  aspectRatio?: '1:1' | '16:9' | '4:3';
}

export class ImageGenerator {
  private static baseUrl = 'https://clipdrop-api.co/text-to-image/v1';

  static async generateImage(options: ImageGenerationOptions): Promise<string> {
    const apiKey = import.meta.env.VITE_CLIPDROP_API_KEY || process.env.CLIPDROP_API_KEY;
    
    if (!apiKey) {
      console.warn('Clipdrop API key not found, using placeholder image');
      return this.getPlaceholderImage(options.prompt);
    }

    try {
      const formData = new FormData();
      
      // Create a child-friendly prompt with cartoon style
      const childFriendlyPrompt = `${options.prompt}, cartoon style, colorful, child-friendly, cute, happy, safe for children, animated style, bright colors, no scary elements`;
      
      formData.append('prompt', childFriendlyPrompt);
      formData.append('output_format', 'jpeg');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Image generation failed:', error);
      return this.getPlaceholderImage(options.prompt);
    }
  }

  static getPlaceholderImage(prompt: string): string {
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

  static async preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
    });
  }
}