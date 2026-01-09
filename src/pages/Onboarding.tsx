import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import HospitalOnboardingForm from '@/components/onboarding/HospitalOnboardingForm';
import ManufacturerOnboardingForm from '@/components/onboarding/ManufacturerOnboardingForm';
import InvestorOnboardingForm from '@/components/onboarding/InvestorOnboardingForm';

const Onboarding = () => {
  const { role } = useParams<{ role: string }>();
  const { user, profile, loading, userRoles, refreshProfile } = useAuth();
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false);
  const setupAttempted = useRef(false);

  // Handle OAuth users - ensure profile exists and role is set
  useEffect(() => {
    const setupOAuthProfile = async () => {
      // Prevent duplicate runs
      if (!user || loading || isSettingUpProfile || setupAttempted.current) return;
      
      // Check if this is a Google OAuth user
      const isGoogleUser = user.app_metadata?.provider === 'google' || 
                          user.identities?.some((i: any) => i.provider === 'google');
      
      if (!isGoogleUser) return;
      
      // Mark as attempted to prevent re-runs
      setupAttempted.current = true;
      setIsSettingUpProfile(true);
      
      try {
        // Get the role from URL or localStorage (set during OAuth initiation)
        const pendingRole = localStorage.getItem('pending_oauth_role');
        const effectiveRole = role || pendingRole || 'hospital';
        
        // Clear the pending role
        if (pendingRole) {
          localStorage.removeItem('pending_oauth_role');
        }
        
        // Ensure profile has the role and Google data synced
        const updates: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        
        // Sync Google profile data if available
        if (user.user_metadata?.full_name && !profile?.full_name) {
          updates.full_name = user.user_metadata.full_name;
        }
        
        if (user.user_metadata?.avatar_url) {
          updates.logo_url = user.user_metadata.avatar_url;
        }
        
        // Set role if not already set
        if (!profile?.role || profile.role !== effectiveRole) {
          updates.role = effectiveRole;
        }
        
        // Update profile
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
        
        // Ensure user_roles entry exists
        await supabase
          .from('user_roles')
          .upsert({ 
            user_id: user.id, 
            role: effectiveRole as any,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,role' });
        
        // Refresh profile to get updated data
        await refreshProfile();
      } catch (error) {
        console.error('Error setting up OAuth profile:', error);
      } finally {
        setIsSettingUpProfile(false);
      }
    };
    
    setupOAuthProfile();
  }, [user, loading, profile, role, refreshProfile]);

  // Reset setup attempted when user changes
  useEffect(() => {
    if (!user) {
      setupAttempted.current = false;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show setting up profile for a maximum of 5 seconds, then proceed anyway
  if (isSettingUpProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If onboarding already completed, redirect to appropriate dashboard
  if (profile?.onboarding_completed || profile?.profile_completed) {
    if (userRoles.isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    if (userRoles.primaryRole === 'manufacturer') {
      return <Navigate to="/manufacturer/products" replace />;
    }
    if (userRoles.primaryRole === 'investor') {
      return <Navigate to="/investor" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Determine role from URL param or user profile
  const effectiveRole = role || profile?.role || userRoles.primaryRole || 'hospital';

  switch (effectiveRole) {
    case 'hospital':
    case 'clinic':
      return <HospitalOnboardingForm />;
    case 'manufacturer':
      return <ManufacturerOnboardingForm />;
    case 'investor':
      return <InvestorOnboardingForm />;
    default:
      return <HospitalOnboardingForm />;
  }
};

export default Onboarding;
