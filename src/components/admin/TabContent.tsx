
import React from 'react';
import EquipmentManagement from './equipment/EquipmentManagement';
import UserManagement from './UserManagement';
import MaintenanceManagement from './MaintenanceManagement';
import FinancialManagement from './FinancialManagement';
import SettingsPanel from './SettingsPanel';
import PredictiveAnalytics from './analytics/PredictiveAnalytics';
import OverviewTabContent from './tabs/OverviewTabContent';
import ShopTabContent from './tabs/ShopTabContent';
import AdminNotificationsDashboard from './notifications/AdminNotificationsDashboard';
import CustomerStatements from './customer-statements/CustomerStatements';
import DeletionRequestsManagement from './deletion-requests/DeletionRequestsManagement';
import { ManufacturerApprovals } from './manufacturer-approvals';
import { useEquipmentData } from './hooks/useEquipmentData';

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
  recentEquipment: initialEquipment,
  maintenanceSchedule,
  recentTransactions,
}) => {
  const { equipment } = useEquipmentData(activeTab, initialEquipment);

  switch (activeTab) {
    case 'overview':
      return (
        <OverviewTabContent 
          stats={stats}
          recentEquipment={equipment}
          maintenanceSchedule={maintenanceSchedule}
          recentTransactions={recentTransactions}
        />
      );
    case 'equipment':
      return <EquipmentManagement />;
    case 'users':
      return <UserManagement stats={stats} />;
    case 'deletion-requests':
      return <DeletionRequestsManagement />;
    case 'manufacturer-approvals':
      return <ManufacturerApprovals />;
    case 'maintenance':
      return <MaintenanceManagement 
        maintenanceSchedule={maintenanceSchedule} 
        maintenanceAlerts={stats.maintenanceAlerts} 
      />;
    case 'finance':
      return <FinancialManagement 
        stats={stats} 
        recentTransactions={recentTransactions} 
      />;
    case 'customer-statements':
      return <CustomerStatements />;
    case 'analytics':
      return <PredictiveAnalytics />;
    case 'settings':
      return <SettingsPanel />;
    case 'notifications':
      return <AdminNotificationsDashboard />;
    case 'shop':
      return <ShopTabContent />;
    default:
      return null;
  }
};

export default TabContent;
