
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordResetEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendPasswordResetEmail = async (email: string, resetUrl: string, fullName?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: {
          email,
          resetUrl,
          fullName,
        },
      });

      if (error) throw new Error(error.message);

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send password reset email');
      }

      toast({
        title: "Password reset email sent!",
        description: "User will receive instructions to reset their password.",
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send password reset email';
      setError(errorMessage);
      
      toast({
        title: "Failed to send password reset email",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendPasswordResetEmail,
    loading,
    error,
  };
};
