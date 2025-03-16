import { Character } from '@/models/Story';

/**
 * Character Consistency Engine
 * 
 * Maintains core recognition features across scenes, emotions, and outfit changes.
 * Uses AI to ensure characters remain visually consistent throughout the narrative.
 */
export interface CharacterConsistencyOptions {
  preserveFacialFeatures: boolean;
  preserveBodyType: boolean;
  preserveDistinctiveMarks: boolean;
  emotionIntensity: number; // 0-1 scale
  outfitConsistencyLevel: number; // 0-1 scale
}

export interface GeneratedCharacterImage {
  imageUrl: string;
  character: Character;
  emotion: string;
  outfit: string;
  scene: string;
  timestamp: number;
}

export interface CharacterImageGenerationParams {
  character: Character;
  emotion: string;
  outfit?: string;
  scene?: string;
}

/**
 * Engine for maintaining character consistency across generated images
 */
export class CharacterConsistencyEngine {
  private characterCache: Map<string, GeneratedCharacterImage[]>;
  private apiEndpoint: string;
  private options: CharacterConsistencyOptions;
  
  constructor(apiEndpoint: string = '/api/ai/generate-character') {
    this.characterCache = new Map();
    this.apiEndpoint = apiEndpoint;
    this.options = {
      preserveFacialFeatures: true,
      emotionIntensity: 0.8,
      preserveBodyType: true,
      preserveDistinctiveMarks: true,
      outfitConsistencyLevel: 0.8
    };
  }
  
  /**
   * Generates a character image with a specific emotion
   */
  public async generateCharacterImage(
    character: Character,
    emotion: string,
    outfit: string = 'default',
    scene: string = 'default'
  ): Promise<GeneratedCharacterImage> {
    // Check cache first
    const cacheKey = this.getCacheKey(character.id);
    const cachedImages = this.characterCache.get(cacheKey) || [];
    
    // Look for a matching cached image
    const cachedImage = cachedImages.find(
      img => 
        img.emotion === emotion && 
        img.outfit === outfit && 
        img.scene === scene
    );
    
    if (cachedImage) {
      return cachedImage;
    }
    
    // Generate a new image
    try {
      const promptText = this.generatePrompt(character, emotion, outfit, scene);
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          emotion,
          outfit,
          scene,
          prompt: promptText
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate character image: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      const generatedImage: GeneratedCharacterImage = {
        imageUrl: result.imageUrl,
        character,
        emotion,
        outfit,
        scene,
        timestamp: Date.now()
      };
      
      // Cache the result
      this.cacheCharacterImage(character.id, generatedImage);
      
      return generatedImage;
    } catch (error) {
      console.error('Error generating character image:', error);
      throw error;
    }
  }
  
  /**
   * Generates a prompt for the AI image generation
   */
  private generatePrompt(
    character: Character,
    emotion: string,
    outfit: string,
    scene: string
  ): string {
    const { name, description, attributes } = character;
    
    // Extract key attributes
    const age = attributes?.age || 'adult';
    const gender = attributes?.gender || 'unspecified';
    const hairColor = attributes?.hairColor || '';
    const eyeColor = attributes?.eyeColor || '';
    const skinTone = attributes?.skinTone || '';
    const height = attributes?.height || '';
    const build = attributes?.build || '';
    
    // Build the prompt
    let prompt = `A ${emotion} ${age} ${gender} character named ${name}`;
    
    // Add physical attributes
    if (hairColor) prompt += ` with ${hairColor} hair`;
    if (eyeColor) prompt += `, ${eyeColor} eyes`;
    if (skinTone) prompt += `, ${skinTone} skin`;
    if (height || build) {
      prompt += `, ${height} ${build} build`;
    }
    
    // Add outfit if not default
    if (outfit && outfit !== 'default') {
      prompt += `, wearing ${outfit}`;
    }
    
    // Add scene context if not default
    if (scene && scene !== 'default') {
      prompt += `, in a ${scene} setting`;
    }
    
    // Add character description
    if (description) {
      prompt += `. ${description}`;
    }
    
    // Add style guidance
    prompt += `. High quality, detailed, digital art style.`;
    
    return prompt;
  }
  
  /**
   * Caches a generated character image
   */
  private cacheCharacterImage(characterId: string, image: GeneratedCharacterImage): void {
    const cacheKey = this.getCacheKey(characterId);
    const cachedImages = this.characterCache.get(cacheKey) || [];
    
    // Add new image to cache
    cachedImages.push(image);
    
    // Limit cache size to 10 images per character
    if (cachedImages.length > 10) {
      // Sort by timestamp and remove oldest
      cachedImages.sort((a, b) => b.timestamp - a.timestamp);
      cachedImages.pop();
    }
    
    this.characterCache.set(cacheKey, cachedImages);
  }
  
  /**
   * Gets cached images for a character
   */
  public getCachedImages(characterId: string): GeneratedCharacterImage[] {
    const cacheKey = this.getCacheKey(characterId);
    return this.characterCache.get(cacheKey) || [];
  }
  
  /**
   * Clears the cache for a specific character
   */
  public clearCharacterCache(characterId: string): void {
    const cacheKey = this.getCacheKey(characterId);
    this.characterCache.delete(cacheKey);
  }
  
  /**
   * Clears the entire cache
   */
  public clearAllCache(): void {
    this.characterCache.clear();
  }
  
  /**
   * Generates a cache key for a character
   */
  private getCacheKey(characterId: string): string {
    return `character_${characterId}`;
  }
  
  /**
   * Verifies if a generated image maintains character consistency
   */
  async verifyConsistency(
    character: Character,
    generatedImage: GeneratedCharacterImage
  ): Promise<number> {
    // In a real implementation, this would use computer vision to compare
    // the generated image with the character's base image
    
    // Mock implementation - returns a consistency score between 0-1
    return 0.92;
  }
  
  /**
   * Adjusts character parameters to improve consistency in future generations
   */
  async optimizeCharacterModel(
    character: Character,
    consistencyScores: number[]
  ): Promise<Partial<Character>> {
    // In a real implementation, this would analyze consistency scores
    // and suggest adjustments to the character model
    
    // Mock implementation - add a trait if not already present
    const updatedTraits = [...character.traits];
    if (!updatedTraits.includes('distinctive')) {
      updatedTraits.push('distinctive');
    }
    
    return {
      traits: updatedTraits
    };
  }
} 