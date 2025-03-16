import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiBook, FiDollarSign, FiUsers, FiStar } from 'react-icons/fi';

import { useAuth } from '@hooks/useAuth';
import StoryCard from '@components/story/StoryCard';

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Mock data for user's stories
  const userStories = [
    {
      id: '1',
      title: 'The Crystal Caverns',
      description: 'Explore the mysterious underground world filled with magical crystals and ancient secrets.',
      coverImage: '/images/story-1.jpg',
      author: {
        id: '1',
        name: 'Elena Rivers',
        image: '/images/author-1.jpg',
      },
      genre: ['Fantasy', 'Adventure'],
      readTime: '15 min',
      rating: 4.8,
      readers: 1250,
    },
    {
      id: '2',
      title: 'Neon Shadows',
      description: 'Navigate the dangerous streets of a cyberpunk metropolis where technology and crime intertwine.',
      coverImage: '/images/story-2.jpg',
      author: {
        id: '2',
        name: 'Marcus Chen',
        image: '/images/author-2.jpg',
      },
      genre: ['Sci-Fi', 'Thriller'],
      readTime: '20 min',
      rating: 4.6,
      readers: 980,
    },
  ];
  
  // If loading or not authenticated, show loading state
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Dashboard | Lumen Tales</title>
        <meta name="description" content="Your Lumen Tales dashboard" />
      </Head>
      
      <div className="container py-8">
        <h1 className="heading-2 text-gray-900 mb-6">Dashboard</h1>
        
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-100">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <FiBook className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">My Stories</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                <FiUsers className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Readers</p>
                <p className="text-2xl font-bold text-gray-900">2,230</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
                <FiStar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.7</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">$1,250</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-3 text-gray-900">My Stories</h2>
            <button className="btn btn-primary">Create New Story</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create a New Story</h3>
              <p className="text-gray-600 mb-4">Start crafting your interactive narrative with our powerful tools.</p>
              <button className="btn btn-outline">Get Started</button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-3 text-gray-900">Recent Activity</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium">View All</button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">You earned $25.00 from "The Crystal Caverns"</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <FiUsers className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">150 new readers for "Neon Shadows"</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
                  <FiStar className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">New 5-star review on "The Crystal Caverns"</p>
                  <p className="text-sm text-gray-600">5 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                  <FiBook className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">You published "Neon Shadows"</p>
                  <p className="text-sm text-gray-600">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 