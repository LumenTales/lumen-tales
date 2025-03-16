import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';

// Re-export the useAuth hook from the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 