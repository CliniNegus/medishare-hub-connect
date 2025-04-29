
import React, { useEffect, useState } from 'react';
import AdminStatsCards from './AdminStatsCards';
import QuickActions from './QuickActions';
import DataTabs from './DataTabs';
import EquipmentManagement from './EquipmentManagement';
import UserManagement from './UserManagement';
import MaintenanceManagement from './MaintenanceManagement';
import FinancialManagement from './FinancialManagement';
import SettingsPanel from './SettingsPanel';
import PredictiveAnalytics from './analytics/PredictiveAnalytics';
import { supabase } from '@/integrations/supabase/client';

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
  const [equipment, setEquipment] = useState(initialEquipment);

  useEffect(() => {
    if (activeTab === 'equipment') {
      // Fetch latest equipment data when tab is equipment
      const fetchEquipment = async () => {
        try {
          const { data } = await supabase
            .from('equipment')
            .select('*')
            .limit(10);
          
          if (data) {
            const formattedData = data.map(item => ({
              id: item.id,
              name: item.name,
              // Use category as manufacturer since manufacturer field doesn't exist
              manufacturer: item.category || 'Unknown',
              status: item.status || 'Unknown',
              location: 'Warehouse' // Default location
            }));
            
            setEquipment(formattedData);
          }
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      };
      
      fetchEquipment();
    }
  }, [activeTab]);

  switch (activeTab) {
    case 'overview':
      return (
        <div>
          <AdminStatsCards stats={stats} />
          <QuickActions />
          <DataTabs 
            recentEquipment={equipment}
            maintenanceSchedule={maintenanceSchedule}
            recentTransactions={recentTransactions}
          />
        </div>
      );
    case 'equipment':
      return <EquipmentManagement recentEquipment={equipment} />;
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
