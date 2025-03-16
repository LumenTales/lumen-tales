/**
 * Token Contract Integration
 * 
 * Provides an interface to interact with the blockchain smart contracts
 * for LUMEN tokens, Story tokens, and Character NFTs.
 */

import { ethers } from 'ethers';
import { TokenTransaction } from '@/models/Token';

// ABI definitions would normally be imported from separate files
const LUMEN_TOKEN_ABI = [
  // This would be the actual ABI for the LUMEN ERC-20 token
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

const STORY_TOKEN_ABI = [
  // This would be the actual ABI for the Story token contract
  "function mint(address to, uint256 storyId, uint256 amount) returns (uint256)",
  "function balanceOf(address owner, uint256 storyId) view returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external"
];

const CHARACTER_NFT_ABI = [
  // This would be the actual ABI for the Character NFT contract
  "function mint(address to, uint256 characterId, string memory tokenURI) returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external"
];

export interface ContractAddresses {
  lumenToken: string;
  storyToken: string;
  characterNFT: string;
  marketplace: string;
}

export class TokenContract {
  private provider: ethers.providers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private addresses: ContractAddresses;
  private lumenContract: ethers.Contract | null = null;
  private storyContract: ethers.Contract | null = null;
  private characterContract: ethers.Contract | null = null;
  
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
      
      // Initialize contracts
      this.initializeContracts();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
      return false;
    }
  }
  
  /**
   * Initializes the smart contract instances
   */
  private initializeContracts() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    // Initialize with provider for read-only operations
    this.lumenContract = new ethers.Contract(
      this.addresses.lumenToken,
      LUMEN_TOKEN_ABI,
      this.provider
    );
    
    this.storyContract = new ethers.Contract(
      this.addresses.storyToken,
      STORY_TOKEN_ABI,
      this.provider
    );
    
    this.characterContract = new ethers.Contract(
      this.addresses.characterNFT,
      CHARACTER_NFT_ABI,
      this.provider
    );
    
    // If signer is available, connect contracts to signer for transactions
    if (this.signer) {
      this.lumenContract = this.lumenContract.connect(this.signer);
      this.storyContract = this.storyContract.connect(this.signer);
      this.characterContract = this.characterContract.connect(this.signer);
    }
  }
  
  /**
   * Gets the LUMEN token balance for an address
   */
  async getLumenBalance(address: string): Promise<number> {
    if (!this.lumenContract) {
      throw new Error('LUMEN contract not initialized');
    }
    
    try {
      const balance = await this.lumenContract.balanceOf(address);
      return parseFloat(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Failed to get LUMEN balance:', error);
      return 0;
    }
  }
  
  /**
   * Gets the Story token balance for an address and story ID
   */
  async getStoryTokenBalance(address: string, storyId: string): Promise<number> {
    if (!this.storyContract) {
      throw new Error('Story token contract not initialized');
    }
    
    try {
      const balance = await this.storyContract.balanceOf(address, storyId);
      return balance.toNumber();
    } catch (error) {
      console.error(`Failed to get Story token balance for story ${storyId}:`, error);
      return 0;
    }
  }
  
  /**
   * Transfers LUMEN tokens to another address
   */
  async transferLumen(to: string, amount: number): Promise<TokenTransaction | null> {
    if (!this.lumenContract || !this.signer) {
      throw new Error('LUMEN contract not initialized or signer not available');
    }
    
    try {
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.lumenContract.transfer(to, amountWei);
      const receipt = await tx.wait();
      
      // Create transaction record
      const fromAddress = await this.signer.getAddress();
      
      return {
        id: receipt.transactionHash,
        fromUserId: fromAddress,
        toUserId: to,
        tokenType: 'LUMEN',
        amount,
        transactionType: 'TRANSFER',
        timestamp: new Date(),
        blockchainTxHash: receipt.transactionHash,
        status: 'COMPLETED'
      };
    } catch (error) {
      console.error('Failed to transfer LUMEN tokens:', error);
      return null;
    }
  }
  
  /**
   * Mints a new Story token
   */
  async mintStoryToken(to: string, storyId: string, amount: number): Promise<TokenTransaction | null> {
    if (!this.storyContract || !this.signer) {
      throw new Error('Story token contract not initialized or signer not available');
    }
    
    try {
      const tx = await this.storyContract.mint(to, storyId, amount);
      const receipt = await tx.wait();
      
      return {
        id: receipt.transactionHash,
        fromUserId: null, // Minting, so no sender
        toUserId: to,
        tokenType: 'STORY',
        tokenId: storyId,
        amount,
        transactionType: 'MINT',
        relatedEntityType: 'STORY',
        relatedEntityId: storyId,
        timestamp: new Date(),
        blockchainTxHash: receipt.transactionHash,
        status: 'COMPLETED'
      };
    } catch (error) {
      console.error(`Failed to mint Story token for story ${storyId}:`, error);
      return null;
    }
  }
  
  /**
   * Mints a new Character NFT
   */
  async mintCharacterNFT(to: string, characterId: string, tokenURI: string): Promise<TokenTransaction | null> {
    if (!this.characterContract || !this.signer) {
      throw new Error('Character NFT contract not initialized or signer not available');
    }
    
    try {
      const tx = await this.characterContract.mint(to, characterId, tokenURI);
      const receipt = await tx.wait();
      
      // Get the token ID from the event logs
      const event = receipt.events?.find(e => e.event === 'Transfer');
      const tokenId = event?.args?.tokenId.toString();
      
      return {
        id: receipt.transactionHash,
        fromUserId: null, // Minting, so no sender
        toUserId: to,
        tokenType: 'CHARACTER',
        tokenId: characterId,
        amount: 1, // NFTs have amount of 1
        transactionType: 'MINT',
        relatedEntityType: 'CHARACTER',
        relatedEntityId: characterId,
        timestamp: new Date(),
        blockchainTxHash: receipt.transactionHash,
        status: 'COMPLETED',
        metadata: {
          tokenId,
          tokenURI
        }
      };
    } catch (error) {
      console.error(`Failed to mint Character NFT for character ${characterId}:`, error);
      return null;
    }
  }
  
  /**
   * Gets the current wallet address
   */
  async getCurrentAddress(): Promise<string | null> {
    if (!this.signer) {
      return null;
    }
    
    try {
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get current address:', error);
      return null;
    }
  }
}

// For TypeScript to recognize window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
} 