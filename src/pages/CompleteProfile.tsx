import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileCompletionForm from '@/components/profile/ProfileCompletionForm';

const CompleteProfile = () => {
  const { user, profile, loading } = useAuth();

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
    const userRole = profile?.role || 'hospital';
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'manufacturer':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <ProfileCompletionForm />;
};

export default CompleteProfile;