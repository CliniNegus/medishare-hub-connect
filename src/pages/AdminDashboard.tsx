
import React from 'react';
import RoleDashboard from '@/components/RoleDashboard';
import AdminDashboardComponent from '@/components/admin/AdminDashboard';

const AdminDashboard = () => {
  return (
    <RoleDashboard allowedRoles={['admin']}>
      <AdminDashboardComponent />
    </RoleDashboard>
  );
};

export default AdminDashboard;
