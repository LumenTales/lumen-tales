import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiFilter, FiSearch, FiBook, FiUser } from 'react-icons/fi';
import StoryCard from '../../components/story/StoryCard';
import CharacterCard from '../../components/character/CharacterCard';
import { useAuth } from '../../utils/auth';

// Mock data for marketplace items
const MOCK_STORIES = [
  {
    id: '1',
    title: 'The Crystal Caverns',
    description: 'Explore the mysterious crystal caverns and uncover ancient secrets hidden within the glowing depths.',
    coverImage: 'https://via.placeholder.com/400x600?text=Crystal+Caverns',
    author: {
      name: 'Elena Rivers',
      image: 'https://via.placeholder.com/40x40?text=ER'
    },
    genre: 'Fantasy',
    publishedDate: new Date('2023-10-15'),
    readTime: 25,
    readersCount: 1243,
    isTokenized: true,
    price: 0.05
  },
  {
    id: '2',
    title: 'Whispers of the Forgotten City',
    description: 'Journey through an abandoned city where echoes of the past guide your path to uncover its downfall.',
    coverImage: 'https://via.placeholder.com/400x600?text=Forgotten+City',
    author: {
      name: 'Marcus Veil',
      image: 'https://via.placeholder.com/40x40?text=MV'
    },
    genre: 'Mystery',
    publishedDate: new Date('2023-11-03'),
    readTime: 30,
    readersCount: 876,
    isTokenized: true,
    price: 0.08
  },
  {
    id: '3',
    title: 'Echoes of the Astral Sea',
    description: 'Set sail across the cosmic ocean where stars become islands and constellations hold the key to universal harmony.',
    coverImage: 'https://via.placeholder.com/400x600?text=Astral+Sea',
    author: {
      name: 'Aria Nightshade',
      image: 'https://via.placeholder.com/40x40?text=AN'
    },
    genre: 'Sci-Fi',
    publishedDate: new Date('2023-12-01'),
    readTime: 40,
    readersCount: 542,
    isTokenized: true,
    price: 0.12
  }
];

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
    },
    price: 0.03
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
    },
    price: 0.02
  }
];

type MarketplaceTab = 'stories' | 'characters';

const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('stories');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Filter stories based on search term and genre filter
  const filteredStories = MOCK_STORIES.filter(story => {
    const matchesSearch = searchTerm === '' || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = filterGenre === '' || story.genre === filterGenre;
    
    return matchesSearch && matchesGenre;
  });

  // Filter characters based on search term and class filter
  const filteredCharacters = MOCK_CHARACTERS.filter(character => {
    const matchesSearch = searchTerm === '' || 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.storyTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filterClass === '' || character.class === filterClass;
    
    return matchesSearch && matchesClass;
  });

  // Get unique genres and classes for filters
  const genres = Array.from(new Set(MOCK_STORIES.map(story => story.genre)));
  const classes = Array.from(new Set(MOCK_CHARACTERS.map(char => char.class)));

  return (
    <>
      <Head>
        <title>NFT Marketplace | Lumen Tales</title>
        <meta name="description" content="Browse and purchase story and character NFTs in the Lumen Tales universe" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NFT Marketplace</h1>
          <p className="text-gray-600 mt-1">Browse and purchase story and character NFTs</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'stories'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('stories')}
          >
            <FiBook className="inline mr-2" />
            Stories
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'characters'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('characters')}
          >
            <FiUser className="inline mr-2" />
            Characters
          </button>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              {activeTab === 'stories' ? (
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        {activeTab === 'stories' ? (
          filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStories.map(story => (
                <div key={story.id} className="relative">
                  <StoryCard
                    id={story.id}
                    title={story.title}
                    description={story.description}
                    coverImage={story.coverImage}
                    author={story.author}
                    genre={story.genre}
                    publishedDate={story.publishedDate}
                    readTime={story.readTime}
                    readersCount={story.readersCount}
                    isTokenized={story.isTokenized}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-medium text-primary-600">{story.price} ETH</span>
                    <Link href={`/marketplace/story/${story.id}`} className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-600">
                No stories match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )
        ) : (
          filteredCharacters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map(character => (
                <div key={character.id} className="relative">
                  <CharacterCard
                    id={character.id}
                    name={character.name}
                    class={character.class}
                    image={character.image}
                    storyId={character.storyId}
                    storyTitle={character.storyTitle}
                    attributes={character.attributes}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-medium text-primary-600">{character.price} ETH</span>
                    <Link href={`/marketplace/character/${character.id}`} className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No characters found</h3>
              <p className="text-gray-600">
                No characters match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default MarketplacePage; 