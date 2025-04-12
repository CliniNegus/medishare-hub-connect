
import React from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import HospitalDashboard from './HospitalDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import InvestorDashboard from './InvestorDashboard';

const Dashboard = () => {
  const { role } = useUserRole();

  // Render different dashboard based on selected role
  switch (role) {
    case 'manufacturer':
      return <ManufacturerDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'hospital':
    default:
      return <HospitalDashboard />;
  }
};

export default Dashboard;
