
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import HospitalDashboard from './HospitalDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import InvestorDashboard from './InvestorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';

const Dashboard = () => {
  const { role } = useUserRole();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has a profile role set
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // If user has a profile role but it doesn't match the current role setting
    if (profile?.role && profile.role !== role) {
      console.log('Redirecting to correct dashboard based on profile role:', profile.role);
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, role, navigate]);

  // Render different dashboard based on selected role
  switch (role) {
    case 'manufacturer':
      return <ManufacturerDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'hospital':
    default:
      return <HospitalDashboard />;
  }
};

export default Dashboard;
