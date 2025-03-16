import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Story, StoryProgress, Scene, Choice } from '@/models/Story';

interface StoryContextType {
  stories: Story[];
  currentStory: Story | null;
  currentScene: Scene | null;
  progress: StoryProgress | null;
  loading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  fetchStory: (storyId: string) => Promise<void>;
  startStory: (storyId: string) => Promise<void>;
  makeChoice: (choiceId: string) => Promise<void>;
  resetProgress: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockStories: Story[] = [
    {
      id: 'story1',
      title: 'The Lost Key',
      description: 'An adventure of discovery and mystery in a forgotten city.',
      coverImageUrl: '/images/story1.jpg',
      author: {
        id: 'author1',
        name: 'Elena Rivers',
        avatarUrl: '/images/authors/elena.jpg',
      },
      genre: ['Adventure'],
      tags: ['mystery', 'ancient', 'treasure'],
      tokenValue: 250,
      totalReads: 1243,
      rating: 4.7,
      publishedAt: new Date('2023-05-15').getTime(),
      updatedAt: new Date('2023-06-20').getTime(),
      characters: {
        char1: {
          id: 'char1',
          name: 'Alex Morgan',
          description: 'A curious archaeologist with a knack for finding trouble.',
          imageUrl: '/images/characters/alex.jpg',
          traits: ['intelligent', 'courageous', 'charismatic'],
          attributes: {
            intelligence: '8',
            courage: '7',
            charisma: '6',
          },
          emotions: {
            happy: '/images/characters/alex_happy.jpg',
            sad: '/images/characters/alex_sad.jpg',
            surprised: '/images/characters/alex_surprised.jpg',
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          creatorId: 'author1',
        },
        char2: {
          id: 'char2',
          name: 'Professor Eliza Chen',
          description: 'A brilliant historian with knowledge of ancient civilizations.',
          imageUrl: '/images/characters/eliza.jpg',
          traits: ['intelligent', 'wise', 'patient'],
          attributes: {
            intelligence: '9',
            wisdom: '8',
            patience: '6',
          },
          emotions: {
            happy: '/images/characters/eliza_happy.jpg',
            concerned: '/images/characters/eliza_concerned.jpg',
            excited: '/images/characters/eliza_excited.jpg',
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          creatorId: 'author1',
        },
      },
      scenes: {
        scene1: {
          id: 'scene1',
          title: 'The Discovery',
          content: 'You stand at the entrance of the ancient temple, the stone door partially ajar. A faint glow emanates from within, casting long shadows across the jungle floor. Professor Chen looks at you expectantly.',
          imageUrl: '/images/scenes/temple_entrance.jpg',
          backgroundImageUrl: '/images/backgrounds/jungle.jpg',
          characters: ['char1', 'char2'],
          setting: 'Ancient Temple',
          time: 'Dusk',
          mood: 'Mysterious',
          childrenIds: ['scene2'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          creatorId: 'author1',
          metadata: {
            tags: ['temple', 'jungle', 'discovery'],
            complexity: 3,
            emotionalTone: 'suspenseful',
            visualElements: ['temple', 'jungle', 'sunset']
          },
          choices: [
            {
              id: 'choice1',
              text: 'Enter the temple cautiously',
              nextSceneId: 'scene2',
            },
            {
              id: 'choice2',
              text: 'Examine the door markings first',
              nextSceneId: 'scene3',
            },
            {
              id: 'choice3',
              text: 'Ask Professor Chen for her opinion',
              nextSceneId: 'scene4',
            },
          ],
        },
        scene2: {
          id: 'scene2',
          title: 'Into the Unknown',
          content: 'You step carefully into the temple, the air thick with dust and mystery. The stone floor creaks beneath your feet, and Professor Chen follows closely behind. The glow grows stronger as you advance deeper.',
          imageUrl: '/images/scenes/temple_interior.jpg',
          backgroundImageUrl: '/images/backgrounds/temple.jpg',
          characters: ['char1', 'char2'],
          setting: 'Ancient Temple',
          time: 'Dusk',
          mood: 'Mysterious',
          childrenIds: ['scene5'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          creatorId: 'author1',
          metadata: {
            tags: ['temple', 'jungle', 'discovery'],
            complexity: 3,
            emotionalTone: 'suspenseful',
            visualElements: ['temple', 'jungle', 'sunset']
          },
          choices: [
            {
              id: 'choice4',
              text: 'Follow the light source',
              nextSceneId: 'scene5',
            },
            {
              id: 'choice5',
              text: 'Inspect the wall carvings',
              nextSceneId: 'scene6',
            },
          ],
        },
        // More scenes would be defined here
      },
      startingSceneId: 'scene1',
      variables: {
        hasMap: false,
        foundArtifacts: 0,
        relationshipWithEliza: 0,
      },
    },
    // More stories would be defined here
  ];

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll just use the mock data
      setStories(mockStories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stories';
      setError(errorMessage);
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStory = async (storyId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll just use the mock data
      const story = mockStories.find(s => s.id === storyId);
      
      if (!story) {
        throw new Error(`Story with ID ${storyId} not found`);
      }
      
      setCurrentStory(story);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch story';
      setError(errorMessage);
      console.error(`Error fetching story ${storyId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const startStory = async (storyId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the story first
      await fetchStory(storyId);
      
      if (!currentStory) {
        throw new Error('Failed to load story');
      }
      
      // Initialize progress
      const initialSceneId = currentStory.rootSceneId || currentStory.startingSceneId;
      
      if (!initialSceneId) {
        throw new Error('Story has no starting scene');
      }
      
      const initialScene = currentStory.scenes[initialSceneId];
      
      if (!initialScene) {
        throw new Error(`Starting scene ${initialSceneId} not found`);
      }
      
      // Create new progress object
      const newProgress: StoryProgress = {
        userId: 'current-user', // In a real app, this would be the actual user ID
        storyId,
        currentSceneId: initialSceneId,
        visitedScenes: [initialSceneId],
        characterStates: {},
        variables: currentStory.variables || {},
        choiceHistory: [],
        tokensSpent: 0,
        completedEndings: [],
        lastReadAt: new Date()
      };
      
      setProgress(newProgress);
      setCurrentScene(initialScene);
      
      // Save progress to localStorage
      localStorage.setItem(`story_progress_${storyId}`, JSON.stringify(newProgress));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start story';
      setError(errorMessage);
      console.error(`Error starting story ${storyId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const makeChoice = async (choiceId: string) => {
    if (!currentStory || !currentScene || !progress) {
      setError('No active story or scene');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Find the choice in the current scene
      const choice = currentScene.choices?.find(c => c.id === choiceId);
      
      if (!choice) {
        throw new Error(`Choice ${choiceId} not found in current scene`);
      }
      
      // Get the next scene
      const nextScene = currentStory.scenes[choice.nextSceneId];
      
      if (!nextScene) {
        throw new Error(`Next scene ${choice.nextSceneId} not found`);
      }
      
      // Update progress
      const updatedProgress: StoryProgress = {
        ...progress,
        currentSceneId: nextScene.id,
        visitedScenes: [...progress.visitedScenes, nextScene.id],
        choiceHistory: [
          ...progress.choiceHistory,
          {
            sceneId: currentScene.id,
            choiceId,
            timestamp: new Date()
          }
        ],
        lastReadAt: new Date()
      };
      
      // Apply any consequences from the choice
      if (choice.consequences) {
        // Update character states
        if (choice.consequences.characterChanges) {
          Object.entries(choice.consequences.characterChanges).forEach(([charId, changes]) => {
            updatedProgress.characterStates[charId] = {
              ...(updatedProgress.characterStates[charId] || {}),
              ...changes
            };
          });
        }
        
        // Update variables
        if (choice.consequences.variableChanges) {
          updatedProgress.variables = {
            ...updatedProgress.variables,
            ...choice.consequences.variableChanges
          };
        }
      }
      
      setProgress(updatedProgress);
      setCurrentScene(nextScene);
      
      // Save progress to localStorage
      localStorage.setItem(`story_progress_${currentStory.id}`, JSON.stringify(updatedProgress));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process choice';
      setError(errorMessage);
      console.error(`Error processing choice ${choiceId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const resetProgress = () => {
    if (!currentStory) {
      return;
    }
    
    // Remove progress from localStorage
    localStorage.removeItem(`story_progress_${currentStory.id}`);
    
    // Reset to starting scene
    setProgress(null);
    setCurrentScene(currentStory.scenes[currentStory.startingSceneId]);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const value = {
    stories,
    currentStory,
    currentScene,
    progress,
    loading,
    error,
    fetchStories,
    fetchStory,
    startStory,
    makeChoice,
    resetProgress,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}; 