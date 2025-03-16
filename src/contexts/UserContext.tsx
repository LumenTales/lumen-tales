import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/models/User';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user data for development
  const mockUser: User = {
    id: 'user1',
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    bio: 'Interactive fiction enthusiast and aspiring creator.',
    avatarUrl: '/images/avatar.jpg',
    walletAddress: '0x1234567890abcdef',
    createdAt: new Date('2023-01-01'),
    lastLoginAt: new Date(),
    role: 'USER',
    isEmailVerified: true,
    preferences: {
      theme: 'DARK',
      emailNotifications: {
        newStories: true,
        storyUpdates: true,
        tokenActivity: true,
        marketplaceActivity: true,
        newsletter: false,
      },
      contentPreferences: {
        preferredGenres: ['Fantasy', 'Sci-Fi', 'Mystery'],
        contentFilters: [],
        readingSpeed: 'MEDIUM',
        showImagesFirst: true,
      },
      privacySettings: {
        showReadingActivity: true,
        showTokenHoldings: true,
        showProfileToPublic: true,
      },
    },
    stats: {
      totalStoriesRead: 12,
      totalChoicesMade: 87,
      totalTimeSpent: 360, // minutes
      favoriteGenres: [
        { genre: 'Fantasy', count: 5 },
        { genre: 'Sci-Fi', count: 4 },
        { genre: 'Mystery', count: 3 },
      ],
      tokensEarned: 450,
      tokensSpent: 120,
    },
    socialLinks: {
      twitter: 'johndoe',
      website: 'https://johndoe.com',
    },
  };

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call or token validation
        // const response = await fetch('/api/auth/me');
        // const data = await response.json();
        // if (data.user) {
        //   setUser(data.user);
        // }
        
        // Using mock data for now
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Authentication check failed', err);
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // if (data.user) {
      //   setUser(data.user);
      //   return true;
      // }
      // setError(data.message || 'Login failed');
      // return false;
      
      // Mock implementation
      console.log(`Logging in with email: ${email}`);
      
      // Simulate successful login
      if (email === 'john@example.com' && password === 'password') {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      
      setError('Invalid email or password');
      return false;
    } catch (err) {
      console.error('Login failed', err);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // In a real app, this would include an API call to invalidate the session
    // fetch('/api/auth/logout', { method: 'POST' });
    
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, username, password }),
      // });
      // const data = await response.json();
      // if (data.user) {
      //   setUser(data.user);
      //   return true;
      // }
      // setError(data.message || 'Registration failed');
      // return false;
      
      // Mock implementation
      console.log(`Registering with email: ${email}, username: ${username}`);
      
      // Simulate successful registration
      const newUser: User = {
        ...mockUser,
        id: `user_${Date.now()}`,
        email,
        username,
        displayName: username,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error('Registration failed', err);
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to update your profile');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();
      // if (data.user) {
      //   setUser(data.user);
      //   return true;
      // }
      // setError(data.message || 'Profile update failed');
      // return false;
      
      // Mock implementation
      console.log('Updating profile with data:', userData);
      
      // Simulate successful update
      const updatedUser = { ...user, ...userData, lastLoginAt: new Date() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      console.error('Profile update failed', err);
      setError('Profile update failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 