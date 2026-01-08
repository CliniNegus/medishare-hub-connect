import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/contexts/UserRoleContext';

interface GoogleAuthOptions {
  mode: 'signin' | 'signup';
  role?: UserRole;
  onError?: (message: string) => void;
}

/**
 * Custom hook for Google OAuth authentication
 * Handles both sign-in and sign-up flows with proper error handling
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initiateGoogleAuth = useCallback(async ({ mode, role, onError }: GoogleAuthOptions) => {
    try {
      setLoading(true);
      
      // Store role for signup flow - callback will use this
      if (mode === 'signup' && role) {
        localStorage.setItem('pending_oauth_role', role);
      }
      
      // Always redirect to callback - it handles routing based on profile state
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            // Use 'select_account' for sign-in, 'consent' for sign-up
            prompt: mode === 'signup' ? 'consent' : 'select_account',
          },
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
  }, [toast]);

  const retryGoogleAuth = useCallback((options: GoogleAuthOptions) => {
    // Clear any stale state before retry
    localStorage.removeItem('pending_oauth_role');
    initiateGoogleAuth(options);
  }, [initiateGoogleAuth]);

  return {
    loading,
    initiateGoogleAuth,
    retryGoogleAuth,
  };
};

/**
 * Get user-friendly error message for Google OAuth errors
 */
function getGoogleAuthErrorMessage(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code?.toLowerCase() || '';
  
  // Popup blocked
  if (message.includes('popup') || message.includes('blocked') || code.includes('popup')) {
    return 'Popup was blocked. Please allow popups for this site and try again.';
  }
  
  // User cancelled
  if (message.includes('cancelled') || message.includes('canceled') || 
      message.includes('closed') || message.includes('user denied')) {
    return 'Sign-in was cancelled. Please try again when ready.';
  }
  
  // Network errors
  if (message.includes('network') || message.includes('fetch') || 
      message.includes('timeout') || message.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Invalid/expired session
  if (message.includes('invalid') || message.includes('expired') ||
      message.includes('token')) {
    return 'Your session has expired. Please try signing in again.';
  }
  
  // Unauthorized
  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return 'Authentication failed. Please try again or contact support.';
  }
  
  // Provider error
  if (message.includes('provider') || message.includes('oauth')) {
    return 'Unable to connect to Google. Please try again later.';
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
}
