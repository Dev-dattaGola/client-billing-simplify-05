
import { Contact, Message } from '../utils/messageTypes';
import ContactHeader from './ContactHeader';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import EmptyState from './EmptyState';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationViewProps {
  selectedContact: Contact | null;
  messages: Message[];
  messageAttachments: { id: string; name: string; url: string; }[];
  onSendMessage: (message: string) => void;
  onAttachmentComplete: (fileId: string) => void;
  onRemoveAttachment: (attachmentId: string) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  selectedContact,
  messages,
  messageAttachments,
  onSendMessage,
  onAttachmentComplete,
  onRemoveAttachment
}) => {
  const { currentUser } = useAuth();

  if (!selectedContact) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-lg">
      <ContactHeader contact={selectedContact} />
      
      <MessageList 
        messages={messages} 
        selectedContact={selectedContact} 
      />
      
      <MessageComposer 
        onSendMessage={onSendMessage}
        messageAttachments={messageAttachments}
        onAttachmentComplete={onAttachmentComplete}
        onRemoveAttachment={onRemoveAttachment}
        currentUserId={currentUser?.id}
      />
    </div>
  );
};

export default ConversationView;
