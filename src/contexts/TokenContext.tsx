import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenBalance, TokenTransaction } from '@/models/Token';

interface TokenContextType {
  balances: TokenBalance[];
  transactions: TokenTransaction[];
  loading: boolean;
  error: string | null;
  fetchBalances: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  transferTokens: (
    toUserId: string,
    tokenType: 'LUMEN' | 'STORY' | 'CHARACTER',
    amount: number,
    tokenId?: string
  ) => Promise<boolean>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockBalances: TokenBalance[] = [
    {
      userId: 'user1',
      tokenType: 'LUMEN',
      balance: 1000,
      lastUpdated: new Date(),
    },
    {
      userId: 'user1',
      tokenType: 'STORY',
      tokenId: 'story1',
      balance: 5,
      lastUpdated: new Date(),
    },
    {
      userId: 'user1',
      tokenType: 'CHARACTER',
      tokenId: 'character1',
      balance: 1,
      lastUpdated: new Date(),
    },
  ];

  const mockTransactions: TokenTransaction[] = [
    {
      id: 'tx1',
      fromUserId: null,
      toUserId: 'user1',
      tokenType: 'LUMEN',
      amount: 1000,
      transactionType: 'MINT',
      timestamp: new Date(),
      status: 'COMPLETED',
    },
    {
      id: 'tx2',
      fromUserId: null,
      toUserId: 'user1',
      tokenType: 'STORY',
      tokenId: 'story1',
      amount: 5,
      transactionType: 'MINT',
      timestamp: new Date(),
      status: 'COMPLETED',
    },
  ];

  const fetchBalances = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/tokens/balances');
      // const data = await response.json();
      // setBalances(data);
      
      // Using mock data for now
      setBalances(mockBalances);
    } catch (err) {
      setError('Failed to fetch token balances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/tokens/transactions');
      // const data = await response.json();
      // setTransactions(data);
      
      // Using mock data for now
      setTransactions(mockTransactions);
    } catch (err) {
      setError('Failed to fetch token transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const transferTokens = async (
    toUserId: string,
    tokenType: 'LUMEN' | 'STORY' | 'CHARACTER',
    amount: number,
    tokenId?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/tokens/transfer', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     toUserId,
      //     tokenType,
      //     amount,
      //     tokenId,
      //   }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   await fetchBalances();
      //   await fetchTransactions();
      //   return true;
      // }
      // return false;
      
      // Mock implementation
      console.log(`Transferring ${amount} ${tokenType} tokens to ${toUserId}`);
      if (tokenId) {
        console.log(`Token ID: ${tokenId}`);
      }
      
      // Simulate successful transfer
      const newTransaction: TokenTransaction = {
        id: `tx${transactions.length + 1}`,
        fromUserId: 'user1', // Current user
        toUserId,
        tokenType,
        tokenId,
        amount,
        transactionType: 'TRANSFER',
        timestamp: new Date(),
        status: 'COMPLETED',
      };
      
      setTransactions([...transactions, newTransaction]);
      
      // Update balances
      const updatedBalances = [...balances];
      const balanceIndex = updatedBalances.findIndex(
        (b) => b.tokenType === tokenType && (tokenId ? b.tokenId === tokenId : !b.tokenId)
      );
      
      if (balanceIndex >= 0) {
        updatedBalances[balanceIndex] = {
          ...updatedBalances[balanceIndex],
          balance: updatedBalances[balanceIndex].balance - amount,
          lastUpdated: new Date(),
        };
        setBalances(updatedBalances);
      }
      
      return true;
    } catch (err) {
      setError('Failed to transfer tokens');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
    fetchTransactions();
  }, []);

  const value = {
    balances,
    transactions,
    loading,
    error,
    fetchBalances,
    fetchTransactions,
    transferTokens,
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}; 