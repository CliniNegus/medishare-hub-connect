
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { X, HelpCircle, Send, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import HelpNotificationIndicator from './HelpNotificationIndicator';

const HelpBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleHelpBar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset form when opening
      setSubject('');
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store support request in Supabase
      const { error } = await supabase.from('support_requests').insert({
        user_id: user?.id,
        subject,
        message,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Help request submitted",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setSubject('');
      setMessage('');
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error submitting request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Help button - fixed at bottom right */}
      <Button 
        onClick={toggleHelpBar}
        className="fixed bottom-4 right-4 rounded-full p-3 bg-red-600 hover:bg-red-700 z-50"
        size="icon"
      >
        {isOpen ? <X /> : <HelpCircle />}
        <HelpNotificationIndicator />
      </Button>

      {/* Help sidebar panel */}
      <div 
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <h2 className="text-xl font-bold text-red-600 flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Help Desk
            </h2>
            <Button variant="ghost" size="icon" onClick={toggleHelpBar}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                required
              />
            </div>
            
            <div className="mb-4 flex-grow">
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                className="h-40 resize-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HelpBar;
