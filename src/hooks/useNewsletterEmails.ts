
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewsletterOptions {
  subject: string;
  htmlContent: string;
  textContent?: string;
  targetRole?: 'all' | 'hospital' | 'manufacturer' | 'investor' | 'admin';
  recipientEmails?: string[];
}

export const useNewsletterEmails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendNewsletter = async (options: NewsletterOptions) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: options,
      });

      if (error) throw new Error(error.message);

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send newsletter');
      }

      toast({
        title: "Newsletter sent successfully!",
        description: `Sent to ${data.successCount} recipients${data.failureCount ? ` (${data.failureCount} failed)` : ''}`,
      });

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send newsletter';
      setError(errorMessage);
      
      toast({
        title: "Failed to send newsletter",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendNewsletter,
    loading,
    error,
  };
};
