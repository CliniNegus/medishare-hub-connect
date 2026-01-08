import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/UserRoleContext';

interface GoogleAuthOptions {
  mode: 'signin' | 'signup';
  role?: UserRole;
  onError?: (message: string) => void;
}

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initiateGoogleAuth = async ({ mode, role, onError }: GoogleAuthOptions) => {
    try {
      setLoading(true);
      
      // Determine redirect URL based on mode
      // For signin: go to dashboard (existing users)
      // For signup: go to onboarding (new users need to complete profile)
      const redirectPath = mode === 'signup' 
        ? `/onboarding/${role || 'hospital'}`
        : '/auth/callback';
      
      const redirectTo = `${window.location.origin}${redirectPath}`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Pass role in scopes for new signups
          ...(mode === 'signup' && role && {
            scopes: 'openid email profile',
          }),
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      const errorMessage = getGoogleAuthErrorMessage(error);
      
      toast({
        title: `Google ${mode === 'signin' ? 'sign-in' : 'sign-up'} failed`,
        description: errorMessage,
        variant: 'destructive',
      });
      
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  return {
    loading,
    initiateGoogleAuth,
  };
};

function getGoogleAuthErrorMessage(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('popup') || message.includes('blocked')) {
    return 'Popup was blocked. Please allow popups for this site and try again.';
  }
  
  if (message.includes('cancelled') || message.includes('canceled') || message.includes('closed')) {
    return 'Sign-in was cancelled. Please try again.';
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (message.includes('invalid') || message.includes('unauthorized')) {
    return 'Authentication failed. Please try again or contact support.';
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
}
