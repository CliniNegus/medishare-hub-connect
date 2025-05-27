
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, CircleDollarSign, MapPin, 
  ShoppingCart, BarChart2 
} from "lucide-react";

import ProductsTab from './tabs/ProductsTab';
import ClustersTab from './tabs/ClustersTab';
import ShopTab from './tabs/ShopTab';
import PaymentsTab from './tabs/PaymentsTab';
import AnalyticsTab from './tabs/AnalyticsTab';

import { 
  leasedProducts, 
  clusterLocations, 
  paymentsReceived, 
  shopProducts 
} from './data/dashboardData';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('products');

  const tabConfig = [
    {
      value: 'products',
      label: 'Products',
      icon: Package,
      count: leasedProducts.length,
    },
    {
      value: 'clusters',
      label: 'Clusters',
      icon: MapPin,
      count: clusterLocations.length,
    },
    {
      value: 'shop',
      label: 'Shop Management',
      icon: ShoppingCart,
      count: shopProducts.length,
    },
    {
      value: 'payments',
      label: 'Payments',
      icon: CircleDollarSign,
      count: paymentsReceived.length,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Management Hub</h2>
        <p className="text-gray-600">Manage your products, payments, and analytics from one place</p>
      </div>
      
      <Tabs defaultValue="products" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
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

        <TabsContent value="products" className="space-y-4 mt-6">
          <ProductsTab leasedProducts={leasedProducts} />
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4 mt-6">
          <ClustersTab clusterLocations={clusterLocations} />
        </TabsContent>

        <TabsContent value="shop" className="space-y-4 mt-6">
          <ShopTab shopProducts={shopProducts} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 mt-6">
          <PaymentsTab paymentsReceived={paymentsReceived} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-6">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
