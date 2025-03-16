import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiSave, FiImage, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { mintCharacter } from '../../blockchain/contracts';

interface CharacterData {
  name: string;
  class: string;
  image: string;
  storyId: string;
  strength: number;
  intelligence: number;
  charisma: number;
}

const CHARACTER_CLASSES = [
  'Warrior',
  'Mage',
  'Rogue',
  'Bard',
  'Paladin',
  'Ranger',
  'Druid',
  'Monk',
];

const CharacterBuilder: React.FC<{ storyId?: string; storyTitle?: string }> = ({
  storyId = '',
  storyTitle = '',
}) => {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterData>({
    name: '',
    class: CHARACTER_CLASSES[0],
    image: '',
    storyId: storyId,
    strength: 5,
    intelligence: 5,
    charisma: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remainingPoints, setRemainingPoints] = useState(5);

  // Update remaining points when attributes change
  useEffect(() => {
    const totalPoints = character.strength + character.intelligence + character.charisma;
    const basePoints = 15; // Starting points
    const maxPoints = 20; // Maximum allowed points
    setRemainingPoints(maxPoints - totalPoints);
  }, [character.strength, character.intelligence, character.charisma]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  // Handle attribute changes
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

  // Generate AI image for character
  const generateImage = async () => {
    if (!character.name || !character.class) {
      setError('Please provide a name and class before generating an image');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would call an AI image generation API
      // For now, we'll use a placeholder image
      const placeholderImages = {
        'Warrior': 'https://via.placeholder.com/400x400?text=Warrior',
        'Mage': 'https://via.placeholder.com/400x400?text=Mage',
        'Rogue': 'https://via.placeholder.com/400x400?text=Rogue',
        'Bard': 'https://via.placeholder.com/400x400?text=Bard',
        'Paladin': 'https://via.placeholder.com/400x400?text=Paladin',
        'Ranger': 'https://via.placeholder.com/400x400?text=Ranger',
        'Druid': 'https://via.placeholder.com/400x400?text=Druid',
        'Monk': 'https://via.placeholder.com/400x400?text=Monk',
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCharacter(prev => ({ 
        ...prev, 
        image: placeholderImages[prev.class as keyof typeof placeholderImages] || placeholderImages.Warrior
      }));
      
      setSuccess('Character image generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
    } catch (err: any) {
      setError(err.message || 'Failed to mint character. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create Character NFT</h2>
      
      {storyId && storyTitle && (
        <div className="mb-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            Creating a character for story: <span className="font-semibold">{storyTitle}</span>
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 rounded-md flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-3 bg-green-50 rounded-md flex items-center">
          <FiCheck className="text-green-500 mr-2" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Character Name
            </label>
            <input
              type="text"
              name="name"
              value={character.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter character name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Character Class
            </label>
            <select
              name="class"
              value={character.class}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CHARACTER_CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Character Attributes <span className="text-xs text-gray-500">(Points remaining: {remainingPoints})</span>
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-600">Strength</label>
                  <span className="text-sm font-medium">{character.strength}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleAttributeChange('strength', character.strength - 1)}
                    disabled={character.strength <= 1}
                    className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${character.strength * 10}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => handleAttributeChange('strength', character.strength + 1)}
                    disabled={remainingPoints <= 0 || character.strength >= 10}
                    className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-600">Intelligence</label>
                  <span className="text-sm font-medium">{character.intelligence}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleAttributeChange('intelligence', character.intelligence - 1)}
                    disabled={character.intelligence <= 1}
                    className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${character.intelligence * 10}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => handleAttributeChange('intelligence', character.intelligence + 1)}
                    disabled={remainingPoints <= 0 || character.intelligence >= 10}
                    className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-600">Charisma</label>
                  <span className="text-sm font-medium">{character.charisma}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleAttributeChange('charisma', character.charisma - 1)}
                    disabled={character.charisma <= 1}
                    className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${character.charisma * 10}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => handleAttributeChange('charisma', character.charisma + 1)}
                    disabled={remainingPoints <= 0 || character.charisma >= 10}
                    className="px-2 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={generateImage}
              disabled={isLoading || !character.name || !character.class}
              className="flex items-center justify-center px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 disabled:opacity-50"
            >
              <FiImage className="mr-2" />
              Generate Image
            </button>
            
            <button
              onClick={mintCharacterNFT}
              disabled={isLoading || !character.name || !character.class || !character.image}
              className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <FiSave className="mr-2" />
              Mint NFT
            </button>
          </div>
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Character Preview</p>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
            {character.image ? (
              <Image
                src={character.image}
                alt={character.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center p-4">
                  {isLoading ? 'Generating image...' : 'Character image will appear here'}
                </p>
              </div>
            )}
          </div>
          
          {character.image && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium text-lg">{character.name}</h3>
              <p className="text-sm text-gray-600">{character.class}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-red-50 p-2 rounded">
                  <p className="text-red-800">STR: {character.strength}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-800">INT: {character.intelligence}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-purple-800">CHA: {character.charisma}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterBuilder; 