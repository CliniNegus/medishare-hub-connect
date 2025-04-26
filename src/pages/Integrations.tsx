
import React from 'react';
import Layout from '@/components/Layout';
import ZohoIntegration from '@/components/integrations/ZohoIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Integrations = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">System Integrations</h1>
        
        <Tabs defaultValue="zoho" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="zoho">Zoho</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="more">More Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="zoho">
            <ZohoIntegration />
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>
                  Configure your email settings and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Email functionality is already integrated using Resend. 
                  You can send emails using the email service in your application.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="more">
            <Card>
              <CardHeader>
                <CardTitle>More Integrations</CardTitle>
                <CardDescription>
                  Additional integration options will be available soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['QuickBooks', 'Slack', 'Google Workspace', 'Microsoft 365', 'Salesforce', 'Zapier'].map((integration) => (
                    <Card key={integration} className="bg-muted/40 cursor-not-allowed">
                      <CardHeader className="p-4">
                        <CardTitle className="text-md">{integration}</CardTitle>
                        <CardDescription>Coming soon</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Integrations;
