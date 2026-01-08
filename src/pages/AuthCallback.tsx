import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

/**
 * OAuth callback handler for Google sign-in
 * Determines if user is new or existing and routes appropriately
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
        
        // Check if user has a profile and if onboarding is complete
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, onboarding_completed, profile_completed, role, full_name')
          .eq('id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }
        
        // For Google OAuth users, sync their profile data
        if (user.app_metadata?.provider === 'google' || user.identities?.some(i => i.provider === 'google')) {
          await syncGoogleProfileData(user, profile);
        }
        
        // Determine redirect based on profile state
        if (!profile || (!profile.onboarding_completed && !profile.profile_completed)) {
          // New user or incomplete profile - go to onboarding
          const role = profile?.role || user.user_metadata?.role || 'hospital';
          
          toast({
            title: 'Welcome to CliniBuilds! 🎉',
            description: 'Please complete your profile to get started.',
          });
          
          navigate(`/onboarding/${role}`, { replace: true });
        } else {
          // Existing user with completed profile - go to dashboard
          toast({
            title: 'Welcome back!',
            description: 'You have been signed in successfully.',
          });
          
          // Route to role-specific dashboard
          const dashboardRoute = getDashboardRoute(profile.role);
          navigate(dashboardRoute, { replace: true });
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
        
        toast({
          title: 'Authentication failed',
          description: error.message || 'Please try again.',
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
