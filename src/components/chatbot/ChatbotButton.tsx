
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useChatbot } from '@/contexts/ChatbotContext';
import { MessageCircle, Scale } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ChatbotButton: React.FC = () => {
  const { isOpen, openChatbot, setCurrentRoute } = useChatbot();
  const location = useLocation();
  const { toast } = useToast();
  
  // Update current route when location changes
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);
  
  // Notify users about the assistant when they first visit the site
  useEffect(() => {
    const hasSeenChatNotification = localStorage.getItem('hasSeenChatNotification');
    
    if (!hasSeenChatNotification && location.pathname !== '/login') {
      setTimeout(() => {
        toast({
          title: "Legal Assistant Available",
          description: "Our AI assistant can help with all legal services.",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                openChatbot();
                localStorage.setItem('hasSeenChatNotification', 'true');
              }}
            >
              Connect
            </Button>
          )
        });
      }, 3000);
    }
  }, [location.pathname, toast, openChatbot]);
  
  // Don't show button if chatbot is already open
  if (isOpen) return null;
  
  const handleOpenChat = () => {
    openChatbot();
    // Track usage for analytics
    try {
      console.log("Chatbot opened on route: ", location.pathname);
    } catch (error) {
      console.error("Error tracking chatbot open event", error);
    }
  };
  
  const isLandingPage = location.pathname === '/' || location.pathname === '/home';
  
  return (
    <Button
      onClick={handleOpenChat}
      className="fixed bottom-8 right-8 z-40 rounded-full shadow-lg bg-lawfirm-purple hover:bg-lawfirm-purple-dark text-white p-0 h-14 w-14 flex items-center justify-center"
      aria-label="Open Legal Assistant"
    >
      {isLandingPage ? (
        <Scale className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
      <span className="sr-only">Legal Assistant</span>
    </Button>
  );
};

export default ChatbotButton;
