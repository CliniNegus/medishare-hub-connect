import React from 'react';
import { Layout } from "@/components/Layout";
import { useRealTimeTracking } from "@/hooks/use-real-time-tracking";
import TrackingPageHeader from "@/components/tracking/TrackingPageHeader";
import EquipmentSidebarPanel from "@/components/tracking/EquipmentSidebarPanel";
import EquipmentDetailsPanel from "@/components/tracking/EquipmentDetailsPanel";
import TrackingLoadingState from "@/components/tracking/TrackingLoadingState";
import TrackingEmptyState from "@/components/tracking/TrackingEmptyState";

const EquipmentTracking = () => {
  const { 
    equipmentList, 
    selectedEquipmentId, 
    setSelectedEquipmentId,
    analytics,
    loading,
    refetch 
  } = useRealTimeTracking();

  const selectedEquipment = equipmentList.find(eq => eq.id === selectedEquipmentId);

  if (loading) {
    return (
      <Layout>
        <TrackingLoadingState />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <TrackingPageHeader onRefresh={refetch} />
          
          {equipmentList.length === 0 ? (
            <TrackingEmptyState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
              {/* Left Column - Equipment Sidebar */}
              <div className="lg:col-span-4">
                <EquipmentSidebarPanel
                  equipmentList={equipmentList}
                  selectedEquipmentId={selectedEquipmentId}
                  onSelectEquipment={setSelectedEquipmentId}
                />
              </div>
              
              {/* Right Column - Details Panel */}
              <div className="lg:col-span-8">
                <EquipmentDetailsPanel
                  selectedEquipment={selectedEquipment}
                  analytics={analytics}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentTracking;