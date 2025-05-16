
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, messagingApi } from '@/backend/messaging-api';
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageCircle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Client } from '@/types/client';

interface PatientAttorneyChatProps {
  client?: Client;
  isVisible: boolean;
}

const PatientAttorneyChat: React.FC<PatientAttorneyChatProps> = ({ client, isVisible }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const recipientId = 'attorney1'; // Default attorney ID
  const attorneyName = 'Jane Doelawyer'; // Default attorney name
  // Define messagesEndRef outside of any conditional
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      fetchMessages();
    }
  }, [isVisible]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await messagingApi.getMessages('chat');
      // Filter messages for patient-attorney conversation only
      const patientAttorneyMessages = fetchedMessages.filter(
        msg => (msg.senderId === client?.id && msg.recipientId === recipientId) ||
              (msg.senderId === recipientId && msg.recipientId === client?.id)
      );
      setMessages(patientAttorneyMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Always scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isVisible) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isVisible]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !client) return;

    try {
      const message = await messagingApi.sendMessage({
        senderId: client.id,
        recipientId: recipientId,
        content: newMessage,
        isRead: false,
        type: 'chat'
      });
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Show notification that message was sent to attorney
      toast({
        title: `Message Sent to ${attorneyName}`,
        description: "Your attorney will be notified of your message.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If not visible, return null early but after all hooks are defined
  if (!isVisible) {
    return null;
  }

  return (
    <Card className="mt-6" id="patient-attorney-chat">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat with Attorney - {attorneyName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-10 w-[300px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>No messages yet. Start a conversation with your attorney!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex items-start gap-2 ${message.senderId === client?.id ? 'justify-end' : ''}`}>
                    {message.senderId !== client?.id && (
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${message.senderId}`} />
                        <AvatarFallback>AT</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] ${message.senderId === client?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.senderId !== client?.id && ' - Attorney'}
                      </p>
                    </div>
                    {message.senderId === client?.id && (
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${client.id}`} />
                        <AvatarFallback>{client.fullName?.substring(0, 2) || 'CL'}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 flex gap-2 border-t">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || !client}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !client || !newMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAttorneyChat;
