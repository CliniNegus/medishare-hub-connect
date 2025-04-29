
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTabsProps } from './types';
import EquipmentTab from './tabs/EquipmentTab';
import MaintenanceTab from './tabs/MaintenanceTab';
import TransactionsTab from './tabs/TransactionsTab';

const DataTabs: React.FC<DataTabsProps> = ({ 
  recentEquipment, 
  maintenanceSchedule, 
  recentTransactions 
}) => {
  return (
    <div className="mt-6">
      <Tabs defaultValue="equipment" className="bg-white p-4 rounded-lg shadow-sm">
        <TabsList className="mb-4">
          <TabsTrigger value="equipment">Recent Equipment</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment">
          <EquipmentTab equipment={recentEquipment} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTab maintenance={maintenanceSchedule} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab transactions={recentTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataTabs;
