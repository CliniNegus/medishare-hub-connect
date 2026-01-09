import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileCompletionForm from '@/components/profile/ProfileCompletionForm';

const Onboarding = () => {
  const { user, profile, loading, userRoles } = useAuth();

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

  // Use ProfileCompletionForm for all account types
  return <ProfileCompletionForm />;
};

export default Onboarding;
