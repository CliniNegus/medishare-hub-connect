
import React from 'react';
import EnhancedClusterMap, { EnhancedClusterNode } from './equipment/EnhancedClusterMap';

export interface ClusterNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  equipmentCount: number;
  type: 'hospital' | 'clinic';
}

interface ClusterMapProps {
  nodes: ClusterNode[];
  selectedNodeId?: string;
  onSelectNode?: (id: string) => void;
}

const ClusterMap: React.FC<ClusterMapProps> = ({ 
  nodes, 
  selectedNodeId,
  onSelectNode
}) => {
  // Transform basic cluster nodes to enhanced cluster nodes
  const enhancedNodes: EnhancedClusterNode[] = nodes.map(node => ({
    ...node,
    type: node.type as 'hospital' | 'clinic',
    availableCount: Math.floor(node.equipmentCount * 0.6), // 60% available
    inUseCount: Math.floor(node.equipmentCount * 0.3), // 30% in use
    maintenanceCount: Math.floor(node.equipmentCount * 0.1), // 10% maintenance
    status: Math.random() > 0.8 ? 'partial' : 'operational' as 'operational' | 'partial' | 'offline',
    address: `${node.name} Medical Center, Lagos State`,
    contact: '+234 801 234 5678',
    lastUpdated: new Date().toISOString(),
  }));

  const handleRefresh = () => {
    console.log('Refreshing cluster data...');
    // In a real app, this would fetch fresh data from the API
  };

  return (
    <EnhancedClusterMap
      nodes={enhancedNodes}
      selectedNodeId={selectedNodeId}
      onSelectNode={onSelectNode}
      centerLat={6.5244}
      centerLng={3.3792}
      onRefresh={handleRefresh}
    />
  );
};

export default ClusterMap;
