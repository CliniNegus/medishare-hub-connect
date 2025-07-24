
import React from 'react';
import { Layout } from "@/components/Layout";
import { useRealTimeTracking } from "@/hooks/use-real-time-tracking";
import { Skeleton } from "@/components/ui/skeleton";
import EquipmentTrackingHeader from "@/components/tracking/EquipmentTrackingHeader";
import EquipmentSidebar from "@/components/tracking/EquipmentSidebar";
import EquipmentDetailsHeader from "@/components/tracking/EquipmentDetailsHeader";
import EquipmentTabs from "@/components/tracking/EquipmentTabs";
import EmptyEquipmentState from "@/components/tracking/EmptyEquipmentState";

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

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          <EquipmentTrackingHeader onRefresh={handleRefresh} />
          
          {equipmentList.length === 0 ? (
            <EmptyEquipmentState />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
              {/* Equipment Sidebar - Fixed width on large screens */}
              <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                <div className="sticky top-6">
                  <EquipmentSidebar
                    equipmentList={equipmentList}
                    selectedEquipmentId={selectedEquipmentId}
                    onSelectEquipment={setSelectedEquipmentId}
                  />
                </div>
              </div>
              
              {/* Main Content - Takes remaining space */}
              <div className="flex-1 min-w-0 space-y-6">
                {selectedEquipment && (
                  <>
                    <EquipmentDetailsHeader equipment={selectedEquipment} />
                    <EquipmentTabs
                      analytics={analytics}
                      equipmentName={selectedEquipment.name}
                      equipmentId={selectedEquipment.id}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EquipmentTracking;
