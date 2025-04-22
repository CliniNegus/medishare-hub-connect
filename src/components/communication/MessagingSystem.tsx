
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
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

// Mock data for contacts and messages
const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    full_name: 'Jane Smith',
    email: 'jane@hospital.com',
    role: 'Hospital Admin',
    organization: 'General Hospital',
    unreadCount: 2,
    lastMessage: 'When will the shipment arrive?',
    lastMessageTime: new Date().toISOString()
  },
  {
    id: 'contact-2',
    full_name: 'John Doe',
    email: 'john@manufacturer.com',
    role: 'Manufacturer Rep',
    organization: 'Medical Devices Inc',
    unreadCount: 0,
    lastMessage: 'The order has been processed.',
    lastMessageTime: new Date(Date.now() - 3600000).toISOString()
  }
];

const mockMessages: Record<string, Message[]> = {
  'contact-1': [
    {
      id: 'msg1',
      sender_id: 'user-id',
      recipient_id: 'contact-1',
      content: 'Hello, do you have any questions about the equipment?',
      read: true,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'msg2',
      sender_id: 'contact-1',
      recipient_id: 'user-id',
      content: 'Yes, when will the shipment arrive?',
      read: false,
      created_at: new Date().toISOString(),
      sender: {
        full_name: 'Jane Smith',
        email: 'jane@hospital.com'
      }
    }
  ],
  'contact-2': [
    {
      id: 'msg3',
      sender_id: 'contact-2',
      recipient_id: 'user-id',
      content: 'I have a question about your order.',
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      sender: {
        full_name: 'John Doe',
        email: 'john@manufacturer.com'
      }
    },
    {
      id: 'msg4',
      sender_id: 'user-id',
      recipient_id: 'contact-2',
      content: 'What do you need to know?',
      read: true,
      created_at: new Date(Date.now() - 82800000).toISOString()
    },
    {
      id: 'msg5',
      sender_id: 'contact-2',
      recipient_id: 'user-id',
      content: 'The order has been processed.',
      read: true,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender: {
        full_name: 'John Doe',
        email: 'john@manufacturer.com'
      }
    }
  ]
};

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
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use mock data instead of database queries
      setContacts(mockContacts);
      
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
      
      // Use mock data
      setMessages(mockMessages[contactId] || []);
      
      setLoading(false);
      
      // Mark messages as read (in a real app, would update DB)
      if (mockMessages[contactId]) {
        // In a real implementation, this would update the database
        // Update contact list to reflect read messages
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId 
              ? { ...contact, unreadCount: 0 } 
              : contact
          )
        );
      }
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

  const sendMessage = async () => {
    if (!user || !selectedContact || !newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      
      // Create a new message object
      const newMessageObj: Message = {
        id: `msg-${Date.now()}`,
        sender_id: user.id,
        recipient_id: selectedContact.id,
        content: newMessage.trim(),
        read: false,
        created_at: new Date().toISOString()
      };
      
      // Add to local messages
      setMessages(prev => [...prev, newMessageObj]);
      
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
      
      setNewMessage('');
      setSendingMessage(false);
      
      // Simulate a response after a short delay
      if (selectedContact.id === 'contact-1') {
        setTimeout(() => {
          const responseMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            sender_id: selectedContact.id,
            recipient_id: user.id,
            content: 'Thanks for the update!',
            read: false,
            created_at: new Date().toISOString(),
            sender: {
              full_name: selectedContact.full_name,
              email: selectedContact.email
            }
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }, 3000);
      }
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
