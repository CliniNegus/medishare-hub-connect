
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { ClusterNode } from '../ClusterMap';
import EquipmentTab from './tabs/EquipmentTab';
import BookingsTab from './tabs/BookingsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import TherapyTab from './tabs/TherapyTab';
import FinancingTab from './tabs/FinancingTab';
import ShopTab from './tabs/ShopTab';
import HospitalLocations from '@/pages/HospitalLocations';

interface DashboardContentProps {
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  equipmentData: EquipmentProps[];
  clusterNodes: ClusterNode[];
  selectedClusterNode: string | undefined;
  setSelectedClusterNode: (id: string) => void;
  onBookEquipment: (id: string) => void;
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'return';
  }[];
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
  categoryFilter?: string;
  setCategoryFilter?: (category: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  equipmentData,
  clusterNodes,
  selectedClusterNode,
  setSelectedClusterNode,
  onBookEquipment,
  recentTransactions,
  statusFilter = "all",
  setStatusFilter = () => {},
  categoryFilter = "all",
  setCategoryFilter = () => {}
}) => {
  switch (activeTab) {
    case 'hospitals':
      return <HospitalLocations />;
      
    case 'bookings':
      return <BookingsTab />;
      
    case 'analytics':
      return <AnalyticsTab />;
      
    case 'therapy':
      return <TherapyTab />;
      
    case 'financing':
      return <FinancingTab />;
      
    case 'shop':
      return <ShopTab />;
      
    case 'equipment':
    default:
      return (
        <EquipmentTab
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          equipmentData={equipmentData}
          clusterNodes={clusterNodes}
          selectedClusterNode={selectedClusterNode}
          setSelectedClusterNode={setSelectedClusterNode}
          onBookEquipment={onBookEquipment}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      );
  }
};

export default DashboardContent;
