
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTabsProps } from './types';
import EquipmentTab from './tabs/EquipmentTab';
import MaintenanceTab from './tabs/MaintenanceTab';
import TransactionsTab from './tabs/TransactionsTab';
import { Package, Wrench, CreditCard } from 'lucide-react';

const DataTabs: React.FC<DataTabsProps> = ({ 
  recentEquipment, 
  maintenanceSchedule, 
  recentTransactions 
}) => {
  const tabsConfig = [
    {
      value: "equipment",
      label: "Recent Equipment",
      icon: Package,
      count: recentEquipment.length,
    },
    {
      value: "maintenance",
      label: "Maintenance Schedule",
      icon: Wrench,
      count: maintenanceSchedule.length,
    },
    {
      value: "transactions",
      label: "Recent Transactions",
      icon: CreditCard,
      count: recentTransactions.length,
    },
  ];

  return (
    <div className="mt-8">
      <Tabs defaultValue="equipment" className="bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-2xl shadow-lg border border-gray-100">
        {/* Enhanced Tab List */}
        <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1 rounded-xl mb-6">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            
            return (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="flex items-center space-x-2 py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#E02020] transition-all duration-200"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full data-[state=active]:bg-[#E02020] data-[state=active]:text-white">
                  {tab.count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {/* Tab Content with enhanced styling */}
        <div className="min-h-[400px]">
          <TabsContent value="equipment" className="mt-0">
            <EquipmentTab equipment={recentEquipment} />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
            <MaintenanceTab maintenance={maintenanceSchedule} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <TransactionsTab transactions={recentTransactions} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DataTabs;
