import React, { useState, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { Character } from '@/models/Story';

interface CharacterEditorProps {
  character?: Character;
  onSave: (character: Character) => void;
  onGenerateImage: (imageUrl: string) => void;
}

export default function CharacterEditor({
  character,
  onSave,
  onGenerateImage
}: CharacterEditorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Character['attributes']>({});
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const { loading, error, generateCharacterImage } = useAI();
  
  // Initialize editor with character data
  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description);
      setTraits(character.traits || []);
      setAttributes(character.attributes || {});
    }
  }, [character]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handleAttributeChange = (key: string, value: string) => {
    setAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleTraitAdd = (trait: string) => {
    if (trait && !traits.includes(trait)) {
      setTraits(prev => [...prev, trait]);
    }
  };
  
  const handleTraitRemove = (trait: string) => {
    setTraits(prev => prev.filter(t => t !== trait));
  };
  
  const handleEmotionChange = (emotion: string) => {
    setCurrentEmotion(emotion);
  };
  
  const handleSave = () => {
    if (!character) return;
    
    // Validate required fields
    if (!name.trim()) {
      alert('Character name is required');
      return;
    }
    
    if (!description.trim()) {
      alert('Character description is required');
      return;
    }
    
    if (traits.length === 0) {
      alert('At least one character trait is required');
      return;
    }
    
    const updatedCharacter: Character = {
      ...character,
      name,
      description,
      traits,
      attributes,
      updatedAt: Date.now()
    };
    
    onSave(updatedCharacter);
  };
  
  const handleGenerateImage = async () => {
    if (!character) return;
    
    setIsGeneratingImage(true);
    
    try {
      // Create a temporary character with current data
      const tempCharacter: Character = {
        ...character,
        name,
        description,
        traits,
        attributes
      };
      
      // Generate the image
      const result = await generateCharacterImage(
        tempCharacter,
        currentEmotion
      );
      
      if (result && result.imageUrl) {
        onGenerateImage(result.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate character image:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  // Common attribute fields
  const attributeFields = [
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'hairColor', label: 'Hair Color' },
    { key: 'eyeColor', label: 'Eye Color' },
    { key: 'skinTone', label: 'Skin Tone' },
    { key: 'height', label: 'Height' },
    { key: 'build', label: 'Build' }
  ];
  
  // Common emotions
  const emotions = [
    'neutral', 'happy', 'sad', 'angry', 'surprised',
    'afraid', 'disgusted', 'confused', 'thoughtful'
  ];
  
  // Common traits
  const commonTraits = [
    'brave', 'cautious', 'intelligent', 'strong', 'wise',
    'charming', 'loyal', 'stubborn', 'creative', 'curious',
    'optimistic', 'pessimistic', 'sensitive', 'stoic', 'reserved'
  ];
  
  if (!character) {
    return <div className="p-4">No character selected</div>;
  }
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Character Editor</h2>
      
      {/* Basic info */}
      <div className="space-y-2">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={handleNameChange}
            placeholder="Character name"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full h-24 p-2 border rounded"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe your character..."
          />
        </div>
      </div>
      
      {/* Attributes */}
      <div>
        <h3 className="font-medium mb-2">Attributes</h3>
        <div className="grid grid-cols-2 gap-2">
          {attributeFields.map(field => (
            <div key={field.key}>
              <label className="block text-sm mb-1">{field.label}</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={attributes[field.key] || ''}
                onChange={(e) => handleAttributeChange(field.key, e.target.value)}
                placeholder={field.label}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Traits */}
      <div>
        <h3 className="font-medium mb-2">Traits</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {traits.map(trait => (
            <span 
              key={trait}
              className="px-2 py-1 bg-blue-100 rounded-full flex items-center"
            >
              {trait}
              <button
                className="ml-1 text-red-500"
                onClick={() => handleTraitRemove(trait)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {commonTraits
            .filter(trait => !traits.includes(trait))
            .map(trait => (
              <button
                key={trait}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                onClick={() => handleTraitAdd(trait)}
              >
                + {trait}
              </button>
            ))}
        </div>
        
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l"
            placeholder="Add custom trait"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTraitAdd(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-r"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add custom trait"]') as HTMLInputElement;
              if (input) {
                handleTraitAdd(input.value);
                input.value = '';
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Image generation */}
      <div>
        <h3 className="font-medium mb-2">Generate Character Image</h3>
        
        <div className="mb-3">
          <label className="block text-sm mb-1">Emotion</label>
          <div className="flex flex-wrap gap-2">
            {emotions.map(emotion => (
              <button
                key={emotion}
                className={`px-3 py-1 rounded ${
                  currentEmotion === emotion
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => handleEmotionChange(emotion)}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
        
        <button
          className={`w-full py-2 rounded ${
            isGeneratingImage || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          onClick={handleGenerateImage}
          disabled={isGeneratingImage || loading}
        >
          {isGeneratingImage || loading ? 'Generating...' : 'Generate Character Image'}
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Save button */}
      <div>
        <button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Character
        </button>
      </div>
    </div>
  );
} 