import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session, User } from '@supabase/supabase-js';

type CallbackStatus = 
  | 'initializing'
  | 'waiting_for_session'
  | 'session_found'
  | 'checking_profile'
  | 'setting_up_account'
  | 'redirecting'
  | 'error';

interface CallbackState {
  status: CallbackStatus;
  message: string;
  error: string | null;
}

const STATUS_MESSAGES: Record<CallbackStatus, string> = {
  initializing: 'Initializing...',
  waiting_for_session: 'Finalizing sign-in...',
  session_found: 'Session established...',
  checking_profile: 'Checking your profile...',
  setting_up_account: 'Setting up your account...',
  redirecting: 'Redirecting to your dashboard...',
  error: 'Something went wrong',
};

/**
 * OAuth callback handler - processes the return from Google OAuth
 * 
 * Flow:
 * 1. Wait for Supabase to exchange the OAuth code for a session
 * 2. Verify session is valid
 * 3. Check if user profile exists and is complete
 * 4. Route to onboarding (new users) or dashboard (returning users)
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const processedRef = useRef(false);
  
  const [state, setState] = useState<CallbackState>({
    status: 'initializing',
    message: STATUS_MESSAGES.initializing,
    error: null,
  });

  const updateStatus = (status: CallbackStatus, error?: string) => {
    setState({
      status,
      message: STATUS_MESSAGES[status],
      error: error || null,
    });
  };

  useEffect(() => {
    // Prevent double processing
    if (processedRef.current) return;
    processedRef.current = true;

    const processCallback = async () => {
      try {
        updateStatus('waiting_for_session');

        // Step 1: Wait for session with retries
        const session = await waitForSession(5, 1000);
        
        if (!session) {
          throw new Error('Unable to establish session. Please try again.');
        }

        updateStatus('session_found');
        const user = session.user;

        // Step 2: Wait for profile to exist (database trigger creates it)
        updateStatus('checking_profile');
        let profile = await waitForProfile(user.id, 8, 500);

        // Step 3: Get pending OAuth role and mode
        const pendingRole = localStorage.getItem('pending_oauth_role');
        const oauthMode = localStorage.getItem('oauth_mode');
        const effectiveRole = pendingRole || profile?.role || 'hospital';

        // Clean up localStorage
        localStorage.removeItem('pending_oauth_role');
        localStorage.removeItem('oauth_mode');

        // Step 4: Set up account if needed (sync data, set role)
        updateStatus('setting_up_account');
        
        // Sync Google profile data and set role
        await setupUserAccount(user, profile, effectiveRole);

        // Step 5: Ensure user_roles entry exists
        await ensureUserRole(user.id, effectiveRole);

        // Step 6: Re-fetch profile to get latest state
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('id, onboarding_completed, profile_completed, role, full_name, organization')
          .eq('id', user.id)
          .single();

        profile = updatedProfile;

        // Step 7: Determine routing based on profile state
        updateStatus('redirecting');
        
        const isProfileComplete = profile?.onboarding_completed || profile?.profile_completed;
        
        if (!profile || !isProfileComplete) {
          // New user or incomplete profile - go to onboarding
          const role = profile?.role || effectiveRole;
          
          toast({
            title: 'Welcome to CliniBuilds! 🎉',
            description: 'Please complete your profile to get started.',
          });

          // Small delay to ensure state is persisted
          await delay(300);
          navigate(`/onboarding/${role}`, { replace: true });
        } else {
          // Returning user with complete profile
          const isAccountLinking = (user.identities?.length || 0) > 1;
          
          if (isAccountLinking) {
            toast({
              title: 'Account linked successfully! 🔗',
              description: 'Your Google account has been linked to your existing account.',
            });
          } else {
            toast({
              title: 'Welcome back!',
              description: 'You have been signed in successfully.',
            });
          }

          // Route to appropriate dashboard
          const dashboardRoute = getDashboardRoute(profile.role);
          await delay(300);
          navigate(dashboardRoute, { replace: true });
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        
        const errorMessage = getUserFriendlyError(error);
        updateStatus('error', errorMessage);

        toast({
          title: 'Authentication failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    };

    processCallback();
  }, [navigate, toast]);

  const handleRetry = () => {
    // Clear state and redirect to auth page
    localStorage.removeItem('pending_oauth_role');
    localStorage.removeItem('oauth_mode');
    navigate('/auth', { replace: true });
  };

  // Error state
  if (state.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              We couldn't complete sign-in
            </h2>
            <p className="text-muted-foreground">
              {state.error}
            </p>
          </div>

          <Button 
            onClick={handleRetry}
            className="w-full max-w-xs"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <p className="text-sm text-muted-foreground">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="text-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-primary/10 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            {state.message}
          </h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we set up your account
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {['waiting_for_session', 'session_found', 'checking_profile', 'setting_up_account', 'redirecting'].map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                getStepIndex(state.status) >= index
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Wait for Supabase session with retries
 */
async function waitForSession(maxRetries: number, delayMs: number): Promise<Session | null> {
  for (let i = 0; i < maxRetries; i++) {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session fetch error:', error);
    }
    
    if (session?.user) {
      return session;
    }

    // Wait before retrying
    if (i < maxRetries - 1) {
      await delay(delayMs);
    }
  }

  return null;
}

/**
 * Wait for profile to exist in database
 */
async function waitForProfile(userId: string, maxRetries: number, delayMs: number): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, onboarding_completed, profile_completed, role, full_name, organization, phone, location')
      .eq('id', userId)
      .single();

    if (profile && !error) {
      return profile;
    }

    // Wait before retrying
    if (i < maxRetries - 1) {
      await delay(delayMs);
    }
  }

  return null;
}

/**
 * Set up user account - sync Google data and set role
 */
async function setupUserAccount(user: User, profile: any, role: string): Promise<void> {
  const isGoogleUser = user.app_metadata?.provider === 'google' || 
                      user.identities?.some(i => i.provider === 'google');

  if (!isGoogleUser || !profile?.id) return;

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  // Set role if not already set
  if (!profile.role) {
    updates.role = role;
  }

  // Sync full name from Google if not set
  if (!profile.full_name && user.user_metadata?.full_name) {
    updates.full_name = user.user_metadata.full_name;
  }

  // Sync avatar from Google
  if (user.user_metadata?.avatar_url) {
    updates.logo_url = user.user_metadata.avatar_url;
  }

  // Only update if we have changes beyond just updated_at
  if (Object.keys(updates).length > 1) {
    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
  }
}

/**
 * Ensure user has a role entry in user_roles table
 */
async function ensureUserRole(userId: string, role: string): Promise<void> {
  // Don't create admin roles this way
  if (role === 'admin') return;

  const { data: existingRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  const hasRole = existingRoles && existingRoles.length > 0;

  if (!hasRole) {
    await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role as any,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,role' });
  }
}

/**
 * Get dashboard route based on user role
 */
function getDashboardRoute(role: string | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'manufacturer':
      return '/manufacturer/products';
    case 'investor':
      return '/investor';
    case 'hospital':
    default:
      return '/dashboard';
  }
}

/**
 * Convert error to user-friendly message
 */
function getUserFriendlyError(error: any): string {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('session') || message.includes('establish')) {
    return 'We couldn\'t verify your sign-in. Please try again.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (message.includes('expired') || message.includes('invalid')) {
    return 'Your session expired. Please sign in again.';
  }

  if (message.includes('popup') || message.includes('blocked')) {
    return 'Sign-in was blocked. Please allow popups and try again.';
  }

  return error?.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Get numeric index for step
 */
function getStepIndex(status: CallbackStatus): number {
  const steps: CallbackStatus[] = [
    'waiting_for_session',
    'session_found', 
    'checking_profile',
    'setting_up_account',
    'redirecting',
  ];
  return steps.indexOf(status);
}

/**
 * Utility delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default AuthCallback;
