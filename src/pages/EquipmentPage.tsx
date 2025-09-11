import React from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import HospitalEquipmentView from '@/components/equipment/role-views/HospitalEquipmentView';
import ManufacturerEquipmentView from '@/components/equipment/role-views/ManufacturerEquipmentView';
import InvestorEquipmentView from '@/components/equipment/role-views/InvestorEquipmentView';
import AdminEquipmentView from '@/components/equipment/role-views/AdminEquipmentView';
import Layout from '@/components/Layout';

const EquipmentPage = () => {
  const { role } = useUserRole();

  const renderEquipmentView = () => {
    switch (role) {
      case 'hospital':
        return <HospitalEquipmentView />;
      case 'manufacturer':
        return <ManufacturerEquipmentView />;
      case 'investor':
        return <InvestorEquipmentView />;
      case 'admin':
        return <AdminEquipmentView />;
      default:
        return <HospitalEquipmentView />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F5F5]">
        {renderEquipmentView()}
      </div>
    </Layout>
  );
};

export default EquipmentPage;