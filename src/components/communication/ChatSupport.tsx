
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, ChevronUp, Send, X, User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SupportMessage {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  message: string;
  is_from_user: boolean;
  created_at: string;
}

const ChatSupport = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user) {
      setName(profile?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user, profile]);
  
  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
    }
  }, [isOpen, user]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching support messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load support chat history',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };
  
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    if (!user && (!name.trim() || !email.trim())) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name and email to continue',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSending(true);
      
      const newMessage = {
        user_id: user?.id || null,
        user_email: user?.email || email,
        user_name: profile?.full_name || name,
        message: message.trim(),
        is_from_user: true,
      };
      
      const { data, error } = await supabase
        .from('support_messages')
        .insert(newMessage)
        .select();
      
      if (error) throw error;
      
      setMessages(prev => [...prev, data[0]]);
      setMessage('');
      
      // Simulate support team response
      setTimeout(() => {
        const supportResponse = {
          id: `temp-${Date.now()}`,
          user_id: user?.id || null,
          user_email: user?.email || email,
          user_name: 'Support Team',
          message: 'Thank you for your message. Our support team will get back to you as soon as possible.',
          is_from_user: false,
          created_at: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, supportResponse]);
      }, 1000);
      
      setSending(false);
    } catch (error) {
      console.error('Error sending support message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      setSending(false);
    }
  };
  
  const toggleChat = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setIsOpen(true);
    }
  };
  
  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };
  
  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized 
              ? 'bottom-6 right-6 w-auto h-auto' 
              : 'bottom-6 right-6 w-[350px] h-[500px]'
          }`}
        >
          <Card className={`w-full h-full shadow-xl flex flex-col ${isMinimized ? 'rounded-full' : 'rounded-lg'}`}>
            {isMinimized ? (
              <Button
                className="h-12 w-auto px-4 bg-red-600 hover:bg-red-700 rounded-full flex items-center"
                onClick={toggleChat}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                <span>Chat with Support</span>
              </Button>
            ) : (
              <>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
                  <div>
                    <CardTitle className="text-md flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-red-600" />
                      Support Chat
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      How can we help you today?
                    </CardDescription>
                  </div>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={toggleChat}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={closeChat}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                  {!user && (
                    <div className="mb-4 space-y-2 p-3 border rounded-lg bg-gray-50">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <div className="flex mt-1">
                          <User className="h-4 w-4 mr-2 mt-2 text-gray-500" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Your Email</Label>
                        <div className="flex mt-1">
                          <Mail className="h-4 w-4 mr-2 mt-2 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <ScrollArea className="flex-1">
                    {loading ? (
                      <div className="flex justify-center p-4">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500 flex-col">
                        <MessageCircle className="h-10 w-10 mb-2 text-gray-300" />
                        <p className="text-center text-sm">
                          No messages yet. Send a message to start a conversation with our support team.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id}
                            className={`flex ${msg.is_from_user ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.is_from_user 
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {!msg.is_from_user && (
                                <p className="text-xs font-medium mb-1">Support Team</p>
                              )}
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.is_from_user ? 'text-red-100' : 'text-gray-500'}`}>
                                {msg.created_at ? format(new Date(msg.created_at), 'h:mm a') : format(new Date(), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-3 border-t">
                  <div className="flex w-full gap-2">
                    <Textarea 
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-9 h-9 resize-none py-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="bg-red-600 hover:bg-red-700 h-9 w-9 p-0"
                      onClick={sendMessage}
                      disabled={!message.trim() || sending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

// Create a Label component locally since it wasn't imported
const Label = ({
  htmlFor,
  className,
  children,
  ...props
}: {
  htmlFor?: string,
  className?: string,
  children: React.ReactNode
} & React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default ChatSupport;
