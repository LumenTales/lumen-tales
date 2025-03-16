import { ethers } from 'ethers';
import StoryTokenABI from './abis/StoryToken.json';
import CharacterTokenABI from './abis/CharacterToken.json';

/**
 * Get the Ethereum provider
 * @returns The ethers provider
 */
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  
  // Fallback to Infura
  const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '1';
  const network = chainId === '1' ? 'mainnet' : 'goerli';
  
  return new ethers.providers.InfuraProvider(network, infuraId);
};

/**
 * Get the signer for transactions
 * @returns The ethers signer
 */
export const getSigner = async () => {
  const provider = getProvider();
  
  if (provider instanceof ethers.providers.Web3Provider) {
    await provider.send('eth_requestAccounts', []);
    return provider.getSigner();
  }
  
  throw new Error('No wallet connected');
};

/**
 * Get the Story Token contract
 * @param signerOrProvider The signer or provider
 * @returns The Story Token contract
 */
export const getStoryTokenContract = (signerOrProvider: ethers.providers.Provider | ethers.Signer) => {
  const contractAddress = process.env.NEXT_PUBLIC_STORY_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error('Story contract address not defined');
  }
  
  return new ethers.Contract(contractAddress, StoryTokenABI, signerOrProvider);
};

/**
 * Get the Character Token contract
 * @param signerOrProvider The signer or provider
 * @returns The Character Token contract
 */
export const getCharacterTokenContract = (signerOrProvider: ethers.providers.Provider | ethers.Signer) => {
  const contractAddress = process.env.NEXT_PUBLIC_CHARACTER_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error('Character contract address not defined');
  }
  
  return new ethers.Contract(contractAddress, CharacterTokenABI, signerOrProvider);
};

/**
 * Mint a new story token
 * @param uri The token URI
 * @param royaltyBps The royalty percentage in basis points
 * @returns The transaction receipt
 */
export const mintStory = async (uri: string, royaltyBps: number = 1000) => {
  try {
    const signer = await getSigner();
    const contract = getStoryTokenContract(signer);
    const address = await signer.getAddress();
    
    const tx = await contract.mintStory(address, uri, royaltyBps);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting story:', error);
    throw error;
  }
};

/**
 * Mint a new character token
 * @param storyId The ID of the story this character belongs to
 * @param uri The token URI
 * @param royaltyBps The royalty percentage in basis points
 * @param attributes The character attributes
 * @returns The transaction receipt
 */
export const mintCharacter = async (
  storyId: number,
  uri: string,
  royaltyBps: number = 1000,
  attributes: {
    name: string;
    characterClass: string;
    strength: number;
    intelligence: number;
    charisma: number;
    rarity: number;
  }
) => {
  try {
    const signer = await getSigner();
    const contract = getCharacterTokenContract(signer);
    const address = await signer.getAddress();
    
    const tx = await contract.mintCharacter(address, storyId, uri, royaltyBps, attributes);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting character:', error);
    throw error;
  }
};

/**
 * Get a story token by ID
 * @param tokenId The token ID
 * @returns The story token data
 */
export const getStory = async (tokenId: number) => {
  try {
    const provider = getProvider();
    const contract = getStoryTokenContract(provider);
    
    const uri = await contract.tokenURI(tokenId);
    const owner = await contract.ownerOf(tokenId);
    const author = await contract.authorOf(tokenId);
    
    // Fetch metadata from IPFS or other storage
    const response = await fetch(uri);
    const metadata = await response.json();
    
    return {
      id: tokenId,
      uri,
      owner,
      author,
      metadata,
    };
  } catch (error) {
    console.error('Error getting story:', error);
    throw error;
  }
};

/**
 * Get a character token by ID
 * @param tokenId The token ID
 * @returns The character token data
 */
export const getCharacter = async (tokenId: number) => {
  try {
    const provider = getProvider();
    const contract = getCharacterTokenContract(provider);
    
    const uri = await contract.tokenURI(tokenId);
    const owner = await contract.ownerOf(tokenId);
    const creator = await contract.creatorOf(tokenId);
    const storyId = await contract.storyOf(tokenId);
    const attributes = await contract.attributesOf(tokenId);
    
    // Fetch metadata from IPFS or other storage
    const response = await fetch(uri);
    const metadata = await response.json();
    
    return {
      id: tokenId,
      uri,
      owner,
      creator,
      storyId,
      attributes,
      metadata,
    };
  } catch (error) {
    console.error('Error getting character:', error);
    throw error;
  }
}; 