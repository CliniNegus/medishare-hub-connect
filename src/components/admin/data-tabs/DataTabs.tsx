
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
      <Tabs defaultValue="equipment" className="bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        {/* Enhanced Tab List */}
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-gray-100/50 p-1 rounded-xl mb-6 gap-1 sm:gap-0">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            
            return (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#E02020] transition-all duration-200 text-sm sm:text-base"
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-medium hidden sm:inline">{tab.label}</span>
                <span className="font-medium sm:hidden">{tab.label.split(' ')[0]}</span>
                <span className="bg-gray-200 text-gray-600 text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full data-[state=active]:bg-[#E02020] data-[state=active]:text-white text-[10px] sm:text-xs">
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
