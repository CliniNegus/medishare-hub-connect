
import React from 'react';
import Layout from '@/components/Layout';
import ClientsList from '@/components/clients/ClientsList';
import ClientsImport from '@/components/clients/ClientsImport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClientManagement = () => {
  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b bg-white">
            <h1 className="text-2xl font-bold text-[#333333]">Client Management</h1>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="list" className="flex-1 flex flex-col">
              <div className="px-6 py-4 border-b bg-white">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="list">Clients List</TabsTrigger>
                  <TabsTrigger value="import">Import Clients</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="list" className="h-full m-0 p-0">
                  <div className="h-full p-6">
                    <ClientsList />
                  </div>
                </TabsContent>
                
                <TabsContent value="import" className="h-full m-0 p-0">
                  <div className="h-full p-6">
                    <ClientsImport />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientManagement;
