import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type OAuthRole = 'hospital' | 'manufacturer' | 'investor' | 'admin';

export interface GoogleOAuthState {
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

interface InitiateOAuthParams {
  role?: OAuthRole;
  mode: 'signin' | 'signup';
}

/**
 * Robust Google OAuth hook with proper state management
 * Handles the initiation of Google OAuth flow with role persistence
 */
export function useGoogleOAuth() {
  const { toast } = useToast();
  const [state, setState] = useState<GoogleOAuthState>({
    isLoading: false,
    loadingMessage: '',
    error: null,
  });

  const initiateGoogleOAuth = useCallback(async ({ role, mode }: InitiateOAuthParams) => {
    try {
      // Step 1: Set loading state immediately
      setState({
        isLoading: true,
        loadingMessage: 'Redirecting to Google...',
        error: null,
      });

      // Step 2: Store role for signup flow (callback will use this)
      if (mode === 'signup' && role) {
        localStorage.setItem('pending_oauth_role', role);
        localStorage.setItem('oauth_mode', 'signup');
      } else {
        // For sign-in, clear any stale role data
        localStorage.removeItem('pending_oauth_role');
        localStorage.setItem('oauth_mode', 'signin');
      }

      // Step 3: Build redirect URL - always go to callback page
      const redirectUrl = `${window.location.origin}/auth/callback`;

      // Step 4: Initiate OAuth with redirect (not popup)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: mode === 'signup' ? 'consent' : 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }

      // Note: If successful, the browser will redirect to Google
      // The loading state will persist until redirect happens
    } catch (error: any) {
      const errorMessage = getGoogleOAuthErrorMessage(error);
      
      setState({
        isLoading: false,
        loadingMessage: '',
        error: errorMessage,
      });

      toast({
        title: mode === 'signup' ? 'Google sign-up failed' : 'Google sign-in failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    initiateGoogleOAuth,
    clearError,
  };
}

/**
 * Get user-friendly error message for Google OAuth errors
 */
function getGoogleOAuthErrorMessage(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code?.toLowerCase() || '';

  if (message.includes('popup') || message.includes('blocked') || code.includes('popup')) {
    return 'Popup was blocked. Please allow popups for this site and try again.';
  }

  if (message.includes('cancelled') || message.includes('canceled') || 
      message.includes('closed') || message.includes('user denied')) {
    return 'Sign-in was cancelled. Please try again when ready.';
  }

  if (message.includes('network') || message.includes('fetch') || 
      message.includes('timeout') || message.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (message.includes('invalid') || message.includes('expired') || message.includes('token')) {
    return 'Your session has expired. Please try signing in again.';
  }

  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return 'Authentication failed. Please try again or contact support.';
  }

  if (message.includes('provider') || message.includes('oauth')) {
    return 'Unable to connect to Google. Please try again later.';
  }

  return error?.message || 'An unexpected error occurred. Please try again.';
}
