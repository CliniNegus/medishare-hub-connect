import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HospitalOnboardingForm from '@/components/onboarding/HospitalOnboardingForm';
import ManufacturerOnboardingForm from '@/components/onboarding/ManufacturerOnboardingForm';
import InvestorOnboardingForm from '@/components/onboarding/InvestorOnboardingForm';

const Onboarding = () => {
  const { role } = useParams<{ role: string }>();
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
