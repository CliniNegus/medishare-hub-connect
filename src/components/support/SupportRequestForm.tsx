
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Send, AlertCircle } from 'lucide-react';

interface SupportRequestFormProps {
  onRequestSubmitted?: () => void;
}

const SupportRequestForm: React.FC<SupportRequestFormProps> = ({ onRequestSubmitted }) => {
  const { user, profile } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_requests')
        .insert({
          user_id: user.id,
          subject: formData.subject,
          message: formData.message,
          priority: formData.priority,
          tags: [role || 'user'],
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ subject: '', message: '', priority: 'normal' });
      onRequestSubmitted?.();
    } catch (error: any) {
      console.error('Error submitting support request:', error);
      toast({
        title: "Error",
        description: "Failed to submit support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const accountTypeDisplay = {
    hospital: '🏥 Hospital',
    investor: '💼 Investor',
    manufacturer: '🏭 Manufacturer',
    admin: '⚙️ Admin'
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#E02020]" />
          Submit Support Request
        </CardTitle>
        <div className="text-sm text-gray-600">
          Account: {accountTypeDisplay[role as keyof typeof accountTypeDisplay] || role}
          {profile?.organization && ` • ${profile.organization}`}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, priority: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low - General inquiry</SelectItem>
                <SelectItem value="normal">🟡 Normal - Standard support</SelectItem>
                <SelectItem value="high">🟠 High - Important issue</SelectItem>
                <SelectItem value="urgent">🔴 Urgent - Critical problem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Description</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Please provide detailed information about your issue or request..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.subject.trim() || !formData.message.trim()}
              className="bg-[#E02020] hover:bg-[#c01c1c]"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportRequestForm;
