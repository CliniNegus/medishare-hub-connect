
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendVerificationEmail = async (email: string, fullName?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get client info
      const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null);
      const ipData = ipResponse ? await ipResponse.json() : null;

      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          fullName,
          ipAddress: ipData?.ip,
          userAgent: navigator.userAgent,
        },
      });

      if (error) throw new Error(error.message);

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send verification email');
      }

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox and spam folder for the verification link.",
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send verification email';
      setError(errorMessage);
      
      toast({
        title: "Failed to send verification email",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const checkEmailVerified = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('is_email_verified', {
        user_email: email
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error checking email verification:', err);
      return false;
    }
  };

  const resendVerificationEmail = async (email: string, fullName?: string) => {
    return sendVerificationEmail(email, fullName);
  };

  return {
    sendVerificationEmail,
    resendVerificationEmail,
    checkEmailVerified,
    loading,
    error,
  };
};
