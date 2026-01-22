import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { SUPPORT_CATEGORIES, SupportCategory } from '@/types/support';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function EnhancedSupportTicketForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { submitTicket } = useSupportTickets();
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<SupportCategory>('other');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Limit file size to 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const uploadFile = async (): Promise<string | undefined> => {
    if (!file || !user) return undefined;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(`support-attachments/${fileName}`, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(`support-attachments/${fileName}`);
      
      return data.publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload attachment. Submitting without file.',
        variant: 'destructive',
      });
      return undefined;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to submit a support ticket.',
        variant: 'destructive',
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both subject and message fields.',
        variant: 'destructive',
      });
      return;
    }

    let fileUrl: string | undefined;
    if (file) {
      fileUrl = await uploadFile();
    }

    submitTicket.mutate({
      subject: subject.trim(),
      message: message.trim(),
      category,
      file_url: fileUrl,
    }, {
      onSuccess: () => {
        setSubject('');
        setMessage('');
        setCategory('other');
        setFile(null);
      }
    });
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
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as SupportCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={submitTicket.isPending || uploading}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Description</Label>
            <Textarea
              id="message"
              placeholder="Provide detailed information about your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitTicket.isPending || uploading}
              className="min-h-[120px]"
              maxLength={2000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                disabled={submitTicket.isPending || uploading}
                className="flex-1"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              {file && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Paperclip className="h-4 w-4" />
                  {file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={submitTicket.isPending || uploading}
          >
            {submitTicket.isPending || uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {uploading ? 'Uploading...' : 'Submitting...'}
              </>
            ) : (
              <>
                Submit Ticket
                <Send className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
