# Lumen Tales

![Lumen Tales Logo](public/logo.svg)

Lumen Tales is an interactive storytelling platform that combines blockchain technology with AI-assisted content creation. Authors can create branching narratives while readers can own characters and story segments as NFTs, creating a new paradigm for digital storytelling.

Website: [www.lumentales.com](https://www.lumentales.com)  
Twitter: [@LumenTales](https://x.com/LumenTales)  
GitHub: [@LumenTale](https://github.com/LumenTale)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technical Implementation](#technical-implementation)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Overview

Lumen Tales is a decentralized platform that empowers storytellers to create interactive narratives where readers can influence the story direction. By leveraging blockchain technology, both authors and readers can tokenize their contributions, creating a new economic model for digital storytelling.

## Features

- **Interactive Storytelling**: Create branching narratives with multiple paths and endings
- **NFT Integration**: Tokenize stories and characters as NFTs on the blockchain
- **AI-Assisted Creation**: Generate content and images using AI to enhance storytelling
- **Character Building**: Create and customize characters with unique attributes
- **Marketplace**: Buy, sell, and trade story and character NFTs
- **User Authentication**: Secure login with wallet integration

## Architecture

The Lumen Tales platform is built using a modern tech stack:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js Front  │◄───►│  Smart Contract │◄───►│  External APIs  │
│      End        │     │  Blockchain     │     │  (AI, Storage)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Pages                                                      │
│  ├── Home                                                   │
│  ├── Dashboard                                              │
│  ├── Story                                                  │
│  │   ├── Builder                                            │
│  │   ├── Reader                                             │
│  │   └── Details                                            │
│  ├── Character                                              │
│  │   ├── Builder                                            │
│  │   └── Details                                            │
│  ├── Marketplace                                            │
│  └── Authentication (Login/Register)                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Components                                                 │
│  ├── Layout                                                 │
│  ├── UI                                                     │
│  ├── Story                                                  │
│  │   ├── StoryCard                                          │
│  │   ├── StoryBuilder                                       │
│  │   └── StoryReader                                        │
│  └── Character                                              │
│      ├── CharacterCard                                      │
│      └── CharacterBuilder                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Utils & Services                                           │
│  ├── Authentication                                         │
│  ├── API                                                    │
│  ├── Blockchain                                             │
│  └── AI Services                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Blockchain Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Smart Contracts                                            │
│  ├── StoryToken (ERC-721)                                   │
│  │   ├── Minting                                            │
│  │   ├── Royalties                                          │
│  │   └── Ownership                                          │
│  │                                                          │
│  └── CharacterToken (ERC-721)                               │
│      ├── Attributes                                         │
│      ├── Story Association                                  │
│      └── Ownership                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Technical Implementation

### Frontend (Next.js)

The frontend is built with Next.js, providing server-side rendering and static site generation capabilities. The UI is designed with a component-based architecture using React and styled with Tailwind CSS.

Key components include:

#### Story Builder

The StoryBuilder component allows authors to create interactive stories with branching narratives:

```typescript
// StoryBuilder.tsx
interface StorySegment {
  id: string;
  title: string;
  content: string;
  choices: Choice[];
  image?: string;
}

interface Choice {
  id: string;
  text: string;
  nextSegmentId?: string;
}

// Functions for managing story creation
const addSegment = () => {
  const newSegmentId = `segment-${Date.now()}`;
  setSegments(prev => [
    ...prev,
    {
      id: newSegmentId,
      title: 'New Segment',
      content: '',
      choices: [],
    }
  ]);
  setCurrentSegmentId(newSegmentId);
};

// AI integration for content generation
const generateContentWithAI = async () => {
  if (!aiPrompt) {
    setError('Please provide a prompt for AI generation');
    return;
  }
  
  setIsLoading(true);
  setError('');
  
  try {
    const generatedContent = await generateStoryContinuation(
      aiPrompt,
      currentSegment.content
    );
    
    handleSegmentChange('content', generatedContent);
    setSuccess('Content generated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    setError('Failed to generate content. Please try again.');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
```

#### Character Builder

The CharacterBuilder component enables users to create and mint character NFTs:

```typescript
// CharacterBuilder.tsx
interface CharacterData {
  name: string;
  class: string;
  image: string;
  storyId: string;
  strength: number;
  intelligence: number;
  charisma: number;
}

// Attribute management
const handleAttributeChange = (attribute: 'strength' | 'intelligence' | 'charisma', value: number) => {
  // Calculate new total if this attribute is changed
  const currentTotal = 
    character.strength + 
    character.intelligence + 
    character.charisma;
  const newTotal = currentTotal - character[attribute] + value;
  
  // Check if new value is within bounds
  if (value < 1 || value > 10) return;
  
  // Check if we have enough points
  if (newTotal > 20) return;
  
  setCharacter(prev => ({ ...prev, [attribute]: value }));
};

// Mint character as NFT
const mintCharacterNFT = async () => {
  if (!character.name || !character.class || !character.image) {
    setError('Please complete all fields and generate an image before minting');
    return;
  }
  
  setIsLoading(true);
  setError('');
  
  try {
    // Call the blockchain contract to mint the character
    const result = await mintCharacter(
      character.storyId,
      character.name,
      character.class,
      character.image,
      character.strength,
      character.intelligence,
      character.charisma
    );
    
    setSuccess('Character minted successfully as an NFT!');
    
    // Redirect to character page after successful minting
    setTimeout(() => {
      router.push('/characters');
    }, 2000);
  } catch (err) {
    setError('Failed to mint character. Please try again.');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
```

### Blockchain Integration

The platform integrates with Ethereum-compatible blockchains through smart contracts written in Solidity:

#### Story Token Contract

```solidity
// StoryToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StoryToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Treasury address for platform fees
    address private _treasuryAddress;
    
    // Platform fee percentage (in basis points, 100 = 1%)
    uint256 private _platformFeePercentage = 500; // 5%
    
    // Mapping from token ID to author address
    mapping(uint256 => address) private _storyAuthors;
    
    // Mapping from token ID to royalty percentage (in basis points)
    mapping(uint256 => uint256) private _royaltyPercentages;
    
    // Events
    event StoryMinted(uint256 indexed tokenId, address indexed author, string tokenURI);
    event RoyaltyUpdated(uint256 indexed tokenId, uint256 royaltyPercentage);
    
    constructor(address treasuryAddress) ERC721("Lumen Tales Story", "TALE") {
        require(treasuryAddress != address(0), "Treasury address cannot be zero");
        _treasuryAddress = treasuryAddress;
    }
    
    // Mint a new story token
    function mintStory(
        address author,
        string memory tokenURI,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(royaltyPercentage <= 3000, "Royalty percentage cannot exceed 30%");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(author, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        _storyAuthors[newTokenId] = author;
        _royaltyPercentages[newTokenId] = royaltyPercentage;
        
        emit StoryMinted(newTokenId, author, tokenURI);
        
        return newTokenId;
    }
    
    // Get the author of a story
    function authorOf(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _storyAuthors[tokenId];
    }
    
    // Update royalty percentage for a token
    function updateRoyalty(uint256 tokenId, uint256 royaltyPercentage) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only token owner can update royalty");
        require(royaltyPercentage <= 3000, "Royalty percentage cannot exceed 30%");
        
        _royaltyPercentages[tokenId] = royaltyPercentage;
        
        emit RoyaltyUpdated(tokenId, royaltyPercentage);
    }
    
    // Get royalty information for a token
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view returns (address, uint256) {
        require(_exists(tokenId), "Token does not exist");
        
        address author = _storyAuthors[tokenId];
        uint256 royaltyAmount = (salePrice * _royaltyPercentages[tokenId]) / 10000;
        
        return (author, royaltyAmount);
    }
    
    // Calculate platform fee
    function platformFee(uint256 salePrice) public view returns (address, uint256) {
        uint256 feeAmount = (salePrice * _platformFeePercentage) / 10000;
        return (_treasuryAddress, feeAmount);
    }
    
    // Update treasury address
    function setTreasuryAddress(address treasuryAddress) public onlyOwner {
        require(treasuryAddress != address(0), "Treasury address cannot be zero");
        _treasuryAddress = treasuryAddress;
    }
}
```

#### Character Token Contract

```solidity
// CharacterToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CharacterToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Treasury address for platform fees
    address private _treasuryAddress;
    
    // Platform fee percentage (in basis points, 100 = 1%)
    uint256 private _platformFeePercentage = 500; // 5%
    
    // Character attributes struct
    struct CharacterAttributes {
        string name;
        string class;
        uint8 strength;
        uint8 intelligence;
        uint8 charisma;
        string rarity;
    }
    
    // Mapping from token ID to story token ID
    mapping(uint256 => uint256) private _characterStories;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) private _characterCreators;
    
    // Mapping from token ID to character attributes
    mapping(uint256 => CharacterAttributes) private _characterAttributes;
    
    // Mapping from token ID to royalty percentage (in basis points)
    mapping(uint256 => uint256) private _royaltyPercentages;
    
    // Events
    event CharacterMinted(uint256 indexed tokenId, address indexed creator, uint256 indexed storyId);
    event RoyaltyUpdated(uint256 indexed tokenId, uint256 royaltyPercentage);
    
    constructor(address treasuryAddress) ERC721("Lumen Tales Character", "CHAR") {
        require(treasuryAddress != address(0), "Treasury address cannot be zero");
        _treasuryAddress = treasuryAddress;
    }
    
    // Mint a new character token
    function mintCharacter(
        address creator,
        uint256 storyId,
        string memory tokenURI,
        string memory name,
        string memory class,
        uint8 strength,
        uint8 intelligence,
        uint8 charisma,
        string memory rarity,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(royaltyPercentage <= 3000, "Royalty percentage cannot exceed 30%");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(creator, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        _characterStories[newTokenId] = storyId;
        _characterCreators[newTokenId] = creator;
        _royaltyPercentages[newTokenId] = royaltyPercentage;
        
        _characterAttributes[newTokenId] = CharacterAttributes({
            name: name,
            class: class,
            strength: strength,
            intelligence: intelligence,
            charisma: charisma,
            rarity: rarity
        });
        
        emit CharacterMinted(newTokenId, creator, storyId);
        
        return newTokenId;
    }
    
    // Get the story ID associated with a character
    function storyOf(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _characterStories[tokenId];
    }
    
    // Get the creator of a character
    function creatorOf(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _characterCreators[tokenId];
    }
    
    // Get the attributes of a character
    function attributesOf(uint256 tokenId) public view returns (
        string memory name,
        string memory class,
        uint8 strength,
        uint8 intelligence,
        uint8 charisma,
        string memory rarity
    ) {
        require(_exists(tokenId), "Token does not exist");
        CharacterAttributes memory attrs = _characterAttributes[tokenId];
        
        return (
            attrs.name,
            attrs.class,
            attrs.strength,
            attrs.intelligence,
            attrs.charisma,
            attrs.rarity
        );
    }
    
    // Update royalty percentage for a token
    function updateRoyalty(uint256 tokenId, uint256 royaltyPercentage) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only token owner can update royalty");
        require(royaltyPercentage <= 3000, "Royalty percentage cannot exceed 30%");
        
        _royaltyPercentages[tokenId] = royaltyPercentage;
        
        emit RoyaltyUpdated(tokenId, royaltyPercentage);
    }
    
    // Get royalty information for a token
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view returns (address, uint256) {
        require(_exists(tokenId), "Token does not exist");
        
        address creator = _characterCreators[tokenId];
        uint256 royaltyAmount = (salePrice * _royaltyPercentages[tokenId]) / 10000;
        
        return (creator, royaltyAmount);
    }
    
    // Calculate platform fee
    function platformFee(uint256 salePrice) public view returns (address, uint256) {
        uint256 feeAmount = (salePrice * _platformFeePercentage) / 10000;
        return (_treasuryAddress, feeAmount);
    }
    
    // Update treasury address
    function setTreasuryAddress(address treasuryAddress) public onlyOwner {
        require(treasuryAddress != address(0), "Treasury address cannot be zero");
        _treasuryAddress = treasuryAddress;
    }
}
```

### AI Integration

The platform integrates with AI services for content and image generation:

```typescript
// src/services/ai.ts
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate story continuation based on prompt and existing content
 */
export const generateStoryContinuation = async (
  prompt: string,
  existingContent: string
): Promise<string> => {
  try {
    // In a real implementation, this would call the Gemini API
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `${existingContent}\n\n${prompt}\n\nThe path ahead forked unexpectedly. To the left, a narrow trail disappeared into a dense thicket of thorns. To the right, stone steps descended into darkness, the air from below carrying a chill that raised goosebumps on exposed skin.`;
  } catch (error) {
    console.error('Error generating story continuation:', error);
    throw new Error('Failed to generate story continuation');
  }
};

/**
 * Generate an image for a story scene
 */
export const generateSceneImage = async (
  prompt: string
): Promise<string> => {
  try {
    // In a real implementation, this would call an image generation API
    // For now, we'll return a placeholder image
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `https://via.placeholder.com/800x600?text=${encodeURIComponent(prompt)}`;
  } catch (error) {
    console.error('Error generating scene image:', error);
    throw new Error('Failed to generate scene image');
  }
};
```

## Data Flow

The Lumen Tales platform follows a comprehensive data flow that connects user interactions with blockchain transactions:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  User Input ├────►│ React State ├────►│ Blockchain  ├────►│  Database   │
│             │     │             │     │ Transaction │     │  Storage    │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │                   │
       │                                       │                   │
       └───────────────────────────────────────┴───────────────────┘
                              Data Retrieval
```

### Story Creation Flow

1. Author creates story segments and choices in the StoryBuilder
2. Content and images can be generated with AI assistance
3. Story metadata and segments are saved to local storage during editing
4. When published, story data is uploaded to IPFS and metadata is stored on-chain
5. An NFT is minted representing ownership of the story

### Character Creation Flow

1. User selects a story to create a character for
2. Character attributes (strength, intelligence, charisma) are allocated
3. Character image is generated based on name and class
4. Character data is uploaded to IPFS and metadata is stored on-chain
5. An NFT is minted representing ownership of the character

### Marketplace Flow

1. Users can browse available story and character NFTs
2. NFTs can be filtered by various attributes (genre, class, etc.)
3. When purchasing, a blockchain transaction is initiated
4. Royalties are automatically distributed to creators
5. Ownership is transferred on the blockchain

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LumenTale/LumenTales.git
   cd LumenTales
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API keys and configuration.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Smart Contract Deployment

1. Install Hardhat:
   ```bash
   npm install --save-dev hardhat
   ```

2. Compile contracts:
   ```bash
   npx hardhat compile
   ```

3. Deploy contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

## Contributing

We welcome contributions to Lumen Tales! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 