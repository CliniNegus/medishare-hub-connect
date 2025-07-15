
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ClientsList from '@/components/clients/ClientsList';
import ClientsImport from '@/components/clients/ClientsImport';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClientManagement = () => {
  return (
    <Layout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Client Management</h1>
          
          <Tabs defaultValue="list" className="w-full h-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="list">Clients List</TabsTrigger>
              <TabsTrigger value="import">Import Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="h-full">
              <ClientsList />
            </TabsContent>
            
            <TabsContent value="import" className="h-full">
              <ClientsImport />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ClientManagement;
