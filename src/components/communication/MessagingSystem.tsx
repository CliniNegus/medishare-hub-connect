import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, User } from 'lucide-react';
import { createCacheKey, fetchWithCache } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    full_name: string | null;
    email: string;
  };
}

interface Contact {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
  organization: string | null;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

const MessagingSystem = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchContacts();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('messages_updates')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        (payload) => {
          // Update contacts with new message counts
          fetchContacts();
          
          // If the message is from the currently selected contact, add it to the conversation
          if (selectedContact && payload.new.sender_id === selectedContact.id) {
            setMessages(prev => [...prev, payload.new as Message]);
            markMessagesAsRead(selectedContact.id);
          } else {
            // Otherwise, show a notification
            toast({
              title: 'New message',
              description: `You have a new message from ${payload.new.sender?.full_name || 'a contact'}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedContact]);

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch all users the current user has exchanged messages with
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select(`
          sender_id,
          recipient_id,
          content,
          created_at,
          read
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
      
      if (messageError) throw messageError;
      
      // Get unique user IDs from messages
      const userIds = new Set<string>();
      messageData?.forEach(msg => {
        if (msg.sender_id !== user.id) userIds.add(msg.sender_id);
        if (msg.recipient_id !== user.id) userIds.add(msg.recipient_id);
      });
      
      // Fetch profile data for these users
      if (userIds.size > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', Array.from(userIds));
        
        if (profileError) throw profileError;
        
        // Create contact list with unread message counts
        const contactList: Contact[] = profileData?.map(profile => {
          const unreadMessages = messageData?.filter(
            msg => msg.sender_id === profile.id && 
                  msg.recipient_id === user.id && 
                  !msg.read
          ) || [];
          
          const lastMsg = messageData
            ?.filter(msg => 
              (msg.sender_id === profile.id && msg.recipient_id === user.id) || 
              (msg.sender_id === user.id && msg.recipient_id === profile.id)
            )
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            role: profile.role,
            organization: profile.organization,
            unreadCount: unreadMessages.length,
            lastMessage: lastMsg?.content,
            lastMessageTime: lastMsg?.created_at
          };
        }) || [];
        
        // Sort contacts by last message time
        contactList.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });
        
        setContacts(contactList);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your contacts',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    if (!user || !contactId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            full_name,
            email
          )
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      setLoading(false);
      
      // Mark all messages as read
      markMessagesAsRead(contactId);
      
      // Update contact list to reflect read messages
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, unreadCount: 0 } 
            : contact
        )
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversation',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('recipient_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedContact || !newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedContact.id,
          content: newMessage.trim(),
          read: false
        })
        .select();
      
      if (error) throw error;
      
      // Add sent message to conversation
      const sentMessage = {
        ...data[0],
        sender: {
          full_name: profile?.full_name,
          email: profile?.email || user.email || ''
        }
      };
      
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      setSendingMessage(false);
      
      // Update contact with new last message
      setContacts(prev => 
        prev.map(contact => 
          contact.id === selectedContact.id 
            ? { 
                ...contact, 
                lastMessage: newMessage.trim(),
                lastMessageTime: new Date().toISOString()
              } 
            : contact
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      setSendingMessage(false);
    }
  };

  const selectContact = (contact: Contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'h:mm a');
    } else {
      return format(messageDate, 'MMM d, h:mm a');
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Messaging</CardTitle>
          <CardDescription>Please sign in to use the messaging system</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-red-600" />
          Messaging System
        </CardTitle>
        <CardDescription>
          Communicate with hospitals, manufacturers, and investors
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Contacts sidebar */}
          <div className="w-1/3 border-r border-gray-200 h-full flex flex-col">
            <div className="p-3 font-medium border-b border-gray-200">
              Contacts
            </div>
            <ScrollArea className="flex-1">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                contacts.map(contact => (
                  <div 
                    key={contact.id}
                    className={`p-3 flex items-start gap-3 hover:bg-gray-100 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''}`}
                    onClick={() => selectContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-red-100 text-red-800">
                        {(contact.full_name?.charAt(0) || contact.email.charAt(0)).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">
                          {contact.full_name || contact.email}
                        </p>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatMessageDate(contact.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {contact.role && `${contact.role} · `}
                        {contact.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <div className="bg-red-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                        {contact.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
          
          {/* Messages area */}
          <div className="w-2/3 flex flex-col h-full">
            {selectedContact ? (
              <>
                <div className="p-3 font-medium border-b border-gray-200 flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-red-100 text-red-800">
                      {(selectedContact.full_name?.charAt(0) || selectedContact.email.charAt(0)).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selectedContact.full_name || selectedContact.email}</p>
                    <p className="text-xs text-gray-500">{selectedContact.role || 'User'}</p>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map(message => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender_id === user.id 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${message.sender_id === user.id ? 'text-red-100' : 'text-gray-500'}`}>
                              {formatMessageDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 flex-col">
                <MessageCircle className="h-12 w-12 mb-2 text-gray-300" />
                <p>Select a contact to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingSystem;
