import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Cpu, FileSpreadsheet, History } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductCSVUpload from '@/components/catalog-upload/ProductCSVUpload';
import EquipmentCSVUpload from '@/components/catalog-upload/EquipmentCSVUpload';
import CatalogUploadHistory from '@/components/catalog-upload/CatalogUploadHistory';

const CatalogUpload = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Catalog Upload</h1>
          </div>
          <p className="text-muted-foreground">
            Bulk upload your products and equipment using CSV or Excel files. Add new items or update existing catalog entries.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Choose the type of catalog you want to upload. Supports CSV and Excel (.xlsx) formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Equipment
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Upload History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <ProductCSVUpload />
              </TabsContent>

              <TabsContent value="equipment">
                <EquipmentCSVUpload />
              </TabsContent>

              <TabsContent value="history">
                <CatalogUploadHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CatalogUpload;
