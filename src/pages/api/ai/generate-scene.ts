import { NextApiRequest, NextApiResponse } from 'next';
import { Character, Scene } from '@/models/Story';

// Mock image URLs for development
const MOCK_SCENE_IMAGES: string[] = [
  '/images/scenes/forest-1.jpg',
  '/images/scenes/castle-1.jpg',
  '/images/scenes/city-1.jpg',
  '/images/scenes/mountain-1.jpg',
  '/images/scenes/beach-1.jpg',
  '/images/scenes/dungeon-1.jpg',
  '/images/scenes/tavern-1.jpg',
  '/images/scenes/battlefield-1.jpg',
  '/images/scenes/library-1.jpg',
  '/images/scenes/temple-1.jpg',
];

interface GenerateSceneRequest {
  scene: Scene;
  characters: Character[];
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
    const { scene, characters, prompt } = req.body as GenerateSceneRequest;

    // Log the request for debugging
    console.log('Scene image generation request:', {
      sceneId: scene.id,
      sceneTitle: scene.title,
      characterCount: characters.length,
      characterNames: characters.map(c => c.name),
    });

    // In a real implementation, this would call an AI image generation service
    // For now, we'll return a mock image URL

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get a random mock image
    const randomIndex = Math.floor(Math.random() * MOCK_SCENE_IMAGES.length);
    const imageUrl = MOCK_SCENE_IMAGES[randomIndex];

    return res.status(200).json({
      imageUrl,
      prompt,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating scene image:', error);
    return res.status(500).json({ error: 'Failed to generate scene image' });
  }
} 