import { NextApiRequest, NextApiResponse } from 'next';
import { Character } from '@/models/Story';

// Mock image URLs for development
const MOCK_CHARACTER_IMAGES: Record<string, string[]> = {
  neutral: [
    '/images/characters/neutral-1.jpg',
    '/images/characters/neutral-2.jpg',
    '/images/characters/neutral-3.jpg',
  ],
  happy: [
    '/images/characters/happy-1.jpg',
    '/images/characters/happy-2.jpg',
    '/images/characters/happy-3.jpg',
  ],
  sad: [
    '/images/characters/sad-1.jpg',
    '/images/characters/sad-2.jpg',
    '/images/characters/sad-3.jpg',
  ],
  angry: [
    '/images/characters/angry-1.jpg',
    '/images/characters/angry-2.jpg',
    '/images/characters/angry-3.jpg',
  ],
  surprised: [
    '/images/characters/surprised-1.jpg',
    '/images/characters/surprised-2.jpg',
    '/images/characters/surprised-3.jpg',
  ],
  afraid: [
    '/images/characters/afraid-1.jpg',
    '/images/characters/afraid-2.jpg',
    '/images/characters/afraid-3.jpg',
  ],
};

interface GenerateCharacterRequest {
  character: Character;
  emotion: string;
  outfit: string;
  scene: string;
  prompt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { character, emotion, outfit, scene, prompt } = req.body as GenerateCharacterRequest;

    // Log the request for debugging
    console.log('Character image generation request:', {
      characterId: character.id,
      characterName: character.name,
      emotion,
      outfit,
      scene,
    });

    // In a real implementation, this would call an AI image generation service
    // For now, we'll return a mock image URL

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get a random mock image for the emotion
    const emotionImages = MOCK_CHARACTER_IMAGES[emotion] || MOCK_CHARACTER_IMAGES.neutral;
    const randomIndex = Math.floor(Math.random() * emotionImages.length);
    const imageUrl = emotionImages[randomIndex];

    return res.status(200).json({
      imageUrl,
      prompt,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating character image:', error);
    return res.status(500).json({ error: 'Failed to generate character image' });
  }
} 