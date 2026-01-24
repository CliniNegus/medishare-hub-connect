import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileCompletionForm from '@/components/profile/ProfileCompletionForm';

const CompleteProfile = () => {
  const { user, profile, loading, userRoles } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E02020] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If profile is already completed, redirect to dashboard
  if (profile?.profile_completed) {
    if (userRoles.isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If user is a manufacturer with incomplete profile, redirect to manufacturer onboarding
  if (userRoles.primaryRole === 'manufacturer') {
    return <Navigate to="/manufacturer/onboarding" replace />;
  }

  return <ProfileCompletionForm />;
};

export default CompleteProfile;