
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/backend/settings-api';
import { settingsApi } from '@/backend';

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      // Using user1 as the default user ID for demo
      const userId = 'user1';
      const profile = await settingsApi.getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    try {
      const updated = await settingsApi.updateUserProfile(userProfile.userId, data);
      if (updated) {
        setUserProfile(updated);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    setIsLoading(true);
    await fetchUserProfile();
  };

  return (
    <UserContext.Provider value={{ userProfile, isLoading, updateUserProfile, refreshUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
