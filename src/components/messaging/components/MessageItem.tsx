
import { Message, formatTime, formatDate, getInitials, getAvatarColor } from '../utils/messageTypes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaperclipIcon } from "lucide-react";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  showDate: boolean;
  date: string;
  contactAvatar?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  isCurrentUser, 
  showDate, 
  date,
  contactAvatar 
}) => {
  return (
    <div className="space-y-4">
      {showDate && (
        <div className="flex justify-center">
          <span className="text-xs bg-white/10 rounded-full px-3 py-1 text-white/70">
            {date}
          </span>
        </div>
      )}
      
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
        <div className="flex items-start max-w-[70%]">
          {!isCurrentUser && (
            <Avatar className="h-8 w-8 mr-2 mt-1">
              <AvatarImage src={contactAvatar} />
              <AvatarFallback className={getAvatarColor(message.senderRole)}>
                {getInitials(message.senderName)}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div>
            <div 
              className={`rounded-lg p-4 ${
                isCurrentUser 
                  ? "bg-blue-500 text-white" 
                  : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  {message.attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className={`flex items-center rounded-md p-2 mb-1 ${
                        isCurrentUser ? "bg-blue-600" : "bg-white/10"
                      }`}
                    >
                      <PaperclipIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`text-xs text-white/50 mt-1 ${isCurrentUser ? "text-right" : ""}`}>
              {formatTime(message.timestamp)}
              {isCurrentUser && (
                <span className="ml-2">
                  {message.isRead ? "Read" : "Delivered"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
