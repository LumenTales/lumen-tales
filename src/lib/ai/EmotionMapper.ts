import { Scene, Character } from '@/models/Story';

/**
 * Emotion Mapper
 * 
 * Analyzes text sentiment to adjust character expressions and body language.
 * Maps emotional states to visual representations.
 */
export interface EmotionAnalysisResult {
  primaryEmotion: string;
  intensity: number; // 0-1 scale
  secondaryEmotions: string[];
  confidence: number; // 0-1 scale
  contextualFactors: string[];
}

export interface EmotionMappingOptions {
  intensityThreshold: number; // 0-1 scale
  includeSecondaryEmotions: boolean;
  culturalContext: string;
  characterBaseline: Record<string, number>; // Baseline emotional tendencies
}

/**
 * Maps text and context to emotional states
 */
export class EmotionMapper {
  private apiEndpoint: string;
  private emotionCache: Map<string, EmotionAnalysisResult>;
  
  // Basic emotion categories
  private readonly basicEmotions = [
    'joy', 'sadness', 'anger', 'fear', 'surprise', 
    'disgust', 'trust', 'anticipation', 'neutral'
  ];
  
  // Complex emotion mapping
  private readonly complexEmotions: Record<string, string[]> = {
    'joy': ['happiness', 'excitement', 'contentment', 'pride', 'optimism', 'enthusiasm', 'relief'],
    'sadness': ['grief', 'disappointment', 'hopelessness', 'regret', 'melancholy', 'loneliness'],
    'anger': ['frustration', 'irritation', 'rage', 'resentment', 'indignation', 'annoyance'],
    'fear': ['anxiety', 'worry', 'terror', 'dread', 'panic', 'nervousness', 'apprehension'],
    'surprise': ['amazement', 'astonishment', 'wonder', 'shock', 'bewilderment'],
    'disgust': ['revulsion', 'contempt', 'distaste', 'aversion', 'loathing'],
    'trust': ['admiration', 'acceptance', 'love', 'respect', 'devotion', 'conviction'],
    'anticipation': ['interest', 'expectancy', 'hope', 'vigilance', 'curiosity']
  };
  
  constructor(apiEndpoint: string = '/api/ai/analyze-emotion') {
    this.apiEndpoint = apiEndpoint;
    this.emotionCache = new Map();
  }
  
  /**
   * Analyzes text to determine emotional content
   */
  public analyzeTextEmotion(text: string): EmotionAnalysisResult {
    // Check cache first
    const cacheKey = this.getCacheKey(text);
    const cachedResult = this.emotionCache.get(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }
    
    try {
      // In a production environment, this would call an AI API
      // For now, we'll use a simple rule-based approach
      
      // Convert to lowercase for easier matching
      const lowerText = text.toLowerCase();
      
      // Count emotion-related words
      const emotionCounts: Record<string, number> = {};
      
      // Check for basic emotions and their variants
      for (const baseEmotion of this.basicEmotions) {
        emotionCounts[baseEmotion] = 0;
        
        // Count direct mentions of the base emotion
        if (lowerText.includes(baseEmotion)) {
          emotionCounts[baseEmotion] += 1;
        }
        
        // Count related complex emotions
        const complexVariants = this.complexEmotions[baseEmotion] || [];
        for (const variant of complexVariants) {
          if (lowerText.includes(variant)) {
            emotionCounts[baseEmotion] += 0.5; // Give less weight to variants
          }
        }
      }
      
      // Find the primary emotion (highest count)
      let primaryEmotion = 'neutral';
      let maxCount = 0;
      
      for (const [emotion, count] of Object.entries(emotionCounts)) {
        if (count > maxCount) {
          maxCount = count;
          primaryEmotion = emotion;
        }
      }
      
      // If no emotions were detected, default to neutral
      if (maxCount === 0) {
        primaryEmotion = 'neutral';
      }
      
      // Calculate intensity based on word count and emotion density
      const wordCount = text.split(/\s+/).length;
      const intensity = Math.min(1, maxCount / Math.sqrt(wordCount) * 2);
      
      // Find secondary emotions (other emotions with non-zero counts)
      const secondaryEmotions = Object.entries(emotionCounts)
        .filter(([emotion, count]) => count > 0 && emotion !== primaryEmotion)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([emotion]) => emotion);
      
      // Determine contextual factors
      const contextualFactors = this.identifyContextualFactors(text);
      
      // Calculate confidence (higher for longer texts with clear emotion signals)
      const confidence = Math.min(1, 0.5 + (maxCount / 5) + (wordCount / 100));
      
      // Create the result
      const result: EmotionAnalysisResult = {
        primaryEmotion,
        intensity,
        secondaryEmotions,
        confidence,
        contextualFactors
      };
      
      // Cache the result
      this.emotionCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error analyzing text emotion:', error);
      
      // Return a neutral result on error
      return {
        primaryEmotion: 'neutral',
        intensity: 0.5,
        secondaryEmotions: [],
        confidence: 0.5,
        contextualFactors: []
      };
    }
  }
  
  /**
   * Maps character emotions based on scene context
   */
  public mapCharacterEmotion(
    character: Character,
    scene: Scene,
    dialogueText?: string
  ): EmotionAnalysisResult {
    try {
      // If dialogue is provided, analyze it directly
      if (dialogueText) {
        return this.analyzeTextEmotion(dialogueText);
      }
      
      // Otherwise, analyze the scene content
      // In a real implementation, this would use more sophisticated NLP
      // to extract character-specific emotions from the scene
      
      // For now, we'll use a simple approach
      const sceneEmotion = this.analyzeTextEmotion(scene.content);
      
      // Adjust based on character traits if available
      if (character.traits && character.traits.length > 0) {
        // Modify the emotion based on character traits
        return this.adjustEmotionByTraits(sceneEmotion, character.traits);
      }
      
      return sceneEmotion;
    } catch (error) {
      console.error('Error mapping character emotion:', error);
      
      // Return a neutral result on error
      return {
        primaryEmotion: 'neutral',
        intensity: 0.5,
        secondaryEmotions: [],
        confidence: 0.5,
        contextualFactors: []
      };
    }
  }
  
  /**
   * Identifies contextual factors that influence emotions
   */
  private identifyContextualFactors(text: string): string[] {
    const factors: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Check for various contextual factors
    if (lowerText.includes('alone') || lowerText.includes('lonely')) {
      factors.push('isolation');
    }
    
    if (lowerText.includes('together') || lowerText.includes('friend') || lowerText.includes('family')) {
      factors.push('social connection');
    }
    
    if (lowerText.includes('danger') || lowerText.includes('threat') || lowerText.includes('scared')) {
      factors.push('perceived threat');
    }
    
    if (lowerText.includes('success') || lowerText.includes('achieve') || lowerText.includes('accomplish')) {
      factors.push('achievement');
    }
    
    if (lowerText.includes('fail') || lowerText.includes('loss') || lowerText.includes('lost')) {
      factors.push('failure or loss');
    }
    
    if (lowerText.includes('hope') || lowerText.includes('future') || lowerText.includes('plan')) {
      factors.push('future prospects');
    }
    
    if (lowerText.includes('past') || lowerText.includes('memory') || lowerText.includes('remember')) {
      factors.push('past experiences');
    }
    
    return factors;
  }
  
  /**
   * Adjusts emotions based on character traits
   */
  private adjustEmotionByTraits(
    baseEmotion: EmotionAnalysisResult,
    traits: string[]
  ): EmotionAnalysisResult {
    const result = { ...baseEmotion };
    
    // Adjust intensity based on traits
    if (traits.includes('sensitive') || traits.includes('emotional')) {
      result.intensity = Math.min(1, result.intensity * 1.3);
    }
    
    if (traits.includes('stoic') || traits.includes('reserved')) {
      result.intensity = Math.max(0, result.intensity * 0.7);
    }
    
    // Adjust primary emotion based on personality traits
    if (traits.includes('optimistic') && result.primaryEmotion === 'sadness') {
      // Optimistic characters tend to find hope even in sad situations
      if (result.intensity < 0.7) {
        result.secondaryEmotions.unshift(result.primaryEmotion);
        result.primaryEmotion = 'hope';
      }
    }
    
    if (traits.includes('pessimistic') && result.primaryEmotion === 'joy') {
      // Pessimistic characters may be more cautious in happy situations
      if (result.intensity < 0.7) {
        result.secondaryEmotions.unshift('worry');
      }
    }
    
    // Add trait-based contextual factors
    const traitFactors = traits.map(trait => `character trait: ${trait}`);
    result.contextualFactors = [...result.contextualFactors, ...traitFactors];
    
    return result;
  }
  
  /**
   * Generates a cache key for text
   */
  private getCacheKey(text: string): string {
    // Simple hash function for text
    return `emotion_${this.hashString(text)}`;
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
   * Clears the emotion cache
   */
  public clearCache(): void {
    this.emotionCache.clear();
  }
} 