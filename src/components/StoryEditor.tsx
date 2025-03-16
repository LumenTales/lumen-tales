import React, { useState, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { Character, Scene, Story } from '@/models/Story';

interface StoryEditorProps {
  story: Story;
  currentScene?: Scene;
  onSave: (scene: Scene) => void;
  onGenerateImage: (imageUrl: string) => void;
}

export default function StoryEditor({ 
  story, 
  currentScene, 
  onSave, 
  onGenerateImage 
}: StoryEditorProps) {
  const [scene, setScene] = useState<Scene | undefined>(currentScene);
  const [content, setContent] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [emotionAnalysis, setEmotionAnalysis] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const { 
    loading, 
    error, 
    analyzeTextEmotion, 
    mapCharacterEmotion, 
    generateSceneImage,
    optimizeSceneDescription
  } = useAI();
  
  // Initialize editor with current scene
  useEffect(() => {
    if (currentScene) {
      setScene(currentScene);
      setContent(currentScene.content);
      setSelectedCharacters(currentScene.characters || []);
    }
  }, [currentScene]);
  
  // Analyze emotions when content changes
  useEffect(() => {
    if (!content || content.length < 20) return;
    
    // Analyze overall emotion of the text
    const emotion = analyzeTextEmotion(content);
    
    // Map emotions to characters
    const characterEmotions: Record<string, string> = {};
    
    if (scene) {
      selectedCharacters.forEach(charId => {
        const character = story.characters[charId];
        if (character) {
          const charEmotion = mapCharacterEmotion(character, {
            ...scene,
            content
          });
          characterEmotions[charId] = charEmotion.primaryEmotion;
        }
      });
    }
    
    setEmotionAnalysis({
      overall: emotion.primaryEmotion,
      ...characterEmotions
    });
  }, [content, selectedCharacters, scene, analyzeTextEmotion, mapCharacterEmotion, story.characters]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleCharacterToggle = (charId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(charId)
        ? prev.filter(id => id !== charId)
        : [...prev, charId]
    );
  };
  
  const handleSave = () => {
    if (!scene) return;
    
    const updatedScene: Scene = {
      ...scene,
      content,
      characters: selectedCharacters,
      updatedAt: Date.now()
    };
    
    onSave(updatedScene);
  };
  
  const handleGenerateImage = async () => {
    if (!scene) return;
    
    setIsGeneratingImage(true);
    
    try {
      // Create a map of selected characters
      const charactersMap: Record<string, Character> = {};
      selectedCharacters.forEach(charId => {
        if (story.characters[charId]) {
          charactersMap[charId] = story.characters[charId];
        }
      });
      
      // Generate the image
      const result = await generateSceneImage(
        {
          ...scene,
          content
        },
        charactersMap
      );
      
      if (result && result.imageUrl) {
        onGenerateImage(result.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const getOptimizedDescription = () => {
    if (!scene) return '';
    
    return optimizeSceneDescription({
      ...scene,
      content
    });
  };
  
  if (!scene) {
    return <div className="p-4">No scene selected</div>;
  }
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">{scene.title}</h2>
      
      {/* Scene content editor */}
      <div>
        <label className="block mb-2 font-medium">Scene Content</label>
        <textarea
          className="w-full h-64 p-2 border rounded"
          value={content}
          onChange={handleContentChange}
          placeholder="Write your scene content here..."
        />
      </div>
      
      {/* Character selection */}
      <div>
        <label className="block mb-2 font-medium">Characters in Scene</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(story.characters).map(([charId, character]) => (
            <button
              key={charId}
              className={`px-3 py-1 rounded ${
                selectedCharacters.includes(charId)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => handleCharacterToggle(charId)}
            >
              {character.name}
              {emotionAnalysis[charId] && (
                <span className="ml-2 text-xs">
                  ({emotionAnalysis[charId]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Emotion analysis */}
      {emotionAnalysis.overall && (
        <div className="p-3 bg-gray-100 rounded">
          <h3 className="font-medium">Emotion Analysis</h3>
          <p>Overall tone: <span className="font-bold">{emotionAnalysis.overall}</span></p>
        </div>
      )}
      
      {/* Optimized description for image generation */}
      <div className="p-3 bg-gray-100 rounded">
        <h3 className="font-medium">Optimized Visual Description</h3>
        <p className="text-sm italic">{getOptimizedDescription()}</p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Scene
        </button>
        
        <button
          className={`px-4 py-2 rounded ${
            isGeneratingImage || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          onClick={handleGenerateImage}
          disabled={isGeneratingImage || loading}
        >
          {isGeneratingImage || loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
    </div>
  );
} 