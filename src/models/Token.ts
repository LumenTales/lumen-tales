export interface TokenBalance {
  userId: string;
  tokenType: 'LUMEN' | 'STORY' | 'CHARACTER';
  tokenId?: string; // Only for STORY and CHARACTER tokens
  balance: number;
  lastUpdated: Date;
}

export interface TokenTransaction {
  id: string;
  fromUserId: string | null; // null for minting
  toUserId: string | null; // null for burning
  tokenType: 'LUMEN' | 'STORY' | 'CHARACTER';
  tokenId?: string; // Only for STORY and CHARACTER tokens
  amount: number;
  transactionType: 'MINT' | 'BURN' | 'TRANSFER' | 'REWARD' | 'PURCHASE' | 'STAKE' | 'UNSTAKE';
  relatedEntityType?: 'STORY' | 'CHARACTER' | 'CHOICE' | 'MARKETPLACE';
  relatedEntityId?: string;
  timestamp: Date;
  blockchainTxHash?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  metadata?: Record<string, any>;
}

export interface TokenPrice {
  tokenType: 'LUMEN' | 'STORY' | 'CHARACTER';
  tokenId?: string; // Only for STORY and CHARACTER tokens
  priceInUSD: number;
  priceHistory: {
    timestamp: Date;
    priceInUSD: number;
  }[];
  lastUpdated: Date;
}

export interface StakingPosition {
  id: string;
  userId: string;
  tokenType: 'LUMEN' | 'STORY';
  tokenId?: string; // Only for STORY tokens
  amount: number;
  startTime: Date;
  endTime?: Date; // If undefined, still staking
  rewardRate: number; // Tokens earned per day
  totalRewardsEarned: number;
  lastClaimTime?: Date;
  status: 'ACTIVE' | 'ENDED';
}

export interface TokenomicsConfig {
  lumenTotalSupply: number;
  lumenCirculatingSupply: number;
  storyTokenMintingRules: {
    basePrice: number;
    qualityMultiplier: number;
    popularityMultiplier: number;
    maxSupply: number;
  };
  characterNFTMintingRules: {
    basePrice: number;
    rarityMultipliers: Record<string, number>;
    maxSupplyPerCharacter: number;
  };
  stakingRewardRates: {
    lumen: number; // Base APY for LUMEN tokens
    story: number; // Base APY for story tokens
  };
  transactionFees: {
    marketplace: number; // Percentage
    creatorRoyalty: number; // Percentage
    platformFee: number; // Percentage
  };
} 