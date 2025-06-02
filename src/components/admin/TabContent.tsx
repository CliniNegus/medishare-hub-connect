
import React from 'react';
import AdminStatsCards from './AdminStatsCards';
import UserManagement from './UserManagement';
import EquipmentManagement from './EquipmentManagement';
import FinancialManagement from './FinancialManagement';
import MaintenanceManagement from './MaintenanceManagement';
import { SupportRequestsPanel } from './SupportRequestsPanel';
import SettingsPanel from './SettingsPanel';
import OverviewTabContent from './tabs/OverviewTabContent';
import ShopTabContent from './tabs/ShopTabContent';

interface TabContentProps {
  activeTab: string;
  stats: any;
  recentEquipment: any[];
  maintenanceSchedule: any[];
  recentTransactions: any[];
}

const TabContent = ({ 
  activeTab, 
  stats, 
  recentEquipment, 
  maintenanceSchedule, 
  recentTransactions 
}: TabContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTabContent
            stats={stats}
            recentEquipment={recentEquipment}
            maintenanceSchedule={maintenanceSchedule}
            recentTransactions={recentTransactions}
          />
        );
      case 'users':
        return <UserManagement stats={stats} />;
      case 'equipment':
        return <EquipmentManagement recentEquipment={recentEquipment} />;
      case 'financial':
        return <FinancialManagement stats={stats} recentTransactions={recentTransactions} />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'support':
        return <SupportRequestsPanel />;
      case 'shop':
        return <ShopTabContent />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return (
          <OverviewTabContent
            stats={stats}
            recentEquipment={recentEquipment}
            maintenanceSchedule={maintenanceSchedule}
            recentTransactions={recentTransactions}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default TabContent;
