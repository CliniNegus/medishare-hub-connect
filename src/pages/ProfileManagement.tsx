import React from 'react';
import Layout from '@/components/Layout';
import ProfileForm from '@/components/profile/ProfileForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UserRound, Building, Shield } from 'lucide-react';

const ProfileManagement = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">Profile Management</h1>
            <p className="text-gray-600 mt-1">Manage your personal and organization information</p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Organization</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="organization" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500">Organization settings will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500">Security settings will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileManagement;
