import { NextApiRequest, NextApiResponse } from 'next';
import { EmotionAnalysisResult } from '@/lib/ai/EmotionMapper';

// Basic emotion categories
const BASIC_EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise', 
  'disgust', 'trust', 'anticipation', 'neutral'
];

// Complex emotion mapping
const COMPLEX_EMOTIONS: Record<string, string[]> = {
  'joy': ['happiness', 'excitement', 'contentment', 'pride', 'optimism', 'enthusiasm', 'relief'],
  'sadness': ['grief', 'disappointment', 'hopelessness', 'regret', 'melancholy', 'loneliness'],
  'anger': ['frustration', 'irritation', 'rage', 'resentment', 'indignation', 'annoyance'],
  'fear': ['anxiety', 'worry', 'terror', 'dread', 'panic', 'nervousness', 'apprehension'],
  'surprise': ['amazement', 'astonishment', 'wonder', 'shock', 'bewilderment'],
  'disgust': ['revulsion', 'contempt', 'distaste', 'aversion', 'loathing'],
  'trust': ['admiration', 'acceptance', 'love', 'respect', 'devotion', 'conviction'],
  'anticipation': ['interest', 'expectancy', 'hope', 'vigilance', 'curiosity']
};

interface AnalyzeEmotionRequest {
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body as AnalyzeEmotionRequest;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Log the request for debugging
    console.log('Emotion analysis request:', {
      textLength: text.length,
      textPreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
    });

    // In a real implementation, this would call an AI emotion analysis service
    // For now, we'll use a simple rule-based approach

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analyze the text
    const result = analyzeTextEmotion(text);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return res.status(500).json({ error: 'Failed to analyze emotion' });
  }
}

/**
 * Simple rule-based emotion analysis
 */
function analyzeTextEmotion(text: string): EmotionAnalysisResult {
  // Convert to lowercase for easier matching
  const lowerText = text.toLowerCase();
  
  // Count emotion-related words
  const emotionCounts: Record<string, number> = {};
  
  // Check for basic emotions and their variants
  for (const baseEmotion of BASIC_EMOTIONS) {
    emotionCounts[baseEmotion] = 0;
    
    // Count direct mentions of the base emotion
    if (lowerText.includes(baseEmotion)) {
      emotionCounts[baseEmotion] += 1;
    }
    
    // Count related complex emotions
    const complexVariants = COMPLEX_EMOTIONS[baseEmotion] || [];
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
  const contextualFactors = identifyContextualFactors(text);
  
  // Calculate confidence (higher for longer texts with clear emotion signals)
  const confidence = Math.min(1, 0.5 + (maxCount / 5) + (wordCount / 100));
  
  return {
    primaryEmotion,
    intensity,
    secondaryEmotions,
    confidence,
    contextualFactors
  };
}

/**
 * Identifies contextual factors that influence emotions
 */
function identifyContextualFactors(text: string): string[] {
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