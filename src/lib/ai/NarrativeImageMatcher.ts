import { Character, Scene } from '@/models/Story';
import { CharacterConsistencyEngine } from './CharacterConsistencyEngine';

/**
 * Narrative-Image Matching System
 * 
 * Converts text descriptions to visual representations.
 * Ensures that generated images match the narrative context and maintain character consistency.
 */
export interface SceneImageOptions {
  detailLevel: number; // 0-1 scale
  styleConsistency: number; // 0-1 scale
  lightingMood: 'bright' | 'neutral' | 'dark' | 'dramatic';
  includeCharacters: boolean;
  backgroundFocus: number; // 0-1 scale
}

export interface GeneratedSceneImage {
  imageUrl: string;
  scene: Scene;
  characters: string[]; // Character IDs included in the scene
  timestamp: number;
  prompt: string;
}

/**
 * Matches narrative text with appropriate imagery
 */
export class NarrativeImageMatcher {
  private apiEndpoint: string;
  private characterEngine: CharacterConsistencyEngine;
  private sceneCache: Map<string, GeneratedSceneImage>;
  
  constructor(
    characterEngine: CharacterConsistencyEngine,
    apiEndpoint: string = '/api/ai/generate-scene'
  ) {
    this.characterEngine = characterEngine;
    this.apiEndpoint = apiEndpoint;
    this.sceneCache = new Map();
  }
  
  /**
   * Generates an image for a scene with characters
   */
  public async generateSceneImage(
    scene: Scene,
    characters: Record<string, Character>
  ): Promise<GeneratedSceneImage> {
    // Generate a cache key based on scene ID and content hash
    const cacheKey = this.getCacheKey(scene);
    
    // Check if we have a cached image
    const cachedImage = this.sceneCache.get(cacheKey);
    if (cachedImage) {
      return cachedImage;
    }
    
    try {
      // Optimize the scene description for better image generation
      const optimizedDescription = this.optimizeSceneDescription(scene);
      
      // Extract character descriptions for the prompt
      const characterDescriptions = Object.values(characters).map(character => {
        return `${character.name}: ${this.getCharacterSummary(character)}`;
      }).join('; ');
      
      // Create the full prompt
      const prompt = `Scene: ${optimizedDescription}\n\nCharacters: ${characterDescriptions}\n\nCreate a detailed, high-quality digital illustration of this scene.`;
      
      // Call the API to generate the image
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scene,
          characters: Object.values(characters),
          prompt
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate scene image: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Create the scene image object
      const sceneImage: GeneratedSceneImage = {
        imageUrl: result.imageUrl,
        scene,
        characters: Object.keys(characters),
        timestamp: Date.now(),
        prompt
      };
      
      // Cache the result
      this.sceneCache.set(cacheKey, sceneImage);
      
      return sceneImage;
    } catch (error) {
      console.error('Error generating scene image:', error);
      throw error;
    }
  }
  
  /**
   * Optimizes a scene description for better image generation
   */
  public optimizeSceneDescription(scene: Scene): string {
    // Extract the most visually descriptive elements from the scene
    const { content, setting, time, mood } = scene;
    
    // Start with the setting if available
    let optimizedDescription = '';
    
    if (setting) {
      optimizedDescription += `${setting}, `;
    }
    
    if (time) {
      optimizedDescription += `${time}, `;
    }
    
    if (mood) {
      optimizedDescription += `${mood} atmosphere, `;
    }
    
    // Add the main content, focusing on visual elements
    // Extract visual elements from the content
    const visualElements = this.extractVisualElements(content);
    
    // Combine everything
    optimizedDescription += visualElements;
    
    return optimizedDescription.trim();
  }
  
  /**
   * Extracts visual elements from text
   */
  private extractVisualElements(text: string): string {
    // In a real implementation, this would use NLP to extract visual descriptions
    // For now, we'll use a simple approach
    
    // Remove dialogue (text in quotes)
    let processed = text.replace(/"[^"]*"/g, '');
    
    // Remove thought processes and non-visual elements
    const nonVisualPhrases = [
      'thought', 'wondered', 'remembered', 'felt like', 'decided',
      'considered', 'planned', 'knew', 'understood', 'realized'
    ];
    
    nonVisualPhrases.forEach(phrase => {
      const regex = new RegExp(`[^.]*${phrase}[^.]*\\.`, 'gi');
      processed = processed.replace(regex, '');
    });
    
    // Prioritize sentences with visual descriptors
    const visualDescriptors = [
      'looked', 'appeared', 'seemed', 'wore', 'dressed',
      'decorated', 'colored', 'shaped', 'designed', 'built',
      'tall', 'short', 'large', 'small', 'bright', 'dark',
      'red', 'blue', 'green', 'yellow', 'black', 'white',
      'glowing', 'shining', 'gleaming', 'sparkling'
    ];
    
    const sentences = processed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Score sentences based on visual content
    const scoredSentences = sentences.map(sentence => {
      let score = 0;
      visualDescriptors.forEach(descriptor => {
        if (sentence.toLowerCase().includes(descriptor)) {
          score += 1;
        }
      });
      return { sentence, score };
    });
    
    // Sort by score and take top 3
    scoredSentences.sort((a, b) => b.score - a.score);
    const topSentences = scoredSentences.slice(0, 3).map(s => s.sentence.trim());
    
    return topSentences.join('. ') + '.';
  }
  
  /**
   * Gets a brief summary of a character for image prompts
   */
  private getCharacterSummary(character: Character): string {
    // Extract key visual attributes
    const { name, description } = character;
    
    // In a real implementation, you would extract the most visually relevant
    // details from the character description
    
    // For now, return a simplified description
    return description || `A character named ${name}`;
  }
  
  /**
   * Generates a cache key for a scene
   */
  private getCacheKey(scene: Scene): string {
    // In a real implementation, you might want to hash the content
    // to detect changes even if the ID is the same
    return `scene_${scene.id}_${this.hashString(scene.content)}`;
  }
  
  /**
   * Simple string hashing function
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
  
  /**
   * Clears the scene cache
   */
  public clearCache(): void {
    this.sceneCache.clear();
  }
} 