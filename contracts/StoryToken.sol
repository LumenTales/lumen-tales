// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title StoryToken
 * @dev ERC721 token for Lumen Tales story NFTs
 */
contract StoryToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to author address
    mapping(uint256 => address) private _storyAuthors;
    
    // Mapping from token ID to royalty percentage (in basis points, 100 = 1%)
    mapping(uint256 => uint256) private _royaltyBps;
    
    // Default royalty in basis points (10%)
    uint256 private constant DEFAULT_ROYALTY_BPS = 1000;
    
    // Platform fee in basis points (2.5%)
    uint256 private constant PLATFORM_FEE_BPS = 250;
    
    // Platform treasury address
    address private _treasury;
    
    // Events
    event StoryMinted(uint256 indexed tokenId, address indexed author, string uri);
    event RoyaltyUpdated(uint256 indexed tokenId, uint256 royaltyBps);
    
    constructor(address treasury) ERC721("Lumen Tales Story", "TALE") {
        _treasury = treasury;
    }
    
    /**
     * @dev Mints a new story token
     * @param to The address that will own the minted token
     * @param uri The token URI
     * @param royaltyBps The royalty percentage in basis points
     * @return The ID of the newly minted token
     */
    function mintStory(address to, string memory uri, uint256 royaltyBps) public returns (uint256) {
        require(royaltyBps <= 3000, "Royalty too high"); // Max 30%
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        _storyAuthors[newTokenId] = to;
        _royaltyBps[newTokenId] = royaltyBps > 0 ? royaltyBps : DEFAULT_ROYALTY_BPS;
        
        emit StoryMinted(newTokenId, to, uri);
        
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
     * @dev Returns the royalty information for a token
     * @param tokenId The ID of the token
     * @return receiver The address that should receive royalties
     * @return royaltyAmount The royalty amount
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 royalty = (salePrice * _royaltyBps[tokenId]) / 10000;
        return (_storyAuthors[tokenId], royalty);
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
     * @dev Returns the author of a token
     * @param tokenId The ID of the token
     * @return The author address
     */
    function authorOf(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _storyAuthors[tokenId];
    }
} 