
import React from 'react';
import { EquipmentProps } from '@/components/EquipmentCard';
import { ClusterNode } from '@/components/ClusterMap';
import EquipmentSearch from '../EquipmentSearch';
import EquipmentStats from '../EquipmentStats';
import FinancingSection from '../FinancingSection';
import EquipmentList from '../EquipmentList';
import ClusterMap from '@/components/ClusterMap';

interface EquipmentTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  equipmentData: EquipmentProps[];
  clusterNodes: ClusterNode[];
  selectedClusterNode: string | undefined;
  setSelectedClusterNode: (id: string) => void;
  onBookEquipment: (id: string) => void;
}

const EquipmentTab: React.FC<EquipmentTabProps> = ({
  searchTerm,
  setSearchTerm,
  equipmentData,
  clusterNodes,
  selectedClusterNode,
  setSelectedClusterNode,
  onBookEquipment,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <EquipmentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <EquipmentStats />
        <FinancingSection />
        <EquipmentList 
          equipmentData={equipmentData} 
          onBookEquipment={onBookEquipment} 
        />
      </div>
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

export default EquipmentTab;
