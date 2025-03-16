import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiChevronRight, FiBookOpen, FiClock, FiUser } from 'react-icons/fi';
import { generateStoryContinuation } from '../../services/ai';
import { formatDate } from '../../utils/format';

interface Choice {
  id: string;
  text: string;
}

interface StorySegment {
  id: string;
  content: string;
  choices: Choice[];
  image?: string;
}

interface StoryReaderProps {
  storyId: string;
  initialSegment: StorySegment;
  storyTitle: string;
  author: {
    name: string;
    image?: string;
  };
  genre: string;
  publishedDate: Date;
  readTime: number;
  coverImage: string;
}

const StoryReader: React.FC<StoryReaderProps> = ({
  storyId,
  initialSegment,
  storyTitle,
  author,
  genre,
  publishedDate,
  readTime,
  coverImage,
}) => {
  const [segments, setSegments] = useState<StorySegment[]>([initialSegment]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readingHistory, setReadingHistory] = useState<string[]>([]);

  const currentSegment = segments[currentSegmentIndex];

  useEffect(() => {
    // Save reading progress to local storage
    if (segments.length > 1) {
      localStorage.setItem(`story-progress-${storyId}`, JSON.stringify({
        segments,
        currentSegmentIndex,
        readingHistory,
      }));
    }
  }, [segments, currentSegmentIndex, readingHistory, storyId]);

  useEffect(() => {
    // Load reading progress from local storage
    const savedProgress = localStorage.getItem(`story-progress-${storyId}`);
    if (savedProgress) {
      try {
        const { segments: savedSegments, currentSegmentIndex: savedIndex, readingHistory: savedHistory } = JSON.parse(savedProgress);
        setSegments(savedSegments);
        setCurrentSegmentIndex(savedIndex);
        setReadingHistory(savedHistory);
      } catch (err) {
        console.error('Error loading saved progress:', err);
      }
    }
  }, [storyId]);

  const handleChoiceSelect = async (choice: Choice) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add the choice to reading history
      const updatedHistory = [...readingHistory, choice.text];
      setReadingHistory(updatedHistory);
      
      // Get the full story context up to this point
      const storyContext = segments
        .slice(0, currentSegmentIndex + 1)
        .map(segment => segment.content)
        .join('\n\n');
      
      // Generate the next segment based on the choice
      const continuationText = await generateStoryContinuation(storyContext, choice.text);
      
      // Parse the continuation text to extract content and new choices
      const { content, choices } = parseStoryResponse(continuationText);
      
      // Create a new segment
      const newSegment: StorySegment = {
        id: `segment-${segments.length}`,
        content,
        choices,
        // In a real implementation, you might want to generate an image for this segment
        image: undefined,
      };
      
      // Add the new segment and update the current index
      setSegments([...segments, newSegment]);
      setCurrentSegmentIndex(segments.length);
      
    } catch (err) {
      console.error('Error generating story continuation:', err);
      setError('Failed to generate story continuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseStoryResponse = (response: string): { content: string; choices: Choice[] } => {
    // This is a simple parser that assumes the AI response has choices at the end
    // In a real implementation, you might want to use a more robust parsing method
    
    const lines = response.split('\n');
    const choiceLines = lines.filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
    
    const content = lines
      .filter(line => !line.trim().startsWith('-') && !line.trim().startsWith('*'))
      .join('\n')
      .trim();
    
    const choices: Choice[] = choiceLines.map((line, index) => ({
      id: `choice-${index}`,
      text: line.replace(/^[-*]\s*/, '').trim(),
    }));
    
    return {
      content,
      choices: choices.length > 0 ? choices : [
        { id: 'default-1', text: 'Continue the adventure' },
        { id: 'default-2', text: 'Take a different approach' },
      ],
    };
  };

  const navigateToSegment = (index: number) => {
    if (index >= 0 && index < segments.length) {
      setCurrentSegmentIndex(index);
    }
  };

  const resetStory = () => {
    if (window.confirm('Are you sure you want to restart the story? Your progress will be lost.')) {
      setSegments([initialSegment]);
      setCurrentSegmentIndex(0);
      setReadingHistory([]);
      localStorage.removeItem(`story-progress-${storyId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Story Header */}
      <div className="mb-8">
        <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
          <Image 
            src={coverImage} 
            alt={storyTitle}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{storyTitle}</h1>
            <div className="flex items-center space-x-4">
              <span className="bg-primary-600 text-white text-sm px-3 py-1 rounded-full">{genre}</span>
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center">
                <FiBookOpen className="mr-1" />
                <span>{segments.length} segments</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image 
              src={author.image || 'https://via.placeholder.com/40'} 
              alt={author.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <div className="font-medium">{author.name}</div>
            <div className="text-sm text-gray-500">Published {formatDate(publishedDate)}</div>
          </div>
        </div>
      </div>
      
      {/* Reading Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Your Journey</h2>
          <button 
            onClick={resetStory}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Restart Story
          </button>
        </div>
        <div className="bg-gray-100 h-2 rounded-full mb-2">
          <div 
            className="bg-primary-600 h-2 rounded-full"
            style={{ width: `${(currentSegmentIndex / Math.max(segments.length - 1, 1)) * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {segments.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToSegment(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                index === currentSegmentIndex
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Story Content */}
      <div className="prose prose-lg max-w-none mb-8">
        {currentSegment.image && (
          <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden">
            <Image 
              src={currentSegment.image} 
              alt="Story scene"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        
        <div className="whitespace-pre-line">{currentSegment.content}</div>
      </div>
      
      {/* Choices */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">What will you do?</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentSegment.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                className="w-full text-left bg-white border border-gray-200 hover:border-primary-600 hover:bg-primary-50 rounded-lg p-4 transition-colors flex items-center justify-between group"
              >
                <span>{choice.text}</span>
                <FiChevronRight className="text-gray-400 group-hover:text-primary-600 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Reading History */}
      {readingHistory.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Choices</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {readingHistory.map((choice, index) => (
                <li key={index} className="flex items-start">
                  <FiUser className="mt-1 mr-2 text-primary-600" />
                  <span>{choice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryReader;