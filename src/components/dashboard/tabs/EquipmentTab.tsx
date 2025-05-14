
import React from 'react';
import { EquipmentProps } from '@/components/EquipmentCard';
import { ClusterNode } from '@/components/ClusterMap';
import EquipmentSearch from '../EquipmentSearch';
import EquipmentStats from '../EquipmentStats';
import FinancingSection from '../FinancingSection';
import EquipmentList from '../EquipmentList';
import ClusterMap from '@/components/ClusterMap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Calculator, Clock } from 'lucide-react';

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
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-red-600">Equipment Acquisition Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <ShoppingCart className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="font-medium text-red-800">Purchase</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">Buy equipment outright with full ownership</p>
              <Badge className="bg-red-600">One-time payment</Badge>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="font-medium text-red-800">Pay Per Use</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">Only pay when you use the equipment</p>
              <Badge className="bg-red-600">Usage-based</Badge>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Calculator className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="font-medium text-red-800">Financing</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">Spread costs with flexible payment terms</p>
              <Badge className="bg-red-600">Monthly payments</Badge>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 w-full">
              Compare Options
            </Button>
          </div>
        </div>
        
        <EquipmentStats />
        <FinancingSection />
        <EquipmentList onBookEquipment={onBookEquipment} />
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
