/**
 * Character model representing a story character
 */
export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  traits: string[];
  attributes: {
    age?: string;
    gender?: string;
    hairColor?: string;
    eyeColor?: string;
    skinTone?: string;
    height?: string;
    build?: string;
    [key: string]: string | undefined;
  };
  backstory?: string;
  relationships?: Record<string, CharacterRelationship>;
  createdAt: number;
  updatedAt: number;
  creatorId: string;
  tokenId?: string; // NFT token ID if minted
}

/**
 * Relationship between characters
 */
export interface CharacterRelationship {
  type: string; // friend, enemy, family, etc.
  description: string;
  strength: number; // 0-10 scale
}

/**
 * Scene model representing a story scene
 */
export interface Scene {
  id: string;
  title: string;
  content: string;
  setting: string;
  time: string;
  mood: string;
  characters: string[]; // Character IDs
  imageUrl?: string;
  parentId?: string; // For branching narratives
  childrenIds: string[]; // For branching narratives
  createdAt: number;
  updatedAt: number;
  creatorId: string;
  tokenId?: string; // NFT token ID if minted
  metadata: SceneMetadata;
}

/**
 * Metadata for a scene
 */
export interface SceneMetadata {
  tags: string[];
  complexity: number; // 0-10 scale
  emotionalTone: string;
  visualElements: string[];
  audioElements?: string[];
  interactiveElements?: InteractiveElement[];
}

/**
 * Interactive element in a scene
 */
export interface InteractiveElement {
  id: string;
  type: 'choice' | 'item' | 'puzzle' | 'character';
  description: string;
  targetSceneId?: string;
  requirements?: {
    items?: string[];
    characterTraits?: string[];
    previousScenes?: string[];
  };
}

/**
 * Story model representing a complete story
 */
export interface Story {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  genre: string[];
  characters: Record<string, Character>;
  scenes: Record<string, Scene>;
  rootSceneId: string;
  createdAt: number;
  updatedAt: number;
  creatorId: string;
  collaboratorIds: string[];
  published: boolean;
  publishedAt?: number;
  tokenId?: string; // NFT token ID if minted
  metadata: StoryMetadata;
}

/**
 * Metadata for a story
 */
export interface StoryMetadata {
  tags: string[];
  ageRating: 'everyone' | 'teen' | 'mature';
  language: string;
  wordCount: number;
  readTime: number; // in minutes
  complexity: number; // 0-10 scale
  branchCount: number;
  endingCount: number;
  averageRating?: number;
  ratingCount?: number;
  viewCount?: number;
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