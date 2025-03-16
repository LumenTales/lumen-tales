export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  walletAddress?: string;
  createdAt: Date;
  lastLoginAt: Date;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  isEmailVerified: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    github?: string;
  };
}

export interface UserPreferences {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  emailNotifications: {
    newStories: boolean;
    storyUpdates: boolean;
    tokenActivity: boolean;
    marketplaceActivity: boolean;
    newsletter: boolean;
  };
  contentPreferences: {
    preferredGenres: string[];
    contentFilters: string[];
    readingSpeed: 'SLOW' | 'MEDIUM' | 'FAST';
    showImagesFirst: boolean;
  };
  privacySettings: {
    showReadingActivity: boolean;
    showTokenHoldings: boolean;
    showProfileToPublic: boolean;
  };
}

export interface UserStats {
  totalStoriesRead: number;
  totalChoicesMade: number;
  totalTimeSpent: number; // in minutes
  favoriteGenres: Array<{
    genre: string;
    count: number;
  }>;
  tokensEarned: number;
  tokensSpent: number;
  creatorStats?: {
    publishedStories: number;
    totalReads: number;
    averageRating: number;
    totalEarnings: number;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 
    | 'STORY_STARTED' 
    | 'STORY_COMPLETED' 
    | 'CHOICE_MADE' 
    | 'TOKEN_EARNED' 
    | 'TOKEN_SPENT'
    | 'NFT_ACQUIRED'
    | 'STORY_PUBLISHED'
    | 'STORY_RATED';
  timestamp: Date;
  metadata: {
    storyId?: string;
    sceneId?: string;
    choiceId?: string;
    tokenAmount?: number;
    tokenType?: string;
    rating?: number;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number; // 0-100 percentage
  metadata?: Record<string, any>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  category: 'READING' | 'CREATION' | 'COLLECTION' | 'COMMUNITY';
  requirements: {
    type: 'COUNT' | 'SPECIFIC' | 'DURATION';
    target: number;
    entityType?: 'STORY' | 'CHOICE' | 'TOKEN';
    specificIds?: string[];
  };
  rewards?: {
    tokens?: number;
    badges?: string[];
  };
} 