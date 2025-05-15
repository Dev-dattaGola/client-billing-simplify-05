
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/backend/settings-api';
import { settingsApi } from '@/backend';
import { useAuth } from './AuthContext';

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
  const { currentUser } = useAuth();

  const fetchUserProfile = async () => {
    try {
      if (!currentUser) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      // Get the profile based on the currently logged-in user
      let userId;
      
      // Use the appropriate user ID based on the current role
      if (currentUser.role === 'client') {
        userId = 'user3'; // For the client demo user
      } else if (currentUser.role === 'attorney') {
        userId = 'user2'; // For the attorney demo user
      } else if (currentUser.role === 'admin') {
        userId = 'user4'; // For the admin demo user
      } else {
        userId = 'user1'; // Default
      }
      
      const profile = await settingsApi.getUserProfile(userId);
      
      // Update the profile with the current user's name
      if (profile && currentUser) {
        profile.name = currentUser.name;
        profile.email = currentUser.email || profile.email;
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

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
