
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Calendar, ShoppingCart, 
  HeartPulse, CreditCard, BarChart3, Map 
} from "lucide-react";
import EquipmentTabContent from './EquipmentTabContent';
import BookingsTabContent from './BookingsTabContent';
import TherapyTabContent from './TherapyTabContent';
import FinancingTabContent from './FinancingTabContent';
import ShopTabContent from './ShopTabContent';
import HospitalAnalyticsTab from './HospitalAnalyticsTab';
import { ClusterMapView } from '../cluster-map';
import { EquipmentProps } from '../EquipmentCard';
import { ClusterNode } from '../ClusterMap';

interface HospitalDashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

const HospitalDashboardTabs: React.FC<HospitalDashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  equipmentData,
  clusterNodes,
  selectedClusterNode,
  setSelectedClusterNode,
  onBookEquipment,
  recentTransactions,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const tabConfig = [
    {
      value: 'equipment',
      label: 'Equipment',
      icon: Package,
      count: equipmentData.length,
    },
    {
      value: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      count: 8,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      value: 'cluster-map',
      label: 'Cluster Map',
      icon: Map,
    },
    {
      value: 'therapy',
      label: 'Therapy',
      icon: HeartPulse,
    },
    {
      value: 'financing',
      label: 'Financing',
      icon: CreditCard,
    },
    {
      value: 'shop',
      label: 'Medical Shop',
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Hospital Management Hub</h2>
        <p className="text-gray-600">Access equipment, manage bookings, and monitor your hospital operations</p>
      </div>
      
      <Tabs defaultValue="equipment" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-7 bg-gray-100 p-1 rounded-lg">
          {tabConfig.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm transition-all duration-200"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 data-[state=active]:bg-[#E02020] data-[state=active]:text-white rounded-full">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="equipment" className="space-y-4 mt-6">
          <EquipmentTabContent
            activeTab={activeTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            equipmentData={equipmentData}
            clusterNodes={clusterNodes}
            selectedClusterNode={selectedClusterNode}
            setSelectedClusterNode={setSelectedClusterNode}
            onBookEquipment={onBookEquipment}
            recentTransactions={recentTransactions}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4 mt-6">
          <BookingsTabContent
            equipmentData={equipmentData}
            onBookEquipment={onBookEquipment}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-6">
          <HospitalAnalyticsTab />
        </TabsContent>

        <TabsContent value="cluster-map" className="space-y-4 mt-6">
          <ClusterMapView />
        </TabsContent>

        <TabsContent value="therapy" className="space-y-4 mt-6">
          <TherapyTabContent equipmentData={equipmentData} />
        </TabsContent>

        <TabsContent value="financing" className="space-y-4 mt-6">
          <FinancingTabContent equipmentData={equipmentData} />
        </TabsContent>

        <TabsContent value="shop" className="space-y-4 mt-6">
          <ShopTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalDashboardTabs;
