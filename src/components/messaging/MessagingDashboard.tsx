import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Send, PaperclipIcon, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileUploader from "../file-management/FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';

// Message interface
interface Message {
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

interface MessageAttachment {
  id: string;
  name: string;
  url: string;
}

// Contact interface
interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  lastActive?: string;
  avatarUrl?: string;
  unreadCount: number;
}

// Mock data for contacts
const mockAttorneys: Contact[] = [
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

const mockClients: Contact[] = [
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

// Mock message history
const mockMessages: Record<string, Message[]> = {
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

// Add getUserDisplayName helper function to handle user name format
const getUserDisplayName = (user: any) => {
  if (!user) return "";
  // Try different ways to get the user's name
  return user.name || 
         (user.user_metadata?.first_name ? 
          `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 
          user.email?.split('@')[0] || '');
};

const MessagingDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [messageAttachments, setMessageAttachments] = useState<MessageAttachment[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "attorneys" | "clients">("all");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessage = () => {
    if (!currentUser || !selectedContact || !newMessage.trim()) return;
    
    // Create new message
    const newMsg: Message = {
      id: uuidv4(),
      senderId: currentUser.id,
      senderName: getUserDisplayName(currentUser),
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
    if (mockMessages[conversationKey]) {
      mockMessages[conversationKey].push(newMsg);
    } else {
      mockMessages[conversationKey] = [newMsg];
    }
    
    // Update messages state
    setMessages([...messages, newMsg]);
    
    // Clear input and attachments
    setNewMessage("");
    setMessageAttachments([]);
    
    // Scroll to bottom
    scrollToBottom();
    
    toast({
      title: "Message Sent",
      description: `Your message to ${selectedContact.name} has been sent.`,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAttachmentComplete = (fileId: string) => {
    // In a real app, this would add the file attachment to the message
    setMessageAttachments([
      ...messageAttachments,
      {
        id: fileId,
        name: `Attachment_${messageAttachments.length + 1}`,
        url: "#"
      }
    ]);
    
    setIsAttachmentDialogOpen(false);
    
    toast({
      title: "Attachment Added",
      description: "The attachment has been added to your message.",
    });
  };

  const removeAttachment = (attachmentId: string) => {
    setMessageAttachments(messageAttachments.filter(a => a.id !== attachmentId));
  };

  const filteredContacts = contacts.filter(contact => {
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

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  const formatDate = (timestamp: string) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (role: string) => {
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden border h-[calc(100vh-12rem)]">
        {/* Contacts Sidebar */}
        <div className="w-full lg:w-80 border-r bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="w-full p-0 h-12 rounded-none">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="attorneys" className="flex-1">Attorneys</TabsTrigger>
              <TabsTrigger value="clients" className="flex-1">Clients</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[calc(100vh-15.5rem)]">
              <TabsContent value="all" className="m-0">
                {filteredContacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No contacts found.</div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                        selectedContact?.id === contact.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatarUrl} />
                        <AvatarFallback className={getAvatarColor(contact.role)}>
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          {contact.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="attorneys" className="m-0">
                {filteredContacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No attorneys found.</div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                        selectedContact?.id === contact.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatarUrl} />
                        <AvatarFallback className="bg-blue-500">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          {contact.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="clients" className="m-0">
                {filteredContacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No clients found.</div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                        selectedContact?.id === contact.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatarUrl} />
                        <AvatarFallback className="bg-green-500">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          {contact.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedContact ? (
            <>
              {/* Contact Header */}
              <div className="p-4 border-b bg-white flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatarUrl} />
                  <AvatarFallback className={getAvatarColor(selectedContact.role)}>
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedContact.role.charAt(0).toUpperCase() + selectedContact.role.slice(1)} • {selectedContact.email}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <User className="h-12 w-12 mb-2 text-gray-400" />
                    <p>No messages yet with {selectedContact.name}.</p>
                    <p className="text-sm">Send a message to start the conversation.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg, index) => {
                      const isCurrentUser = currentUser && msg.senderId === currentUser.id;
                      const prevMsg = index > 0 ? messages[index - 1] : null;
                      const showDate = !prevMsg || formatDate(prevMsg.timestamp) !== formatDate(msg.timestamp);
                      
                      return (
                        <div key={msg.id} className="space-y-4">
                          {showDate && (
                            <div className="flex justify-center">
                              <span className="text-xs bg-gray-200 rounded-full px-3 py-1 text-gray-600">
                                {formatDate(msg.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                            <div className="flex items-start max-w-[70%]">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarImage src={selectedContact.avatarUrl} />
                                  <AvatarFallback className={getAvatarColor(msg.senderRole)}>
                                    {getInitials(msg.senderName)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div>
                                <div 
                                  className={`rounded-lg p-4 ${
                                    isCurrentUser 
                                      ? "bg-blue-500 text-white" 
                                      : "bg-white border"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                  
                                  {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-opacity-20">
                                      {msg.attachments.map((attachment) => (
                                        <div 
                                          key={attachment.id} 
                                          className={`flex items-center rounded-md p-2 mb-1 ${
                                            isCurrentUser ? "bg-blue-600" : "bg-gray-100"
                                          }`}
                                        >
                                          <PaperclipIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                          <span className="text-sm truncate">{attachment.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? "text-right" : ""}`}>
                                  {formatTime(msg.timestamp)}
                                  {isCurrentUser && (
                                    <span className="ml-2">
                                      {msg.isRead ? "Read" : "Delivered"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                {messageAttachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {messageAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1"
                      >
                        <PaperclipIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm truncate max-w-[150px]">
                          {attachment.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1 rounded-full"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <Trash2 className="h-3 w-3 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <PaperclipIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Attachment</DialogTitle>
                      </DialogHeader>
                      
                      <div className="mt-4">
                        <FileUploader 
                          category="Message Attachments"
                          onUploadComplete={handleAttachmentComplete}
                          associatedId={currentUser?.id}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() && messageAttachments.length === 0}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <User className="h-16 w-16 mb-4 text-gray-400" />
              <h3 className="text-xl font-medium">No conversation selected</h3>
              <p className="mt-2">Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingDashboard;
