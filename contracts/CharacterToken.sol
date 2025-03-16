// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CharacterToken
 * @dev ERC721 token for Lumen Tales character NFTs
 */
contract CharacterToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to story ID
    mapping(uint256 => uint256) private _characterStories;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) private _characterCreators;
    
    // Mapping from token ID to royalty percentage (in basis points, 100 = 1%)
    mapping(uint256 => uint256) private _royaltyBps;
    
    // Default royalty in basis points (10%)
    uint256 private constant DEFAULT_ROYALTY_BPS = 1000;
    
    // Platform fee in basis points (2.5%)
    uint256 private constant PLATFORM_FEE_BPS = 250;
    
    // Platform treasury address
    address private _treasury;
    
    // Character attributes
    struct CharacterAttributes {
        string name;
        string characterClass;
        uint8 strength;
        uint8 intelligence;
        uint8 charisma;
        uint8 rarity;
    }
    
    // Mapping from token ID to character attributes
    mapping(uint256 => CharacterAttributes) private _characterAttributes;
    
    // Events
    event CharacterMinted(uint256 indexed tokenId, address indexed creator, uint256 indexed storyId, string uri);
    event RoyaltyUpdated(uint256 indexed tokenId, uint256 royaltyBps);
    event AttributesUpdated(uint256 indexed tokenId);
    
    constructor(address treasury) ERC721("Lumen Tales Character", "CHAR") {
        _treasury = treasury;
    }
    
    /**
     * @dev Mints a new character token
     * @param to The address that will own the minted token
     * @param storyId The ID of the story this character belongs to
     * @param uri The token URI
     * @param royaltyBps The royalty percentage in basis points
     * @param attributes The character attributes
     * @return The ID of the newly minted token
     */
    function mintCharacter(
        address to,
        uint256 storyId,
        string memory uri,
        uint256 royaltyBps,
        CharacterAttributes memory attributes
    ) public returns (uint256) {
        require(royaltyBps <= 3000, "Royalty too high"); // Max 30%
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        _characterStories[newTokenId] = storyId;
        _characterCreators[newTokenId] = to;
        _royaltyBps[newTokenId] = royaltyBps > 0 ? royaltyBps : DEFAULT_ROYALTY_BPS;
        _characterAttributes[newTokenId] = attributes;
        
        emit CharacterMinted(newTokenId, to, storyId, uri);
        
        return newTokenId;
    }
    
    /**
     * @dev Updates the royalty percentage for a token
     * @param tokenId The ID of the token
     * @param royaltyBps The new royalty percentage in basis points
     */
    function updateRoyalty(uint256 tokenId, uint256 royaltyBps) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(royaltyBps <= 3000, "Royalty too high"); // Max 30%
        
        _royaltyBps[tokenId] = royaltyBps;
        
        emit RoyaltyUpdated(tokenId, royaltyBps);
    }
    
    /**
     * @dev Updates the attributes for a character
     * @param tokenId The ID of the token
     * @param attributes The new character attributes
     */
    function updateAttributes(uint256 tokenId, CharacterAttributes memory attributes) public {
        require(_exists(tokenId), "Token does not exist");
        require(_characterCreators[tokenId] == msg.sender, "Not character creator");
        
        _characterAttributes[tokenId] = attributes;
        
        emit AttributesUpdated(tokenId);
    }
    
    /**
     * @dev Returns the royalty information for a token
     * @param tokenId The ID of the token
     * @return receiver The address that should receive royalties
     * @return royaltyAmount The royalty amount
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 royalty = (salePrice * _royaltyBps[tokenId]) / 10000;
        return (_characterCreators[tokenId], royalty);
    }
    
    /**
     * @dev Returns the platform fee for a sale
     * @param salePrice The sale price
     * @return The platform fee amount
     */
    function platformFee(uint256 salePrice) external view returns (address receiver, uint256 feeAmount) {
        uint256 fee = (salePrice * PLATFORM_FEE_BPS) / 10000;
        return (_treasury, fee);
    }
    
    /**
     * @dev Updates the treasury address
     * @param newTreasury The new treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Zero address");
        _treasury = newTreasury;
    }
    
    /**
     * @dev Returns the creator of a character
     * @param tokenId The ID of the token
     * @return The creator address
     */
    function creatorOf(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _characterCreators[tokenId];
    }
    
    /**
     * @dev Returns the story ID for a character
     * @param tokenId The ID of the token
     * @return The story ID
     */
    function storyOf(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _characterStories[tokenId];
    }
    
    /**
     * @dev Returns the attributes for a character
     * @param tokenId The ID of the token
     * @return The character attributes
     */
    function attributesOf(uint256 tokenId) external view returns (CharacterAttributes memory) {
        require(_exists(tokenId), "Token does not exist");
        return _characterAttributes[tokenId];
    }
} 