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
      genre: 'Adventure',
      tags: ['mystery', 'ancient', 'treasure'],
      tokenValue: 250,
      totalReads: 1243,
      rating: 4.7,
      publishedAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-06-20'),
      characters: {
        char1: {
          id: 'char1',
          name: 'Alex Morgan',
          description: 'A curious archaeologist with a knack for finding trouble.',
          imageUrl: '/images/characters/alex.jpg',
          traits: {
            intelligence: 8,
            courage: 7,
            charisma: 6,
          },
          emotions: {
            happy: '/images/characters/alex_happy.jpg',
            sad: '/images/characters/alex_sad.jpg',
            surprised: '/images/characters/alex_surprised.jpg',
          },
        },
        char2: {
          id: 'char2',
          name: 'Professor Eliza Chen',
          description: 'A brilliant historian with knowledge of ancient civilizations.',
          imageUrl: '/images/characters/eliza.jpg',
          traits: {
            intelligence: 9,
            wisdom: 8,
            patience: 6,
          },
          emotions: {
            happy: '/images/characters/eliza_happy.jpg',
            concerned: '/images/characters/eliza_concerned.jpg',
            excited: '/images/characters/eliza_excited.jpg',
          },
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
      // const response = await fetch('/api/stories');
      // const data = await response.json();
      // setStories(data);
      
      // Using mock data for now
      setStories(mockStories);
    } catch (err) {
      setError('Failed to fetch stories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStory = async (storyId: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/stories/${storyId}`);
      // const data = await response.json();
      // setCurrentStory(data);
      
      // Using mock data for now
      const story = mockStories.find(s => s.id === storyId);
      if (story) {
        setCurrentStory(story);
        
        // Check if there's saved progress
        const savedProgress = localStorage.getItem(`story_progress_${storyId}`);
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress) as StoryProgress;
          setProgress(parsedProgress);
          
          // Set current scene based on progress
          const currentScene = story.scenes[parsedProgress.currentSceneId];
          if (currentScene) {
            setCurrentScene(currentScene);
          } else {
            // If scene not found, start from beginning
            setCurrentScene(story.scenes[story.startingSceneId]);
          }
        } else {
          // No progress, start from beginning
          setCurrentScene(story.scenes[story.startingSceneId]);
        }
      } else {
        setError('Story not found');
      }
    } catch (err) {
      setError('Failed to fetch story');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startStory = async (storyId: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would include API calls to fetch the story and create progress
      // const storyResponse = await fetch(`/api/stories/${storyId}`);
      // const storyData = await storyResponse.json();
      // setCurrentStory(storyData);
      
      // const progressResponse = await fetch('/api/progress', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ storyId }),
      // });
      // const progressData = await progressResponse.json();
      // setProgress(progressData);
      // setCurrentScene(storyData.scenes[storyData.startingSceneId]);
      
      // Using mock data for now
      const story = mockStories.find(s => s.id === storyId);
      if (story) {
        setCurrentStory(story);
        
        // Create new progress
        const newProgress: StoryProgress = {
          userId: 'user1', // Current user
          storyId,
          currentSceneId: story.startingSceneId,
          visitedScenes: [story.startingSceneId],
          characterStates: {},
          variables: { ...story.variables },
          choiceHistory: [],
          tokensSpent: 0,
          completedEndings: [],
          lastReadAt: new Date(),
        };
        
        setProgress(newProgress);
        setCurrentScene(story.scenes[story.startingSceneId]);
        
        // Save progress to localStorage
        localStorage.setItem(`story_progress_${storyId}`, JSON.stringify(newProgress));
      } else {
        setError('Story not found');
      }
    } catch (err) {
      setError('Failed to start story');
      console.error(err);
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
      // Find the selected choice
      const choice = currentScene.choices.find(c => c.id === choiceId);
      if (!choice) {
        setError('Invalid choice');
        return;
      }

      // In a real app, this would include an API call to update progress
      // const response = await fetch('/api/progress', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     storyId: currentStory.id,
      //     choiceId,
      //   }),
      // });
      // const data = await response.json();
      // setProgress(data.progress);
      // setCurrentScene(currentStory.scenes[data.progress.currentSceneId]);
      
      // Mock implementation
      // Update progress
      const nextScene = currentStory.scenes[choice.nextSceneId];
      if (!nextScene) {
        setError('Next scene not found');
        return;
      }

      // Apply choice consequences if any
      let updatedVariables = { ...progress.variables };
      let updatedCharacterStates = { ...progress.characterStates };
      
      if (choice.consequences) {
        // Update variables
        if (choice.consequences.variableChanges) {
          updatedVariables = {
            ...updatedVariables,
            ...choice.consequences.variableChanges,
          };
        }
        
        // Update character states
        if (choice.consequences.characterChanges) {
          Object.entries(choice.consequences.characterChanges).forEach(([charId, changes]) => {
            updatedCharacterStates[charId] = {
              ...(updatedCharacterStates[charId] || {}),
              ...changes,
            };
          });
        }
      }

      // Create updated progress
      const updatedProgress: StoryProgress = {
        ...progress,
        currentSceneId: nextScene.id,
        visitedScenes: [...progress.visitedScenes, nextScene.id],
        variables: updatedVariables,
        characterStates: updatedCharacterStates,
        choiceHistory: [
          ...progress.choiceHistory,
          {
            sceneId: currentScene.id,
            choiceId,
            timestamp: new Date(),
          },
        ],
        lastReadAt: new Date(),
      };
      
      // If choice required tokens, update tokens spent
      if (choice.requiredTokens) {
        updatedProgress.tokensSpent += choice.requiredTokens;
      }
      
      setProgress(updatedProgress);
      setCurrentScene(nextScene);
      
      // Save progress to localStorage
      localStorage.setItem(`story_progress_${currentStory.id}`, JSON.stringify(updatedProgress));
    } catch (err) {
      setError('Failed to process choice');
      console.error(err);
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