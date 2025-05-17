
import { v4 as uuidv4 } from 'uuid';

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  lastActive?: string;
  avatarUrl?: string;
  unreadCount: number;
}

// Helper functions
export const formatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "";
  }
};

export const formatDate = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  } catch {
    return "";
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const getAvatarColor = (role: string): string => {
  switch (role) {
    case "attorney":
      return "bg-blue-500";
    case "client":
      return "bg-green-500";
    case "admin":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

// Mock data for messages
export const createMockMessages = (): Record<string, Message[]> => {
  return {
    "attorney1-client1": [
      {
        id: uuidv4(),
        senderId: "attorney1",
        senderName: "Jane Smith",
        senderRole: "attorney",
        recipientId: "client1",
        recipientName: "John Doe",
        content: "Hello John, I wanted to update you on your case progress. We've received the medical records you sent over.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true
      },
      {
        id: uuidv4(),
        senderId: "client1",
        senderName: "John Doe",
        senderRole: "client",
        recipientId: "attorney1",
        recipientName: "Jane Smith",
        content: "Thanks for the update! Have you had a chance to review them yet?",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        isRead: true
      },
      {
        id: uuidv4(),
        senderId: "attorney1",
        senderName: "Jane Smith",
        senderRole: "attorney",
        recipientId: "client1",
        recipientName: "John Doe",
        content: "Yes, I've reviewed them. There are a few points we need to discuss. Would you be available for a call tomorrow at 2 PM?",
        timestamp: new Date(Date.now() - 2000000).toISOString(),
        isRead: false
      },
      {
        id: uuidv4(),
        senderId: "client1",
        senderName: "John Doe",
        senderRole: "client",
        recipientId: "attorney1",
        recipientName: "Jane Smith",
        content: "That works for me. I'll make sure I'm available then.",
        timestamp: new Date(Date.now() - 1000000).toISOString(),
        isRead: false
      }
    ],
    "attorney2-client2": [
      {
        id: uuidv4(),
        senderId: "attorney2",
        senderName: "Michael Johnson",
        senderRole: "attorney",
        recipientId: "client2",
        recipientName: "Sarah Williams",
        content: "Hello Sarah, I'm following up on the settlement offer we discussed last week.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: true
      },
      {
        id: uuidv4(),
        senderId: "client2",
        senderName: "Sarah Williams",
        senderRole: "client",
        recipientId: "attorney2",
        recipientName: "Michael Johnson",
        content: "Hi Michael, I'm still considering the offer. I have some concerns about the amount.",
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        isRead: true
      }
    ],
    "attorney1-client3": [
      {
        id: uuidv4(),
        senderId: "attorney1",
        senderName: "Jane Smith",
        senderRole: "attorney",
        recipientId: "client3",
        recipientName: "Robert Chen",
        content: "Hello Robert, we need to discuss your upcoming deposition. Please call me when you get a chance.",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        isRead: true
      },
      {
        id: uuidv4(),
        senderId: "client3",
        senderName: "Robert Chen",
        senderRole: "client",
        recipientId: "attorney1",
        recipientName: "Jane Smith",
        content: "I'll call you tomorrow morning. What time works for you?",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        isRead: true
      },
      {
        id: uuidv4(),
        senderId: "attorney1",
        senderName: "Jane Smith",
        senderRole: "attorney",
        recipientId: "client3",
        recipientName: "Robert Chen",
        content: "10 AM would be perfect. Talk to you then.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isRead: false
      }
    ]
  };
};

// Mock data for contacts
export const mockAttorneys: Contact[] = [
  {
    id: "attorney1",
    name: "Jane Smith",
    role: "attorney",
    email: "attorney@lyzlawfirm.com",
    lastActive: new Date().toISOString(),
    unreadCount: 2
  },
  {
    id: "attorney2",
    name: "Michael Johnson",
    role: "attorney",
    email: "michael.johnson@lyzlawfirm.com",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0
  }
];

export const mockClients: Contact[] = [
  {
    id: "client1",
    name: "John Doe",
    role: "client",
    email: "client@example.com",
    lastActive: new Date().toISOString(),
    unreadCount: 3
  },
  {
    id: "client2",
    name: "Sarah Williams",
    role: "client",
    email: "sarah.williams@example.com",
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0
  },
  {
    id: "client3",
    name: "Robert Chen",
    role: "client",
    email: "robert.chen@example.com",
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1
  }
];
