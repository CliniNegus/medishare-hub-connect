
import React from 'react';
import DashboardContent from '../dashboard/DashboardContent';
import { EquipmentProps } from '../EquipmentCard';
import { ClusterNode } from '../ClusterMap';

interface EquipmentTabContentProps {
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
  activeTab: string;
}

const EquipmentTabContent: React.FC<EquipmentTabContentProps> = ({
  searchTerm,
  setSearchTerm,
  equipmentData,
  clusterNodes,
  selectedClusterNode,
  setSelectedClusterNode,
  onBookEquipment,
  recentTransactions,
  activeTab
}) => (
  <DashboardContent
    activeTab={activeTab}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    equipmentData={equipmentData}
    clusterNodes={clusterNodes}
    selectedClusterNode={selectedClusterNode}
    setSelectedClusterNode={setSelectedClusterNode}
    onBookEquipment={onBookEquipment}
    recentTransactions={recentTransactions}
  />
);

export default EquipmentTabContent;
