
import React from 'react';
import AdminStatsCards from './AdminStatsCards';
import QuickActions from './QuickActions';
import DataTabs from './DataTabs';
import EquipmentManagement from './EquipmentManagement';
import UserManagement from './UserManagement';
import MaintenanceManagement from './MaintenanceManagement';
import FinancialManagement from './FinancialManagement';
import SettingsPanel from './SettingsPanel';
import PredictiveAnalytics from './analytics/PredictiveAnalytics';

interface TabContentProps {
  activeTab: string;
  stats: {
    hospitals: number;
    manufacturers: number;
    investors: number;
    equipmentItems: number;
    activeLeases: number;
    pendingOrders: number;
    maintenanceAlerts: number;
    totalRevenue: number;
  };
  recentEquipment: any[];
  maintenanceSchedule: any[];
  recentTransactions: any[];
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  stats,
  recentEquipment,
  maintenanceSchedule,
  recentTransactions,
}) => {
  switch (activeTab) {
    case 'overview':
      return (
        <div>
          <AdminStatsCards stats={stats} />
          <QuickActions />
          <DataTabs 
            recentEquipment={recentEquipment}
            maintenanceSchedule={maintenanceSchedule}
            recentTransactions={recentTransactions}
          />
        </div>
      );
    case 'equipment':
      return <EquipmentManagement recentEquipment={recentEquipment} />;
    case 'users':
      return <UserManagement stats={stats} />;
    case 'maintenance':
      return (
        <MaintenanceManagement 
          maintenanceSchedule={maintenanceSchedule} 
          maintenanceAlerts={stats.maintenanceAlerts} 
        />
      );
    case 'finance':
      return (
        <FinancialManagement 
          stats={stats} 
          recentTransactions={recentTransactions} 
        />
      );
    case 'analytics':
      return <PredictiveAnalytics />;
    case 'settings':
      return <SettingsPanel />;
    case 'shop':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Medical Shop Management</h2>
          <p className="text-gray-600">
            Manage the equipment and disposables available in the hospital shop.
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default TabContent;

