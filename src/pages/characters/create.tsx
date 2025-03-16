import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CharacterBuilder from '../../components/character/CharacterBuilder';
import { useAuth } from '../../utils/auth';

const CreateCharacterPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { storyId, storyTitle } = router.query;

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>Create Character | Lumen Tales</title>
        <meta name="description" content="Create a new character NFT in the Lumen Tales universe" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Character</h1>
          <p className="text-gray-600 mt-1">Design and mint a new character NFT</p>
        </div>
        
        <CharacterBuilder 
          storyId={storyId as string} 
          storyTitle={storyTitle as string} 
        />
      </div>
    </>
  );
};

export default CreateCharacterPage; 