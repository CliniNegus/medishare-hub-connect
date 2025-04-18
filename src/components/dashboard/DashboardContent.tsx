import React from 'react';
import { BarChart, Calendar } from "lucide-react";
import EquipmentSearch from './EquipmentSearch';
import EquipmentStats from './EquipmentStats';
import FinancingSection from './FinancingSection';
import EquipmentList from './EquipmentList';
import { EquipmentProps } from '../EquipmentCard';
import ClusterMap from '../ClusterMap';
import { ClusterNode } from '../ClusterMap';
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
  recentTransactions
}) => {
  if (activeTab === 'hospitals') {
    return <HospitalLocations />;
  }

  if (activeTab === 'bookings') {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">Booking Management</h3>
          <p className="text-sm">You can manage your equipment bookings here.</p>
        </div>
      </div>
    );
  }
  
  if (activeTab === 'analytics') {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
          <p className="text-sm">View detailed analytics of equipment usage and revenue.</p>
        </div>
      </div>
    );
  }
  
  // Default to equipment tab
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Filters and Equipment Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Filters */}
        <EquipmentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* Stats Cards */}
        <EquipmentStats />
        
        {/* Financing Options Section */}
        <FinancingSection />
        
        {/* Equipment Cards */}
        <EquipmentList 
          equipmentData={equipmentData} 
          onBookEquipment={onBookEquipment} 
        />
      </div>
      
      {/* Right Column - Map only */}
      <div className="space-y-6">
        <ClusterMap 
          nodes={clusterNodes} 
          selectedNodeId={selectedClusterNode}
          onSelectNode={setSelectedClusterNode}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
