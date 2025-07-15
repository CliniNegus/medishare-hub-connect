
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { Archive, Database, MessageCircle, Bell, FileText, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/contexts/UserRoleContext';
import { LazyComponent } from '@/components/performance/LazyComponent';
import { lazy } from 'react';
import { useSystemManagement } from '@/hooks/useSystemManagement';

// Lazy load components for better performance
const LazyMessagingSystem = lazy(() => import('@/components/communication/MessagingSystem'));
const LazyNotificationSystem = lazy(() => import('@/components/communication/NotificationSystem'));
const LazyEmailTemplateEditor = lazy(() => import('@/components/communication/EmailTemplateEditor'));
const LazyDataBackupSystem = lazy(() => import('@/components/data/DataBackupSystem'));
const LazyDataExport = lazy(() => import('@/components/data/DataExport'));
const LazyAuditLogs = lazy(() => import('@/components/data/AuditLogs'));
const LazyArchiveSystem = lazy(() => import('@/components/data/ArchiveSystem'));
const LazyChatSupport = lazy(() => import('@/components/communication/ChatSupport'));

const SystemManagement = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const { logAuditEvent } = useSystemManagement();
  const [activeTab, setActiveTab] = useState('communication');
  const [activeDataTab, setActiveDataTab] = useState('backup');
  const [activeCommunicationTab, setActiveCommunicationTab] = useState('messaging');
  
  useEffect(() => {
    if (user) {
      // Log page access for audit purposes
      logAuditEvent(
        'PAGE_ACCESS',
        'system_management_page'
      );
    }
  }, [user]);
  
  return (
    <Layout>
      <div className="py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-[#E02020]" />
              <CardTitle>System Management</CardTitle>
            </div>
            <CardDescription>
              Manage communication, data, and system performance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                <TabsTrigger value="communication" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#E02020]">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Communication
                </TabsTrigger>
                <TabsTrigger value="data" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#E02020]">
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="communication" className="mt-0 pt-0">
                <Tabs value={activeCommunicationTab} onValueChange={setActiveCommunicationTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
                    <TabsTrigger value="messaging" className="rounded-none">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Messaging
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-none">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    {role === 'admin' && (
                      <TabsTrigger value="emails" className="rounded-none">
                        <FileText className="h-4 w-4 mr-2" />
                        Email Templates
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="support" className="rounded-none">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Support Chat
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="messaging" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyMessagingSystem} 
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyNotificationSystem}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                  
                  {role === 'admin' && (
                    <TabsContent value="emails" className="pt-6 pb-6">
                      <LazyComponent 
                        component={LazyEmailTemplateEditor}
                        fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                      />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="support" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyChatSupport}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="data" className="mt-0 pt-0">
                <Tabs value={activeDataTab} onValueChange={setActiveDataTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
                    {role === 'admin' && (
                      <TabsTrigger value="backup" className="rounded-none">
                        <Database className="h-4 w-4 mr-2" />
                        Backup & Recovery
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="export" className="rounded-none">
                      <FileText className="h-4 w-4 mr-2" />
                      Data Export
                    </TabsTrigger>
                    <TabsTrigger value="audit" className="rounded-none">
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Audit Logs
                    </TabsTrigger>
                    {role === 'admin' && (
                      <TabsTrigger value="archive" className="rounded-none">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive System
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  {role === 'admin' && (
                    <TabsContent value="backup" className="pt-6 pb-6">
                      <LazyComponent 
                        component={LazyDataBackupSystem}
                        fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                      />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="export" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyDataExport}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                  
                  <TabsContent value="audit" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyAuditLogs}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                  
                  {role === 'admin' && (
                    <TabsContent value="archive" className="pt-6 pb-6">
                      <LazyComponent 
                        component={LazyArchiveSystem}
                        fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemManagement;
