import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiPlus, FiTrash2, FiSave, FiImage, FiEdit3, FiChevronRight } from 'react-icons/fi';
import { generateStoryContinuation, generateSceneImage } from '../../services/ai';
import { mintStory } from '../../blockchain/contracts';

interface Choice {
  id: string;
  text: string;
  nextSegmentId?: string;
}

interface StorySegment {
  id: string;
  title: string;
  content: string;
  choices: Choice[];
  image?: string;
}

interface StoryMetadata {
  title: string;
  description: string;
  genre: string;
  coverImage: string;
  readTime: number;
  isPublished: boolean;
  tokenId?: string;
}

const StoryBuilder: React.FC = () => {
  const router = useRouter();
  const [metadata, setMetadata] = useState<StoryMetadata>({
    title: 'Untitled Story',
    description: '',
    genre: 'Fantasy',
    coverImage: 'https://via.placeholder.com/1200x600?text=Cover+Image',
    readTime: 10,
    isPublished: false,
  });
  
  const [segments, setSegments] = useState<StorySegment[]>([
    {
      id: 'segment-1',
      title: 'Beginning',
      content: '',
      choices: [
        { id: 'choice-1', text: 'First choice' },
        { id: 'choice-2', text: 'Second choice' },
      ],
    },
  ]);
  
  const [currentSegmentId, setCurrentSegmentId] = useState('segment-1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const currentSegment = segments.find(segment => segment.id === currentSegmentId) || segments[0];
  
  // Load story from local storage
  useEffect(() => {
    const savedStory = localStorage.getItem('story-builder-draft');
    if (savedStory) {
      try {
        const { metadata: savedMetadata, segments: savedSegments } = JSON.parse(savedStory);
        setMetadata(savedMetadata);
        setSegments(savedSegments);
      } catch (err) {
        console.error('Error loading saved story:', err);
      }
    }
  }, []);
  
  // Save story to local storage
  useEffect(() => {
    localStorage.setItem('story-builder-draft', JSON.stringify({
      metadata,
      segments,
    }));
  }, [metadata, segments]);
  
  const handleMetadataChange = (field: keyof StoryMetadata, value: string | number | boolean) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSegmentChange = (field: keyof StorySegment, value: string | Choice[]) => {
    setSegments(prev => prev.map(segment => 
      segment.id === currentSegmentId
        ? { ...segment, [field]: value }
        : segment
    ));
  };
  
  const addChoice = () => {
    const newChoiceId = `choice-${Date.now()}`;
    handleSegmentChange('choices', [
      ...currentSegment.choices,
      { id: newChoiceId, text: 'New choice' },
    ]);
  };
  
  const updateChoice = (choiceId: string, text: string) => {
    handleSegmentChange('choices', currentSegment.choices.map(choice => 
      choice.id === choiceId
        ? { ...choice, text }
        : choice
    ));
  };
  
  const removeChoice = (choiceId: string) => {
    handleSegmentChange('choices', currentSegment.choices.filter(choice => choice.id !== choiceId));
  };
  
  const addSegment = () => {
    const newSegmentId = `segment-${Date.now()}`;
    setSegments(prev => [
      ...prev,
      {
        id: newSegmentId,
        title: `Segment ${prev.length + 1}`,
        content: '',
        choices: [
          { id: `choice-${Date.now()}-1`, text: 'First choice' },
          { id: `choice-${Date.now()}-2`, text: 'Second choice' },
        ],
      },
    ]);
    setCurrentSegmentId(newSegmentId);
  };
  
  const removeSegment = (segmentId: string) => {
    if (segments.length <= 1) {
      setError('Cannot remove the only segment');
      return;
    }
    
    setSegments(prev => prev.filter(segment => segment.id !== segmentId));
    
    if (currentSegmentId === segmentId) {
      setCurrentSegmentId(segments[0].id === segmentId ? segments[1].id : segments[0].id);
    }
  };
  
  const linkChoiceToSegment = (choiceId: string, nextSegmentId: string) => {
    handleSegmentChange('choices', currentSegment.choices.map(choice => 
      choice.id === choiceId
        ? { ...choice, nextSegmentId }
        : choice
    ));
  };
  
  const generateContentWithAI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const prompt = aiPrompt || `Write a compelling ${metadata.genre} story segment about ${metadata.title}`;
      
      const generatedContent = await generateStoryContinuation(
        currentSegment.content || metadata.description,
        prompt
      );
      
      handleSegmentChange('content', generatedContent);
      setAiPrompt('');
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const imagePrompt = currentSegment.title || metadata.title;
      const imageUrl = await generateSceneImage(imagePrompt);
      
      handleSegmentChange('image', imageUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveStory = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // In a real implementation, this would save to a database
      // For now, we're just using localStorage (handled by useEffect)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Story saved successfully!');
    } catch (err) {
      console.error('Error saving story:', err);
      setError('Failed to save story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const publishStory = async () => {
    try {
      setIsPublishing(true);
      setError(null);
      
      // Prepare metadata for blockchain
      const storyMetadata = {
        title: metadata.title,
        description: metadata.description,
        genre: metadata.genre,
        coverImage: metadata.coverImage,
        segments: segments.map(segment => ({
          id: segment.id,
          title: segment.title,
          image: segment.image,
          choices: segment.choices.map(choice => ({
            id: choice.id,
            text: choice.text,
            nextSegmentId: choice.nextSegmentId,
          })),
        })),
        author: {
          // This would come from the user's profile
          name: 'Author Name',
          image: 'https://via.placeholder.com/100',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real implementation, this would upload to IPFS or another storage solution
      const uri = `ipfs://placeholder/${metadata.title.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Mint the story as an NFT
      const receipt = await mintStory(uri);
      
      // Update metadata with token ID
      setMetadata(prev => ({
        ...prev,
        isPublished: true,
        tokenId: receipt.events[0].args.tokenId.toString(),
      }));
      
      alert('Story published successfully!');
    } catch (err) {
      console.error('Error publishing story:', err);
      setError('Failed to publish story. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar - Segments */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Story Segments</h2>
            <ul className="space-y-2">
              {segments.map(segment => (
                <li key={segment.id}>
                  <button
                    onClick={() => setCurrentSegmentId(segment.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                      segment.id === currentSegmentId
                        ? 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate">{segment.title}</span>
                    {segment.id === currentSegmentId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSegment(segment.id);
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={addSegment}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-100 text-primary-800 hover:bg-primary-200 py-2 px-4 rounded-md"
            >
              <FiPlus size={16} />
              <span>Add Segment</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Story Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={metadata.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={metadata.genre}
                  onChange={(e) => handleMetadataChange('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Fantasy">Fantasy</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Horror">Horror</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Read Time (minutes)
                </label>
                <input
                  type="number"
                  value={metadata.readTime}
                  onChange={(e) => handleMetadataChange('readTime', parseInt(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-between gap-2">
                <button
                  onClick={saveStory}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white hover:bg-primary-700 py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <FiSave size={16} />
                      <span>Save</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={publishStory}
                  disabled={isPublishing}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <FiChevronRight size={16} />
                      <span>Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content - Current segment editor */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segment Title
              </label>
              <input
                type="text"
                value={currentSegment.title}
                onChange={(e) => handleSegmentChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            {currentSegment.image && (
              <div className="mb-6">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={currentSegment.image}
                    alt={currentSegment.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Segment Content
                </label>
                <button
                  onClick={generateImage}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
                >
                  <FiImage size={14} />
                  <span>Generate Image</span>
                </button>
              </div>
              <textarea
                value={currentSegment.content}
                onChange={(e) => handleSegmentChange('content', e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Write your story segment here..."
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Assistance
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Enter a prompt for AI to help with content..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={generateContentWithAI}
                  disabled={isLoading}
                  className="bg-primary-600 text-white hover:bg-primary-700 py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to generate based on the story title and genre.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Choices
                </label>
                <button
                  onClick={addChoice}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
                >
                  <FiPlus size={14} />
                  <span>Add Choice</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {currentSegment.choices.map(choice => (
                  <div key={choice.id} className="flex gap-2">
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) => updateChoice(choice.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      value={choice.nextSegmentId || ''}
                      onChange={(e) => linkChoiceToSegment(choice.id, e.target.value)}
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Link to segment...</option>
                      {segments
                        .filter(segment => segment.id !== currentSegmentId)
                        .map(segment => (
                          <option key={segment.id} value={segment.id}>
                            {segment.title}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => removeChoice(choice.id)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryBuilder; 