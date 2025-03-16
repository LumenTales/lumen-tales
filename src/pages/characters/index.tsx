import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import CharacterCard from '../../components/character/CharacterCard';
import { useAuth } from '../../utils/auth';

// Mock data for character NFTs
const MOCK_CHARACTERS = [
  {
    id: '1',
    name: 'Elara Moonwhisper',
    class: 'Mage',
    image: 'https://via.placeholder.com/400x400?text=Mage',
    storyId: '1',
    storyTitle: 'The Crystal Caverns',
    attributes: {
      strength: 3,
      intelligence: 9,
      charisma: 6,
      rarity: 'Rare'
    }
  },
  {
    id: '2',
    name: 'Thorne Ironheart',
    class: 'Warrior',
    image: 'https://via.placeholder.com/400x400?text=Warrior',
    storyId: '1',
    storyTitle: 'The Crystal Caverns',
    attributes: {
      strength: 8,
      intelligence: 4,
      charisma: 5,
      rarity: 'Uncommon'
    }
  },
  {
    id: '3',
    name: 'Lyra Shadowstep',
    class: 'Rogue',
    image: 'https://via.placeholder.com/400x400?text=Rogue',
    storyId: '2',
    storyTitle: 'Whispers of the Forgotten City',
    attributes: {
      strength: 6,
      intelligence: 7,
      charisma: 8,
      rarity: 'Epic'
    }
  },
  {
    id: '4',
    name: 'Orion Starsong',
    class: 'Bard',
    image: 'https://via.placeholder.com/400x400?text=Bard',
    storyId: '3',
    storyTitle: 'Echoes of the Astral Sea',
    attributes: {
      strength: 4,
      intelligence: 6,
      charisma: 10,
      rarity: 'Legendary'
    }
  }
];

const CharactersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [characters, setCharacters] = useState(MOCK_CHARACTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // In a real app, we would fetch the user's characters from the blockchain
    // For now, we'll use the mock data
    const fetchCharacters = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCharacters(MOCK_CHARACTERS);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCharacters();
    }
  }, [user, loading, router]);

  // Filter characters based on search term and class filter
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = searchTerm === '' || 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.storyTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filterClass === '' || character.class === filterClass;
    
    return matchesSearch && matchesClass;
  });

  // Get unique character classes for filter
  const characterClasses = Array.from(new Set(characters.map(char => char.class)));

  return (
    <>
      <Head>
        <title>My Characters | Lumen Tales</title>
        <meta name="description" content="View and manage your character NFTs in the Lumen Tales universe" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Characters</h1>
            <p className="text-gray-600 mt-1">Manage your character NFTs in the Lumen Tales universe</p>
          </div>
          
          <Link href="/characters/create" className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            <FiPlus className="mr-2" />
            Create New Character
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Classes</option>
                {characterClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map(character => (
              <CharacterCard
                key={character.id}
                id={character.id}
                name={character.name}
                class={character.class}
                image={character.image}
                storyId={character.storyId}
                storyTitle={character.storyTitle}
                attributes={character.attributes}
                isOwned={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No characters found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterClass 
                ? "No characters match your search criteria. Try adjusting your filters."
                : "You don't have any characters yet. Create your first character to get started!"}
            </p>
            
            {!searchTerm && !filterClass && (
              <Link href="/characters/create" className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                <FiPlus className="mr-2" />
                Create New Character
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CharactersPage; 