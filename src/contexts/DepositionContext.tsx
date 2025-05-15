
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { depositionsApi } from '@/lib/api/depositions-api';
import { Deposition, DepositionStatus } from '@/types/deposition';
import { useToast } from '@/hooks/use-toast';

interface DepositionContextType {
  depositions: Deposition[];
  loading: boolean;
  error: string | null;
  refreshDepositions: () => Promise<void>;
  filterDepositions: (params: {
    search?: string;
    status?: DepositionStatus;
    clientId?: string;
    caseId?: string;
    attorneyId?: string;
  }) => Promise<Deposition[]>;
}

const DepositionContext = createContext<DepositionContextType | undefined>(undefined);

export const useDepositions = () => {
  const context = useContext(DepositionContext);
  if (!context) {
    throw new Error('useDepositions must be used within a DepositionProvider');
  }
  return context;
};

export const DepositionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [depositions, setDepositions] = useState<Deposition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshDepositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await depositionsApi.getDepositions();
      setDepositions(data);
    } catch (error) {
      console.error('Failed to fetch depositions:', error);
      setError('Failed to load depositions. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load depositions data. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDepositions = async (params: {
    search?: string;
    status?: DepositionStatus;
    clientId?: string;
    caseId?: string;
    attorneyId?: string;
  }) => {
    try {
      setLoading(true);
      const filtered = await depositionsApi.filterDepositions(params);
      return filtered;
    } catch (error) {
      console.error('Failed to filter depositions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not filter depositions. Please try again later.',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDepositions();
  }, []);

  return (
    <DepositionContext.Provider
      value={{
        depositions,
        loading,
        error,
        refreshDepositions,
        filterDepositions,
      }}
    >
      {children}
    </DepositionContext.Provider>
  );
};
