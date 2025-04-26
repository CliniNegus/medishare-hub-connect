
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ClientsList from '@/components/clients/ClientsList';
import ClientsImport from '@/components/clients/ClientsImport';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClientManagement = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Client Management</h1>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="list">Clients List</TabsTrigger>
            <TabsTrigger value="import">Import Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <ClientsList />
          </TabsContent>
          
          <TabsContent value="import">
            <ClientsImport />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClientManagement;
