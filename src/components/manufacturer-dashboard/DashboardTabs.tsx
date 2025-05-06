
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

  return (
    <Tabs defaultValue="products" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
      <TabsList>
        <TabsTrigger value="products" className="text-sm">
          <Package className="h-4 w-4 mr-2" />
          Products
        </TabsTrigger>
        <TabsTrigger value="clusters" className="text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          Clusters
        </TabsTrigger>
        <TabsTrigger value="shop" className="text-sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Shop Management
        </TabsTrigger>
        <TabsTrigger value="payments" className="text-sm">
          <CircleDollarSign className="h-4 w-4 mr-2" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="analytics" className="text-sm">
          <BarChart2 className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-4">
        <ProductsTab leasedProducts={leasedProducts} />
      </TabsContent>

      <TabsContent value="clusters" className="space-y-4">
        <ClustersTab clusterLocations={clusterLocations} />
      </TabsContent>

      <TabsContent value="shop" className="space-y-4">
        <ShopTab shopProducts={shopProducts} />
      </TabsContent>

      <TabsContent value="payments" className="space-y-4">
        <PaymentsTab paymentsReceived={paymentsReceived} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <AnalyticsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
