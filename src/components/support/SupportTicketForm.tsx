import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';

const SupportTicketForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a support ticket.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('support_requests')
        .insert([
          {
            user_id: user.id,
            subject: subject.trim(),
            message: message.trim(),
            status: 'open',
            priority: 'normal',
          }
        ]);

      if (error) throw error;

      toast({
        title: "Ticket Submitted",
        description: "Your support ticket has been created successfully. We'll respond soon!",
      });

      setSubject('');
      setMessage('');
    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Submit a Support Ticket</CardTitle>
        <CardDescription>
          Fill out the form below and our support team will get back to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Provide detailed information about your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="min-h-[150px]"
              maxLength={2000}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
            <Send className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportTicketForm;
