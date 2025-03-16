import { TokenomicsConfig } from '@/models/Token';
import { Story } from '@/models/Story';
import { User } from '@/models/User';

/**
 * Tokenomics Engine
 * 
 * Manages the token economy, including token minting, value calculations,
 * rewards, and economic balancing.
 */
export interface TokenMintingParams {
  baseValue: number;
  scarcityFactor: number;
  qualityScore: number;
  creatorReputation: number;
  demandMultiplier: number;
}

export interface RewardCalculationParams {
  actionType: 'READ' | 'COMPLETE' | 'RATE' | 'SHARE' | 'CREATE' | 'CURATE';
  userLevel: number;
  contentQuality: number;
  timeSpent: number;
  isFirstTime: boolean;
}

export class TokenomicsEngine {
  private config: TokenomicsConfig;
  
  constructor(config: TokenomicsConfig) {
    this.config = config;
  }
  
  /**
   * Calculates the appropriate token value for a story
   */
  calculateStoryTokenValue(story: Story, creator: User): number {
    // Base value calculation
    let value = this.config.storyTokenMintingRules.basePrice;
    
    // Apply quality multiplier (based on story length, complexity, etc.)
    const qualityScore = this.calculateQualityScore(story);
    value *= (1 + (qualityScore * this.config.storyTokenMintingRules.qualityMultiplier));
    
    // Apply popularity multiplier (if the story has reads)
    if (story.totalReads > 0) {
      const popularityFactor = Math.min(1, Math.log10(story.totalReads) / 3);
      value *= (1 + (popularityFactor * this.config.storyTokenMintingRules.popularityMultiplier));
    }
    
    // Apply creator reputation factor
    if (creator.stats.creatorStats) {
      const reputationFactor = Math.min(1, creator.stats.creatorStats.averageRating / 5);
      value *= (1 + (reputationFactor * 0.2));
    }
    
    // Round to 2 decimal places
    return Math.round(value * 100) / 100;
  }
  
  /**
   * Calculates a quality score for a story based on various factors
   */
  private calculateQualityScore(story: Story): number {
    // In a real implementation, this would analyze various aspects of the story
    // such as length, complexity, branch diversity, etc.
    
    // Mock implementation
    const sceneCount = Object.keys(story.scenes).length;
    const characterCount = Object.keys(story.characters).length;
    
    // Calculate branch diversity (how many different paths)
    let totalChoices = 0;
    let uniqueNextScenes = new Set<string>();
    
    Object.values(story.scenes).forEach(scene => {
      totalChoices += scene.choices.length;
      scene.choices.forEach(choice => {
        uniqueNextScenes.add(choice.nextSceneId);
      });
    });
    
    const branchDiversity = uniqueNextScenes.size / Math.max(1, totalChoices);
    
    // Calculate final score (0-1 scale)
    const lengthScore = Math.min(1, sceneCount / 20); // Cap at 20 scenes
    const characterScore = Math.min(1, characterCount / 5); // Cap at 5 characters
    const diversityScore = branchDiversity;
    
    return (lengthScore * 0.4) + (characterScore * 0.3) + (diversityScore * 0.3);
  }
  
  /**
   * Calculates the appropriate token value for a character NFT
   */
  calculateCharacterNFTValue(
    characterId: string,
    story: Story,
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  ): number {
    const character = story.characters[characterId];
    if (!character) {
      return 0;
    }
    
    // Base value calculation
    let value = this.config.characterNFTMintingRules.basePrice;
    
    // Apply rarity multiplier
    const rarityMultiplier = this.config.characterNFTMintingRules.rarityMultipliers[rarity] || 1;
    value *= rarityMultiplier;
    
    // Apply character complexity factor (based on traits, emotions, etc.)
    const traitCount = Object.keys(character.traits).length;
    const emotionCount = Object.keys(character.emotions).length;
    
    const complexityFactor = Math.min(1, ((traitCount / 5) + (emotionCount / 5)) / 2);
    value *= (1 + (complexityFactor * 0.3));
    
    // Apply story popularity factor
    if (story.totalReads > 0) {
      const popularityFactor = Math.min(1, Math.log10(story.totalReads) / 3);
      value *= (1 + (popularityFactor * 0.2));
    }
    
    // Round to 2 decimal places
    return Math.round(value * 100) / 100;
  }
  
  /**
   * Calculates rewards for user actions
   */
  calculateReward(params: RewardCalculationParams): number {
    const { actionType, userLevel, contentQuality, timeSpent, isFirstTime } = params;
    
    // Base reward by action type
    let baseReward = 0;
    switch (actionType) {
      case 'READ':
        baseReward = 0.1;
        break;
      case 'COMPLETE':
        baseReward = 1;
        break;
      case 'RATE':
        baseReward = 0.5;
        break;
      case 'SHARE':
        baseReward = 2;
        break;
      case 'CREATE':
        baseReward = 5;
        break;
      case 'CURATE':
        baseReward = 0.8;
        break;
    }
    
    // Apply multipliers
    let reward = baseReward;
    
    // User level multiplier (higher level users get slightly more)
    reward *= (1 + (userLevel * 0.05));
    
    // Content quality multiplier
    reward *= (1 + (contentQuality * 0.5));
    
    // Time spent multiplier (for read actions)
    if (actionType === 'READ' && timeSpent > 0) {
      // Cap at 30 minutes
      const timeMultiplier = Math.min(1, timeSpent / 30);
      reward *= (1 + timeMultiplier);
    }
    
    // First-time bonus
    if (isFirstTime) {
      reward *= 1.5;
    }
    
    // Round to 2 decimal places
    return Math.round(reward * 100) / 100;
  }
  
  /**
   * Calculates staking rewards based on amount and duration
   */
  calculateStakingReward(
    tokenType: 'LUMEN' | 'STORY',
    amount: number,
    durationDays: number
  ): number {
    // Get base APY rate
    const baseRate = tokenType === 'LUMEN' 
      ? this.config.stakingRewardRates.lumen 
      : this.config.stakingRewardRates.story;
    
    // Calculate daily rate
    const dailyRate = baseRate / 365;
    
    // Calculate reward
    const reward = amount * dailyRate * durationDays;
    
    // Apply duration bonus (longer staking gets better rates)
    let durationBonus = 1;
    if (durationDays >= 30) durationBonus = 1.1;
    if (durationDays >= 90) durationBonus = 1.25;
    if (durationDays >= 180) durationBonus = 1.5;
    if (durationDays >= 365) durationBonus = 2;
    
    return reward * durationBonus;
  }
  
  /**
   * Calculates marketplace fees for a transaction
   */
  calculateMarketplaceFees(price: number): {
    sellerReceives: number;
    creatorRoyalty: number;
    platformFee: number;
  } {
    const creatorRoyalty = price * this.config.transactionFees.creatorRoyalty;
    const platformFee = price * this.config.transactionFees.platformFee;
    const sellerReceives = price - creatorRoyalty - platformFee;
    
    return {
      sellerReceives,
      creatorRoyalty,
      platformFee
    };
  }
  
  /**
   * Updates tokenomics configuration based on market conditions
   */
  updateTokenomicsConfig(
    marketMetrics: {
      averageStoryPrice: number;
      totalActiveUsers: number;
      dailyTransactionVolume: number;
      tokenVelocity: number;
    }
  ): TokenomicsConfig {
    // In a real implementation, this would adjust tokenomics parameters
    // based on market conditions to maintain economic balance
    
    // Mock implementation
    const newConfig = { ...this.config };
    
    // Adjust minting rules based on market conditions
    if (marketMetrics.averageStoryPrice > 100) {
      // If prices are too high, increase supply
      newConfig.storyTokenMintingRules.basePrice *= 0.95;
    } else if (marketMetrics.averageStoryPrice < 10) {
      // If prices are too low, decrease supply
      newConfig.storyTokenMintingRules.basePrice *= 1.05;
    }
    
    // Adjust staking rewards based on token velocity
    if (marketMetrics.tokenVelocity > 0.5) {
      // If tokens are moving too quickly, increase staking rewards
      newConfig.stakingRewardRates.lumen *= 1.1;
      newConfig.stakingRewardRates.story *= 1.1;
    } else if (marketMetrics.tokenVelocity < 0.1) {
      // If tokens are moving too slowly, decrease staking rewards
      newConfig.stakingRewardRates.lumen *= 0.9;
      newConfig.stakingRewardRates.story *= 0.9;
    }
    
    // Update the config
    this.config = newConfig;
    return newConfig;
  }
} 