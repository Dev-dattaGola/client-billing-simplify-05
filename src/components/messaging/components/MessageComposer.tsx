
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, PaperclipIcon, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileUploader from "../../file-management/FileUploader";

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
  messageAttachments: { id: string; name: string; url: string; }[];
  onAttachmentComplete: (fileId: string) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  currentUserId?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  messageAttachments,
  onAttachmentComplete,
  onRemoveAttachment,
  currentUserId
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);

  const handleSend = () => {
    if (!newMessage.trim() && messageAttachments.length === 0) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleAttachment = (fileId: string) => {
    onAttachmentComplete(fileId);
    setIsAttachmentDialogOpen(false);
  };

  return (
    <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-lg">
      {messageAttachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {messageAttachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center bg-white/10 rounded-full pl-3 pr-2 py-1 text-white"
            >
              <PaperclipIcon className="h-4 w-4 mr-1" />
              <span className="text-sm truncate max-w-[150px]">
                {attachment.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onRemoveAttachment(attachment.id)}
                type="button"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10" type="button">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Add Attachment</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <FileUploader 
                category="Message Attachments"
                onUploadComplete={handleAttachment}
                associatedId={currentUserId}
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
              handleSend();
            }
          }}
          className="flex-1 bg-white/10 border-white/20 text-white"
        />
        
        <Button 
          onClick={handleSend}
          disabled={!newMessage.trim() && messageAttachments.length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          type="button"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;
