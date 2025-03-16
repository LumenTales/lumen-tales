import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiUser } from 'react-icons/fi';
import { formatDate } from '../../utils/format';

interface Author {
  name: string;
  image?: string;
}

interface StoryCardProps {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: Author;
  genre: string;
  publishedDate: Date;
  readTime: number;
  readersCount: number;
  isTokenized?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  description,
  coverImage,
  author,
  genre,
  publishedDate,
  readTime,
  readersCount,
  isTokenized = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48">
        <Image
          src={coverImage}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
        {isTokenized && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            NFT
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded-full mb-2">
            {genre}
          </span>
          <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          {author.image && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
              <Image
                src={author.image}
                alt={author.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <span className="text-sm text-gray-700">{author.name}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{formatDate(publishedDate)}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{readTime} min read</span>
          </div>
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>{readersCount} readers</span>
          </div>
        </div>
        
        <Link href={`/story/${id}`} className="mt-4 block text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
          Read Story
        </Link>
      </div>
    </div>
  );
};

export default StoryCard;