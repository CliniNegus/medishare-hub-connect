import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

/**
 * OAuth callback handler for Google sign-in
 * Determines if user is new or existing and routes appropriately
 * Enforces profile completion before granting access
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash (OAuth redirect)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session?.user) {
          // No session, redirect to auth
          navigate('/auth', { replace: true });
          return;
        }
        
        const user = session.user;
        
        // Wait for profile to exist (database trigger may take a moment)
        let profile = await waitForProfile(user.id);
        
        // Check for pending OAuth role (set during signup flow)
        const pendingRole = localStorage.getItem('pending_oauth_role');
        const effectiveRole = pendingRole || profile?.role || user.user_metadata?.role || 'hospital';
        
        // Clear pending role immediately
        if (pendingRole) {
          localStorage.removeItem('pending_oauth_role');
        }
        
        // For Google OAuth users, ensure profile is properly set up
        const isGoogleUser = user.app_metadata?.provider === 'google' || 
                            user.identities?.some(i => i.provider === 'google');
        
        if (isGoogleUser && profile?.id) {
          // Sync Google data and set role
          const updates: Record<string, any> = {
            updated_at: new Date().toISOString(),
          };
          
          if (!profile.role) {
            updates.role = effectiveRole;
          }
          
          if (!profile.full_name && user.user_metadata?.full_name) {
            updates.full_name = user.user_metadata.full_name;
          }
          
          if (user.user_metadata?.avatar_url) {
            updates.logo_url = user.user_metadata.avatar_url;
          }
          
          if (Object.keys(updates).length > 1) {
            await supabase
              .from('profiles')
              .update(updates)
              .eq('id', user.id);
          }
        }
        
        // Ensure user_roles entry exists
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        const hasRoleAssigned = userRoles && userRoles.length > 0;
        
        if (!hasRoleAssigned && effectiveRole !== 'admin') {
          await supabase
            .from('user_roles')
            .upsert({ 
              user_id: user.id, 
              role: effectiveRole as any,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,role' });
        }
        
        // Re-fetch profile to get latest state
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('id, onboarding_completed, profile_completed, role, full_name, organization, phone, location')
          .eq('id', user.id)
          .single();
        
        profile = updatedProfile;
        
        // Determine if user needs onboarding
        // User is complete if EITHER flag is true (for backwards compatibility)
        const isProfileComplete = profile?.onboarding_completed || profile?.profile_completed;
        const needsOnboarding = !profile || !isProfileComplete;
        
        if (needsOnboarding) {
          const role = profile?.role || effectiveRole;
          
          toast({
            title: 'Welcome to CliniBuilds! 🎉',
            description: 'Please complete your profile to get started.',
          });
          
          navigate(`/onboarding/${role}`, { replace: true });
        } else {
          // Existing user with completed profile
          // Check if Google account was linked to existing email account
          const isAccountLinking = checkAccountLinking(user);
          
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
          
          // Clear any pending OAuth role
          localStorage.removeItem('pending_oauth_role');
          
          // Route to role-specific dashboard
          const dashboardRoute = getDashboardRoute(profile.role);
          navigate(dashboardRoute, { replace: true });
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setErrorMessage(getAuthErrorMessage(error));
        
        toast({
          title: 'Authentication failed',
          description: getAuthErrorMessage(error),
          variant: 'destructive',
        });
        
        // Redirect to auth after delay
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };
    
    handleCallback();
  }, [navigate, toast]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Authentication Error</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
          <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <h2 className="text-xl font-semibold text-foreground">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

/**
 * Wait for profile to exist (database trigger may take a moment)
 */
async function waitForProfile(userId: string, maxRetries = 5): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, onboarding_completed, profile_completed, role, full_name, organization, phone, location')
      .eq('id', userId)
      .single();
    
    if (profile && !error) {
      return profile;
    }
    
    // Wait 500ms before retrying
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return null;
}

/**
 * Check if user has all required profile fields
 */
function hasRequiredFields(profile: any): boolean {
  if (!profile) return false;
  
  // For now, we just check if onboarding is marked as complete
  return profile.onboarding_completed === true;
}

/**
 * Check if this is an account linking scenario
 */
function checkAccountLinking(user: any): boolean {
  const identities = user.identities || [];
  // If user has multiple identities, it's a linked account
  return identities.length > 1;
}

/**
 * Sync Google profile data to our profiles table
 */
async function syncGoogleProfileData(user: any, existingProfile: any) {
  const googleData = user.user_metadata || {};
  
  // Only update if we have Google data and profile exists
  if (!existingProfile?.id) return;
  
  const updates: Record<string, any> = {};
  
  // Sync full_name if not already set
  if (!existingProfile.full_name && googleData.full_name) {
    updates.full_name = googleData.full_name;
  }
  
  // Sync avatar if available (store in logo_url field)
  if (googleData.avatar_url) {
    updates.logo_url = googleData.avatar_url;
  }
  
  // Only update if we have changes
  if (Object.keys(updates).length > 0) {
    updates.updated_at = new Date().toISOString();
    
    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
  }
}

/**
 * Get user-friendly error message from auth errors
 */
function getAuthErrorMessage(error: any): string {
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
  
  if (message.includes('invalid') || message.includes('expired')) {
    return 'Your session has expired. Please sign in again.';
  }
  
  if (message.includes('unauthorized')) {
    return 'Authentication failed. Please try again or contact support.';
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Get the appropriate dashboard route based on user role
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

export default AuthCallback;
