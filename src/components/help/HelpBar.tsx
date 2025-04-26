
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { HelpNotificationIndicator } from './HelpNotificationIndicator';

export function HelpBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('support_requests')
        .insert([
          {
            user_id: user.id,
            subject,
            message,
            status: 'open',
            priority: 'normal'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Support request sent",
        description: "We'll get back to you as soon as possible.",
      });

      setSubject('');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700 text-white p-0"
        >
          <MessageCircle className="h-6 w-6" />
          <HelpNotificationIndicator />
        </Button>
      ) : (
        <Card className="w-80 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Need Help?</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
            <textarea
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[100px]"
              required
            />
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Send Message
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
