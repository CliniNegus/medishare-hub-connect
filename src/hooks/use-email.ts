
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

export const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (options: SendEmailOptions) => {
    setLoading(true);
    setError(null);

    try {
      const { to, subject, html, from, text } = options;

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html, from, text },
      });

      if (error) throw new Error(error.message);
      
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmail,
    loading,
    error,
  };
};
