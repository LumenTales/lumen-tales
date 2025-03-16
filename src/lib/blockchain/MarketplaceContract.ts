/**
 * Marketplace Contract Integration
 * 
 * Provides an interface to interact with the blockchain marketplace
 * for trading Story tokens and Character NFTs.
 */

import { ethers } from 'ethers';
import { TokenTransaction } from '@/models/Token';
import { ContractAddresses } from './TokenContract';

// ABI definitions would normally be imported from separate files
const MARKETPLACE_ABI = [
  // This would be the actual ABI for the marketplace contract
  "function createListing(address tokenContract, uint256 tokenId, uint256 amount, uint256 price) returns (uint256)",
  "function cancelListing(uint256 listingId) returns (bool)",
  "function buyListing(uint256 listingId) payable returns (bool)",
  "function getListingInfo(uint256 listingId) view returns (tuple(address seller, address tokenContract, uint256 tokenId, uint256 amount, uint256 price, bool active))",
  "function getListingsByUser(address user) view returns (uint256[])",
  "function getActiveListings() view returns (uint256[])"
];

export interface ListingInfo {
  id: string;
  seller: string;
  tokenContract: string;
  tokenId: string;
  amount: number;
  price: number;
  active: boolean;
  tokenType: 'STORY' | 'CHARACTER';
  createdAt: Date;
}

export class MarketplaceContract {
  private provider: ethers.providers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private addresses: ContractAddresses;
  private marketplaceContract: ethers.Contract | null = null;
  
  constructor(addresses: ContractAddresses) {
    this.addresses = addresses;
  }
  
  /**
   * Initializes the blockchain connection
   */
  async connect(provider?: ethers.providers.Provider): Promise<boolean> {
    try {
      // If provider is provided, use it
      if (provider) {
        this.provider = provider;
      } 
      // Otherwise try to connect to MetaMask or other injected provider
      else if (window.ethereum) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        console.error('No Ethereum provider found');
        return false;
      }
      
      // Get signer for transactions
      if (this.provider instanceof ethers.providers.Web3Provider) {
        this.signer = this.provider.getSigner();
      }
      
      // Initialize marketplace contract
      this.initializeContract();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
      return false;
    }
  }
  
  /**
   * Initializes the marketplace contract instance
   */
  private initializeContract() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    // Initialize with provider for read-only operations
    this.marketplaceContract = new ethers.Contract(
      this.addresses.marketplace,
      MARKETPLACE_ABI,
      this.provider
    );
    
    // If signer is available, connect contract to signer for transactions
    if (this.signer) {
      this.marketplaceContract = this.marketplaceContract.connect(this.signer);
    }
  }
  
  /**
   * Creates a new listing on the marketplace
   */
  async createListing(
    tokenType: 'STORY' | 'CHARACTER',
    tokenId: string,
    amount: number,
    price: number
  ): Promise<string | null> {
    if (!this.marketplaceContract || !this.signer) {
      throw new Error('Marketplace contract not initialized or signer not available');
    }
    
    try {
      // Determine token contract address based on token type
      const tokenContract = tokenType === 'STORY' 
        ? this.addresses.storyToken 
        : this.addresses.characterNFT;
      
      // Convert price to wei
      const priceWei = ethers.utils.parseEther(price.toString());
      
      // Create listing
      const tx = await this.marketplaceContract.createListing(
        tokenContract,
        tokenId,
        amount,
        priceWei
      );
      
      const receipt = await tx.wait();
      
      // Get listing ID from event logs
      const event = receipt.events?.find(e => e.event === 'ListingCreated');
      const listingId = event?.args?.listingId.toString();
      
      return listingId || null;
    } catch (error) {
      console.error('Failed to create listing:', error);
      return null;
    }
  }
  
  /**
   * Cancels an existing listing
   */
  async cancelListing(listingId: string): Promise<boolean> {
    if (!this.marketplaceContract || !this.signer) {
      throw new Error('Marketplace contract not initialized or signer not available');
    }
    
    try {
      const tx = await this.marketplaceContract.cancelListing(listingId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error(`Failed to cancel listing ${listingId}:`, error);
      return false;
    }
  }
  
  /**
   * Purchases a listing
   */
  async buyListing(listingId: string): Promise<TokenTransaction | null> {
    if (!this.marketplaceContract || !this.signer) {
      throw new Error('Marketplace contract not initialized or signer not available');
    }
    
    try {
      // Get listing info to determine price
      const listingInfo = await this.getListingInfo(listingId);
      if (!listingInfo || !listingInfo.active) {
        throw new Error('Listing not found or not active');
      }
      
      // Buy the listing
      const tx = await this.marketplaceContract.buyListing(listingId, {
        value: ethers.utils.parseEther(listingInfo.price.toString())
      });
      
      const receipt = await tx.wait();
      
      // Create transaction record
      const buyerAddress = await this.signer.getAddress();
      
      return {
        id: receipt.transactionHash,
        fromUserId: listingInfo.seller,
        toUserId: buyerAddress,
        tokenType: listingInfo.tokenType,
        tokenId: listingInfo.tokenId,
        amount: listingInfo.amount,
        transactionType: 'PURCHASE',
        relatedEntityType: 'MARKETPLACE',
        relatedEntityId: listingId,
        timestamp: new Date(),
        blockchainTxHash: receipt.transactionHash,
        status: 'COMPLETED',
        metadata: {
          price: listingInfo.price,
          listingId
        }
      };
    } catch (error) {
      console.error(`Failed to buy listing ${listingId}:`, error);
      return null;
    }
  }
  
  /**
   * Gets information about a specific listing
   */
  async getListingInfo(listingId: string): Promise<ListingInfo | null> {
    if (!this.marketplaceContract) {
      throw new Error('Marketplace contract not initialized');
    }
    
    try {
      const info = await this.marketplaceContract.getListingInfo(listingId);
      
      // Determine token type based on token contract address
      const tokenType = info.tokenContract === this.addresses.storyToken 
        ? 'STORY' 
        : 'CHARACTER';
      
      return {
        id: listingId,
        seller: info.seller,
        tokenContract: info.tokenContract,
        tokenId: info.tokenId.toString(),
        amount: info.amount.toNumber(),
        price: parseFloat(ethers.utils.formatEther(info.price)),
        active: info.active,
        tokenType,
        createdAt: new Date() // In a real implementation, this would come from event logs
      };
    } catch (error) {
      console.error(`Failed to get listing info for ${listingId}:`, error);
      return null;
    }
  }
  
  /**
   * Gets all listings created by a user
   */
  async getListingsByUser(userAddress: string): Promise<ListingInfo[]> {
    if (!this.marketplaceContract) {
      throw new Error('Marketplace contract not initialized');
    }
    
    try {
      const listingIds = await this.marketplaceContract.getListingsByUser(userAddress);
      
      // Get details for each listing
      const listings: ListingInfo[] = [];
      for (const id of listingIds) {
        const info = await this.getListingInfo(id.toString());
        if (info) {
          listings.push(info);
        }
      }
      
      return listings;
    } catch (error) {
      console.error(`Failed to get listings for user ${userAddress}:`, error);
      return [];
    }
  }
  
  /**
   * Gets all active listings on the marketplace
   */
  async getActiveListings(): Promise<ListingInfo[]> {
    if (!this.marketplaceContract) {
      throw new Error('Marketplace contract not initialized');
    }
    
    try {
      const listingIds = await this.marketplaceContract.getActiveListings();
      
      // Get details for each listing
      const listings: ListingInfo[] = [];
      for (const id of listingIds) {
        const info = await this.getListingInfo(id.toString());
        if (info && info.active) {
          listings.push(info);
        }
      }
      
      return listings;
    } catch (error) {
      console.error('Failed to get active listings:', error);
      return [];
    }
  }
} 