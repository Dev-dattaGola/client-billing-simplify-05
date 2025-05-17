
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Message, 
  Contact, 
  mockAttorneys, 
  mockClients, 
  createMockMessages 
} from '../utils/messageTypes';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

export const useMessaging = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageAttachments, setMessageAttachments] = useState<{id: string; name: string; url: string;}[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "attorneys" | "clients">("all");
  const [mockMessages, setMockMessages] = useState<Record<string, Message[]>>(createMockMessages());
  
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadContacts();
  }, [currentUser]);

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact.id);
    }
  }, [selectedContact]);

  const loadContacts = () => {
    if (!currentUser) return;
    
    let userContacts: Contact[] = [];
    
    // If user is an attorney, show clients
    if (currentUser.role === 'attorney') {
      userContacts = [...mockClients];
    }
    // If user is a client, show assigned attorneys
    else if (currentUser.role === 'client') {
      userContacts = [...mockAttorneys];
    }
    // If user is admin, show all
    else if (['admin', 'superadmin'].includes(currentUser.role)) {
      userContacts = [...mockAttorneys, ...mockClients];
    }
    
    setContacts(userContacts);
    
    // Auto-select first contact if none selected
    if (userContacts.length > 0 && !selectedContact) {
      setSelectedContact(userContacts[0]);
    }
  };

  const loadMessages = (contactId: string) => {
    if (!currentUser) return;
    
    // Create conversation key
    const conversationKey1 = `${currentUser.id}-${contactId}`;
    const conversationKey2 = `${contactId}-${currentUser.id}`;
    
    // Check both possible conversation keys
    const conversationMessages = mockMessages[conversationKey1] || mockMessages[conversationKey2] || [];
    
    // Sort messages by timestamp
    const sortedMessages = [...conversationMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    setMessages(sortedMessages);
    
    // Mark messages as read
    markMessagesAsRead(sortedMessages);
  };

  const markMessagesAsRead = (msgs: Message[]) => {
    if (!currentUser) return;
    
    // Mark messages from the other person as read
    const updatedMessages = msgs.map(msg => {
      if (msg.senderId !== currentUser.id && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    
    // Update messages state
    setMessages(updatedMessages);
    
    // Update unread count for selected contact
    if (selectedContact) {
      setContacts(contacts.map(contact => {
        if (contact.id === selectedContact.id) {
          return { ...contact, unreadCount: 0 };
        }
        return contact;
      }));
    }
  };

  const sendMessage = (newMessage: string) => {
    if (!currentUser || !selectedContact || !newMessage.trim()) return;
    
    // Create new message
    const newMsg: Message = {
      id: uuidv4(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId: selectedContact.id,
      recipientName: selectedContact.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments: messageAttachments.length > 0 ? [...messageAttachments] : undefined
    };
    
    // Create conversation key
    const conversationKey = `${currentUser.id}-${selectedContact.id}`;
    
    // Add message to conversation
    setMockMessages(prevMockMessages => {
      const updatedMessages = { ...prevMockMessages };
      
      if (updatedMessages[conversationKey]) {
        updatedMessages[conversationKey] = [...updatedMessages[conversationKey], newMsg];
      } else {
        updatedMessages[conversationKey] = [newMsg];
      }
      
      return updatedMessages;
    });
    
    // Update messages state
    setMessages(prev => [...prev, newMsg]);
    
    // Clear attachments
    setMessageAttachments([]);
    
    toast({
      title: "Message Sent",
      description: `Your message to ${selectedContact.name} has been sent.`,
    });
    
    return true;
  };

  const handleAttachmentComplete = (fileId: string) => {
    setMessageAttachments(prev => [
      ...prev,
      {
        id: fileId,
        name: `Attachment_${prev.length + 1}`,
        url: "#"
      }
    ]);
    
    toast({
      title: "Attachment Added",
      description: "The attachment has been added to your message.",
    });
  };

  const removeAttachment = (attachmentId: string) => {
    setMessageAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const getFilteredContacts = () => {
    return contacts.filter(contact => {
      // Filter by search query
      const matchesSearch = 
        searchQuery === "" || 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by tab
      let matchesTab = true;
      if (activeTab === "attorneys") {
        matchesTab = contact.role === "attorney";
      } else if (activeTab === "clients") {
        matchesTab = contact.role === "client";
      }
      
      return matchesSearch && matchesTab;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    messageAttachments,
    activeTab,
    setActiveTab,
    filteredContacts: getFilteredContacts(),
    sendMessage,
    handleAttachmentComplete,
    removeAttachment
  };
};
