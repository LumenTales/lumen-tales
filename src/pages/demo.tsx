import React, { useState } from 'react';
import StoryEditor from '@/components/StoryEditor';
import CharacterEditor from '@/components/CharacterEditor';
import { Character, Scene, Story } from '@/models/Story';

// Sample data for demonstration
const sampleCharacter: Character = {
  id: 'char1',
  name: 'Elara Nightshade',
  description: 'A mysterious elven sorceress with silver hair and piercing blue eyes. Known for her mastery of arcane magic and her enigmatic past.',
  traits: ['intelligent', 'mysterious', 'powerful', 'cautious'],
  attributes: {
    age: 'adult',
    gender: 'female',
    hairColor: 'silver',
    eyeColor: 'blue',
    skinTone: 'pale',
    height: 'tall',
    build: 'slender'
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  creatorId: 'user1'
};

const sampleScene: Scene = {
  id: 'scene1',
  title: 'The Ancient Library',
  content: 'Elara stepped into the ancient library, dust motes dancing in the shafts of light that streamed through the high windows. Rows of towering bookshelves stretched into the shadows, their contents promising forgotten knowledge and arcane secrets. The air felt heavy with magic and the weight of centuries.',
  setting: 'Ancient magical library',
  time: 'afternoon',
  mood: 'mysterious',
  characters: ['char1'],
  childrenIds: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  creatorId: 'user1',
  metadata: {
    tags: ['magic', 'library', 'discovery'],
    complexity: 3,
    emotionalTone: 'curious',
    visualElements: ['dust motes', 'light shafts', 'towering bookshelves']
  }
};

const sampleStory: Story = {
  id: 'story1',
  title: 'The Arcane Codex',
  description: 'A tale of magic, mystery, and ancient secrets waiting to be uncovered.',
  genre: ['fantasy', 'adventure'],
  characters: {
    'char1': sampleCharacter
  },
  scenes: {
    'scene1': sampleScene
  },
  rootSceneId: 'scene1',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  creatorId: 'user1',
  collaboratorIds: [],
  published: false,
  metadata: {
    tags: ['magic', 'adventure', 'mystery'],
    ageRating: 'teen',
    language: 'en',
    wordCount: 1200,
    readTime: 5,
    complexity: 3,
    branchCount: 1,
    endingCount: 0
  }
};

export default function DemoPage() {
  const [story, setStory] = useState<Story>(sampleStory);
  const [currentScene, setCurrentScene] = useState<Scene>(sampleScene);
  const [currentCharacter, setCurrentCharacter] = useState<Character>(sampleCharacter);
  const [activeTab, setActiveTab] = useState<'story' | 'character'>('story');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const handleSaveScene = (updatedScene: Scene) => {
    setCurrentScene(updatedScene);
    setStory(prevStory => ({
      ...prevStory,
      scenes: {
        ...prevStory.scenes,
        [updatedScene.id]: updatedScene
      },
      updatedAt: Date.now()
    }));
  };
  
  const handleSaveCharacter = (updatedCharacter: Character) => {
    setCurrentCharacter(updatedCharacter);
    setStory(prevStory => ({
      ...prevStory,
      characters: {
        ...prevStory.characters,
        [updatedCharacter.id]: updatedCharacter
      },
      updatedAt: Date.now()
    }));
  };
  
  const handleGenerateImage = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lumen Tales AI Demo</h1>
      
      {/* Tab navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'story' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('story')}
        >
          Story Editor
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'character' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('character')}
        >
          Character Editor
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Editor panel */}
        <div className="w-full md:w-2/3 bg-white rounded shadow">
          {activeTab === 'story' ? (
            <StoryEditor
              story={story}
              currentScene={currentScene}
              onSave={handleSaveScene}
              onGenerateImage={handleGenerateImage}
            />
          ) : (
            <CharacterEditor
              character={currentCharacter}
              onSave={handleSaveCharacter}
              onGenerateImage={handleGenerateImage}
            />
          )}
        </div>
        
        {/* Preview panel */}
        <div className="w-full md:w-1/3 bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold mb-3">Preview</h2>
          
          {generatedImageUrl ? (
            <div className="mb-4">
              <img
                src={generatedImageUrl}
                alt={activeTab === 'story' ? currentScene.title : currentCharacter.name}
                className="w-full h-auto rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                Generated image for {activeTab === 'story' ? currentScene.title : currentCharacter.name}
              </p>
            </div>
          ) : (
            <div className="bg-gray-100 rounded p-8 flex items-center justify-center mb-4">
              <p className="text-gray-500">
                Generated image will appear here
              </p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">
              {activeTab === 'story' ? 'Scene Information' : 'Character Information'}
            </h3>
            
            {activeTab === 'story' ? (
              <div className="space-y-2">
                <p><span className="font-medium">Title:</span> {currentScene.title}</p>
                <p><span className="font-medium">Setting:</span> {currentScene.setting}</p>
                <p><span className="font-medium">Mood:</span> {currentScene.mood}</p>
                <p><span className="font-medium">Characters:</span> {
                  currentScene.characters.map(charId => 
                    story.characters[charId]?.name
                  ).join(', ')
                }</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {currentCharacter.name}</p>
                <p><span className="font-medium">Traits:</span> {currentCharacter.traits.join(', ')}</p>
                <p>
                  <span className="font-medium">Appearance:</span> {
                    [
                      currentCharacter.attributes.age,
                      currentCharacter.attributes.gender,
                      currentCharacter.attributes.height,
                      currentCharacter.attributes.build
                    ].filter(Boolean).join(', ')
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 