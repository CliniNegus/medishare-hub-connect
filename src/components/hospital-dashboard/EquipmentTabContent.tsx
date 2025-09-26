
import React, { useState } from 'react';
import DashboardContent from '../dashboard/DashboardContent';
import PopularEquipmentSection from '../dashboard/PopularEquipmentSection';
import { EquipmentProps } from '../EquipmentCard';
import { ClusterNode } from '../ClusterMap';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, FileText, Calendar, Settings, Database } from "lucide-react";
import EnhancedMaintenanceScheduler from '../maintenance/EnhancedMaintenanceScheduler';
import EquipmentQrScanner from '../equipment/EquipmentQrScanner';
import EquipmentHistory from '../equipment/EquipmentHistory';
import IoTIntegration from '../equipment/IoTIntegration';

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
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
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
  activeTab,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [equipmentSubTab, setEquipmentSubTab] = useState("overview");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  
  const selectedEquipment = selectedEquipmentId ? 
    equipmentData.find(eq => eq.id === selectedEquipmentId) : null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={equipmentSubTab} onValueChange={setEquipmentSubTab} className="w-full">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="qrscanner" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <QrCode className="h-4 w-4 mr-2" />
              QR Scanner
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="iot" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-2" />
              IoT Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-6">
              <PopularEquipmentSection onBookEquipment={onBookEquipment} />
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
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-red-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-600" />
                  Equipment Maintenance Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EnhancedMaintenanceScheduler />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qrscanner" className="mt-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-red-800 flex items-center">
                  <QrCode className="h-5 w-5 mr-2 text-red-600" />
                  QR Code Scanner for Equipment Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EquipmentQrScanner 
                  equipmentData={equipmentData}
                  onEquipmentScanned={setSelectedEquipmentId}
                  selectedEquipmentId={selectedEquipmentId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-red-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-red-600" />
                  Equipment History & Maintenance Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EquipmentHistory 
                  equipmentData={equipmentData}
                  selectedEquipmentId={selectedEquipmentId}
                  onSelectEquipment={setSelectedEquipmentId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iot" className="mt-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-red-800 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-red-600" />
                  IoT Integration Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <IoTIntegration 
                  equipmentData={equipmentData}
                  selectedEquipmentId={selectedEquipmentId}
                  onSelectEquipment={setSelectedEquipmentId}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EquipmentTabContent;
