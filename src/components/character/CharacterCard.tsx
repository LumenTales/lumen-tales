import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiShield, FiHeart, FiBrain } from 'react-icons/fi';

interface CharacterAttributes {
  strength: number;
  intelligence: number;
  charisma: number;
  rarity: string;
}

interface CharacterCardProps {
  id: string;
  name: string;
  class: string;
  image: string;
  storyId: string;
  storyTitle: string;
  attributes: CharacterAttributes;
  isOwned?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  id,
  name,
  class: characterClass,
  image,
  storyId,
  storyTitle,
  attributes,
  isOwned = false,
}) => {
  // Calculate attribute percentage for visual display
  const getAttributePercentage = (value: number) => {
    return Math.min(Math.max(value * 10, 10), 100);
  };

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-500';
      case 'uncommon':
        return 'bg-green-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-56">
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
          NFT
        </div>
        <div className={`absolute top-2 left-2 ${getRarityColor(attributes.rarity)} text-white text-xs px-2 py-1 rounded-full`}>
          {attributes.rarity}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded-full mb-2">
            {characterClass}
          </span>
          <h3 className="text-white font-bold text-lg line-clamp-1">{name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <p className="text-sm text-gray-600">From story:</p>
          <Link href={`/story/${storyId}`} className="text-primary-600 hover:underline text-sm">
            {storyTitle}
          </Link>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiShield className="mr-2 text-red-500" />
              <span className="text-sm">Strength</span>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${getAttributePercentage(attributes.strength)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBrain className="mr-2 text-blue-500" />
              <span className="text-sm">Intelligence</span>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${getAttributePercentage(attributes.intelligence)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiHeart className="mr-2 text-purple-500" />
              <span className="text-sm">Charisma</span>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${getAttributePercentage(attributes.charisma)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {isOwned ? (
          <Link href={`/character/${id}`} className="block text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
            View Details
          </Link>
        ) : (
          <Link href={`/marketplace/character/${id}`} className="block text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
            Purchase
          </Link>
        )}
      </div>
    </div>
  );
};

export default CharacterCard; 