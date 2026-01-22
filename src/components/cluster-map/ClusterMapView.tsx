import React, { useState, useCallback } from 'react';
import { DEMO_CLUSTERS, getClusterById } from '@/data/clusterMapDemoData';
import ClusterMapCanvas from './ClusterMapCanvas';
import ClusterDetailsPanel from './ClusterDetailsPanel';

interface ClusterMapViewProps {
  className?: string;
}

const ClusterMapView: React.FC<ClusterMapViewProps> = ({ className }) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

  const handleSelectCluster = useCallback((clusterId: string | null) => {
    setSelectedClusterId(clusterId);
  }, []);

  const handleFacilityClick = useCallback((facilityId: string) => {
    // In a full implementation, this would center the map on the facility
    console.log('Facility clicked:', facilityId);
  }, []);

  const selectedCluster = selectedClusterId ? getClusterById(selectedClusterId) : null;

  return (
    <div className={`h-[calc(100vh-280px)] min-h-[500px] ${className || ''}`}>
      {/* Desktop: Side by side layout */}
      <div className="hidden md:grid md:grid-cols-[70%_30%] gap-4 h-full">
        <ClusterMapCanvas
          clusters={DEMO_CLUSTERS}
          selectedClusterId={selectedClusterId}
          onSelectCluster={handleSelectCluster}
          onSelectFacility={handleFacilityClick}
        />
        <ClusterDetailsPanel
          cluster={selectedCluster || null}
          onFacilityClick={handleFacilityClick}
        />
      </div>

      {/* Mobile: Stacked layout */}
      <div className="md:hidden flex flex-col gap-4 h-full">
        <div className="h-[300px] flex-shrink-0">
          <ClusterMapCanvas
            clusters={DEMO_CLUSTERS}
            selectedClusterId={selectedClusterId}
            onSelectCluster={handleSelectCluster}
            onSelectFacility={handleFacilityClick}
          />
        </div>
        <div className="flex-1 min-h-[300px]">
          <ClusterDetailsPanel
            cluster={selectedCluster || null}
            onFacilityClick={handleFacilityClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ClusterMapView;
