import { v4 as uuidv4 } from 'uuid';

// Settings types
export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    browser: boolean;
    sms: boolean;
  };
  language: string;
  timezone: string;
  dateFormat: string;
  updatedAt: string;
}

// Profile types
export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  title?: string;
  barNumber?: string;
  updatedAt: string;
}

// Privacy Policy types
export interface PrivacyPolicySection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface PrivacyPolicyDetails {
  id: string;
  lastUpdated: string;
  sections: PrivacyPolicySection[];
  contactInfo: {
    companyName: string;
    address: string;
    cityState: string;
    email: string;
    phone: string;
  };
}

// Mock data for user settings
const mockUserSettings: UserSettings[] = [
  {
    id: 'settings1',
    userId: 'user1',
    theme: 'light',
    notifications: {
      email: true,
      browser: true,
      sms: false
    },
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    updatedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString()
  },
  {
    id: 'settings2',
    userId: 'user2',
    theme: 'dark',
    notifications: {
      email: true,
      browser: false,
      sms: true
    },
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'DD/MM/YYYY',
    updatedAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString()
  },
  {
    id: 'settings3',
    userId: 'user3',
    theme: 'system',
    notifications: {
      email: false,
      browser: true,
      sms: false
    },
    language: 'es',
    timezone: 'America/Chicago',
    dateFormat: 'YYYY-MM-DD',
    updatedAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString()
  },
  {
    id: 'settings4',
    userId: 'user4',
    theme: 'light',
    notifications: {
      email: true,
      browser: true,
      sms: true
    },
    language: 'en',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString()
  }
];

// Mock data for user profiles
const mockUserProfiles: UserProfile[] = [
  {
    id: 'profile1',
    userId: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user1',
    phone: '(555) 123-4567',
    address: '123 Main St, City, ST 12345',
    bio: 'Senior Partner with 15 years of experience in personal injury law.',
    title: 'Senior Partner',
    barNumber: 'BAR12345',
    updatedAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString()
  },
  {
    id: 'profile2',
    userId: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user2',
    phone: '(555) 234-5678',
    address: '456 Oak St, City, ST 12345',
    bio: 'Attorney specializing in personal injury and medical malpractice cases.',
    title: 'Associate Attorney',
    barNumber: 'BAR23456',
    updatedAt: new Date(Date.now() - 45 * 24 * 3600000).toISOString()
  },
  {
    id: 'profile3',
    userId: 'user3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user3',
    phone: '(555) 345-6789',
    address: '789 Pine St, City, ST 12345',
    bio: 'Paralegal with expertise in research and case preparation.',
    title: 'Senior Paralegal',
    updatedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString()
  },
  {
    id: 'profile4',
    userId: 'user4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user4',
    phone: '(555) 456-7890',
    address: '101 Elm St, City, ST 12345',
    bio: 'Administrative assistant responsible for client communications and scheduling.',
    title: 'Administrative Assistant',
    updatedAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString()
  }
];

// Mock data for privacy policy
const mockPrivacyPolicy: PrivacyPolicyDetails = {
  id: 'privacy1',
  lastUpdated: 'April 16, 2025',
  sections: [
    {
      title: '1. Introduction',
      content: 'Welcome to LAW ERP 500. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our law firm practice management software. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.'
    },
    {
      title: '2. Information We Collect',
      content: 'We collect information that you provide directly to us when you register for an account, create or modify your profile, set preferences, or make purchases through the platform. This includes:',
      bulletPoints: [
        'Personal information such as your name, email address, phone number, and physical address',
        'Professional information such as your bar number, title, and practice areas',
        'Client information that you enter into the system',
        'Case details, documents, and related information',
        'Billing and payment information'
      ]
    },
    {
      title: '3. How We Use Your Information',
      content: 'We use the information we collect or receive:',
      bulletPoints: [
        'To facilitate account creation and the login process',
        'To provide, maintain, and improve our services',
        'To process transactions and send related information',
        'To send administrative information including confirmations, technical notices, updates, security alerts, and support messages',
        'To respond to your comments, questions, and requests',
        'To protect our services and users from fraudulent, unauthorized, or illegal activity'
      ]
    },
    {
      title: '4. Security of Your Information',
      content: 'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.'
    },
    {
      title: '5. Your Choices',
      content: 'You may at any time review or change the information in your account or terminate your account by:',
      bulletPoints: [
        'Logging into your account settings and updating your information',
        'Contacting us using the contact information provided below'
      ]
    }
  ],
  contactInfo: {
    companyName: 'LAW ERP 500',
    address: '123 Legal Avenue',
    cityState: 'Legal City, LC 12345',
    email: 'privacy@lawerp500.com',
    phone: '(555) 123-4567'
  }
};

// Settings API
export const settingsApi = {
  // User Settings Methods
  getUserSettings: async (userId: string): Promise<UserSettings | null> => {
    const settings = mockUserSettings.find(settings => settings.userId === userId);
    return settings || null;
  },

  updateUserSettings: async (userId: string, settingsData: Partial<UserSettings>): Promise<UserSettings | null> => {
    const settings = mockUserSettings.find(settings => settings.userId === userId);
    if (settings) {
      Object.assign(settings, settingsData, { updatedAt: new Date().toISOString() });
      return settings;
    }
    return null;
  },

  createUserSettings: async (settingsData: Omit<UserSettings, 'id' | 'updatedAt'>): Promise<UserSettings> => {
    const newSettings: UserSettings = {
      ...settingsData,
      id: uuidv4(),
      updatedAt: new Date().toISOString()
    };
    mockUserSettings.push(newSettings);
    return newSettings;
  },

  // User Profile Methods
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    const profile = mockUserProfiles.find(profile => profile.userId === userId);
    return profile || null;
  },

  updateUserProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
    const profile = mockUserProfiles.find(profile => profile.userId === userId);
    if (profile) {
      Object.assign(profile, profileData, { updatedAt: new Date().toISOString() });
      return profile;
    }
    return null;
  },

  createUserProfile: async (profileData: Omit<UserProfile, 'id' | 'updatedAt'>): Promise<UserProfile> => {
    const newProfile: UserProfile = {
      ...profileData,
      id: uuidv4(),
      updatedAt: new Date().toISOString()
    };
    mockUserProfiles.push(newProfile);
    return newProfile;
  },

  // Privacy Policy Methods
  getPrivacyPolicyDetails: async (): Promise<PrivacyPolicyDetails> => {
    return mockPrivacyPolicy;
  },

  updatePrivacyPolicyDetails: async (policyData: Partial<PrivacyPolicyDetails>): Promise<PrivacyPolicyDetails> => {
    Object.assign(mockPrivacyPolicy, policyData, { 
      lastUpdated: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });
    return mockPrivacyPolicy;
  }
};
