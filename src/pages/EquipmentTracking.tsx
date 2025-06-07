
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
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 mb-2" />
              <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-28 sm:h-32 w-full" />
              ))}
            </div>
            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              <Skeleton className="h-64 sm:h-80 lg:h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <EquipmentTrackingHeader onRefresh={handleRefresh} />
        
        {equipmentList.length === 0 ? (
          <EmptyEquipmentState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <EquipmentSidebar
                equipmentList={equipmentList}
                selectedEquipmentId={selectedEquipmentId}
                onSelectEquipment={setSelectedEquipmentId}
              />
            </div>
            
            <div className="lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8 min-w-0">
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
    </Layout>
  );
};

export default EquipmentTracking;
