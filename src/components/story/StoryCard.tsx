import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiStar, FiUsers } from 'react-icons/fi';

interface Author {
  id: string;
  name: string;
  image: string;
}

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    author: Author;
    genre: string[];
    readTime: string;
    rating: number;
    readers: number;
  };
  variant?: 'default' | 'compact';
}

const StoryCard: React.FC<StoryCardProps> = ({ story, variant = 'default' }) => {
  const {
    id,
    title,
    description,
    coverImage,
    author,
    genre,
    readTime,
    rating,
    readers,
  } = story;

  if (variant === 'compact') {
    return (
      <Link href={`/story/${id}`} className="block group">
        <div className="card card-hover h-full flex flex-row">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={coverImage}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-l-lg"
            />
          </div>
          <div className="p-3 flex-grow">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span className="flex items-center">
                <FiStar className="mr-1 text-yellow-500" />
                {rating}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {readTime}
              </span>
            </div>
            <div className="mt-2 flex items-center">
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="ml-2 text-xs text-gray-600">{author.name}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/story/${id}`} className="block group">
      <div className="card card-hover h-full">
        <div className="relative h-48 w-full">
          <Image
            src={coverImage}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {genre.map((g) => (
              <span
                key={g}
                className="text-xs px-2 py-1 bg-black/60 text-white rounded-full backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-700">{author.name}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <FiStar className="mr-1 text-yellow-500" />
                {rating}
              </span>
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {readTime}
              </span>
              <span className="flex items-center">
                <FiUsers className="mr-1" />
                {readers}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard; 