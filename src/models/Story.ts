export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  traits: Record<string, string | number>;
  emotions: Record<string, string>; // emotion name -> image URL
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requiredTokens?: number;
  consequences?: {
    characterChanges?: Record<string, Partial<Character>>;
    variableChanges?: Record<string, any>;
  };
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
  characters: string[]; // Character IDs present in this scene
  choices: Choice[];
  variables?: Record<string, any>;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  genre: string;
  tags: string[];
  tokenValue: number;
  totalReads: number;
  rating: number;
  publishedAt: Date;
  updatedAt: Date;
  characters: Record<string, Character>;
  scenes: Record<string, Scene>;
  startingSceneId: string;
  variables: Record<string, any>;
}

export interface StoryProgress {
  userId: string;
  storyId: string;
  currentSceneId: string;
  visitedScenes: string[];
  characterStates: Record<string, Partial<Character>>;
  variables: Record<string, any>;
  choiceHistory: {
    sceneId: string;
    choiceId: string;
    timestamp: Date;
  }[];
  tokensSpent: number;
  completedEndings: string[];
  lastReadAt: Date;
}

export interface StoryToken {
  id: string;
  storyId: string;
  tokenId: string;
  owner: string;
  mintedAt: Date;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  metadata: {
    image: string;
    attributes: Record<string, any>;
  };
}

export interface CharacterNFT {
  id: string;
  characterId: string;
  storyId: string;
  tokenId: string;
  owner: string;
  mintedAt: Date;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  metadata: {
    image: string;
    attributes: Record<string, any>;
  };
  customizations?: Record<string, any>;
} 