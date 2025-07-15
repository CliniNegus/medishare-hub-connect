
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWelcomeEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendWelcomeEmail = async (email: string, fullName?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          fullName,
        },
      });

      if (error) throw new Error(error.message);

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send welcome email');
      }

      toast({
        title: "Welcome email sent!",
        description: "User will receive a welcome message with next steps.",
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send welcome email';
      setError(errorMessage);
      
      toast({
        title: "Failed to send welcome email",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendWelcomeEmail,
    loading,
    error,
  };
};
