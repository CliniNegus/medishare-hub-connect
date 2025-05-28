
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import TabContent from '@/components/admin/TabContent';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize admin notifications
  useAdminNotifications();

  // Sample data
  const stats = {
    hospitals: 28,
    manufacturers: 12,
    investors: 8,
    equipmentItems: 145,
    activeLeases: 87,
    pendingOrders: 14,
    maintenanceAlerts: 5,
    totalRevenue: 1250000
  };

  const recentEquipment = [
    { id: 'EQ001', name: 'MRI Scanner X9', manufacturer: 'MediTech', status: 'Leased', location: 'City Hospital' },
    { id: 'EQ002', name: 'CT Scanner Ultra', manufacturer: 'HealthImage', status: 'Available', location: 'Warehouse' },
    { id: 'EQ003', name: 'Portable X-Ray', manufacturer: 'RadiTech', status: 'Maintenance', location: 'Service Center' },
    { id: 'EQ004', name: 'Ultrasound Machine', manufacturer: 'SonoHealth', status: 'Leased', location: 'County Clinic' },
    { id: 'EQ005', name: 'Patient Monitor', manufacturer: 'VitalTech', status: 'Leased', location: 'Memorial Hospital' }
  ];

  const maintenanceSchedule = [
    { id: 'MS001', equipment: 'MRI Scanner X9', location: 'City Hospital', date: '2025-04-20', type: 'Preventive' },
    { id: 'MS002', equipment: 'CT Scanner Ultra', location: 'Warehouse', date: '2025-04-22', type: 'Calibration' },
    { id: 'MS003', equipment: 'Portable X-Ray', location: 'Service Center', date: '2025-04-18', type: 'Repair' },
    { id: 'MS004', equipment: 'Ultrasound Machine', location: 'County Clinic', date: '2025-04-25', type: 'Preventive' }
  ];

  const recentTransactions = [
    { id: 'TR001', date: '2025-04-12', description: 'Equipment Lease Payment', amount: 12500, type: 'Income' },
    { id: 'TR002', date: '2025-04-10', description: 'Maintenance Service Fee', amount: 1800, type: 'Income' },
    { id: 'TR003', date: '2025-04-09', description: 'Investor Dividend Payment', amount: 5200, type: 'Expense' },
    { id: 'TR004', date: '2025-04-07', description: 'New Equipment Purchase', amount: 78000, type: 'Expense' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="ml-64 flex-1 p-6">
          <AdminHeader />
          <TabContent
            activeTab={activeTab}
            stats={stats}
            recentEquipment={recentEquipment}
            maintenanceSchedule={maintenanceSchedule}
            recentTransactions={recentTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
