
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ZohoBooksIntegration from '@/components/integrations/ZohoBooksIntegration';
import CliniBuildsLogo from '@/components/profile/CliniBuildsLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('general');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">System Management</h1>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Overview of the system and technical details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Version</span>
                      <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Environment</span>
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                        Production
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Database</span>
                      <span>PostgreSQL via Supabase</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Last Updated</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <CliniBuildsLogo />
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <ZohoBooksIntegration />
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="grid gap-6 md:grid-cols-1">
              <CliniBuildsLogo />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SystemManagement;
