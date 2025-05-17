
import { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Contact, formatDate, getAvatarColor, getInitials } from '../utils/messageTypes';
import MessageItem from './MessageItem';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  selectedContact: Contact | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, selectedContact }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!selectedContact) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/70">
        <User className="h-16 w-16 mb-4 text-white/50" />
        <h3 className="text-xl font-medium text-white">No conversation selected</h3>
        <p className="mt-2 text-white/70">Select a contact to start messaging</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/70">
        <User className="h-12 w-12 mb-2 text-white/50" />
        <p>No messages yet with {selectedContact.name}.</p>
        <p className="text-sm">Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {messages.map((message, index) => {
          const isCurrentUser = currentUser && message.senderId === currentUser.id;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showDate = !prevMessage || formatDate(prevMessage.timestamp) !== formatDate(message.timestamp);
          const date = formatDate(message.timestamp);
          
          return (
            <MessageItem 
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              showDate={showDate}
              date={date}
              contactAvatar={selectedContact.avatarUrl}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
