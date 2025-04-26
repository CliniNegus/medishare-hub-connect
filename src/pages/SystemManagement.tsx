
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { Archive, Database, MessageCircle, Bell, FileText, ClipboardCheck } from 'lucide-react';
import MessagingSystem from '@/components/communication/MessagingSystem';
import NotificationSystem from '@/components/communication/NotificationSystem';
import EmailTemplateEditor from '@/components/communication/EmailTemplateEditor';
import ChatSupport from '@/components/communication/ChatSupport';
import DataBackupSystem from '@/components/data/DataBackupSystem';
import DataExport from '@/components/data/DataExport';
import AuditLogs from '@/components/data/AuditLogs';
import ArchiveSystem from '@/components/data/ArchiveSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LazyComponent } from '@/components/performance/LazyComponent';
import { lazy } from 'react';

// Lazy load components for better performance
const LazyMessagingSystem = lazy(() => import('@/components/communication/MessagingSystem'));
const LazyNotificationSystem = lazy(() => import('@/components/communication/NotificationSystem'));
const LazyEmailTemplateEditor = lazy(() => import('@/components/communication/EmailTemplateEditor'));
const LazyChatSupport = lazy(() => import('@/components/communication/ChatSupport'));
const LazyDataBackupSystem = lazy(() => import('@/components/data/DataBackupSystem'));
const LazyDataExport = lazy(() => import('@/components/data/DataExport'));
const LazyAuditLogs = lazy(() => import('@/components/data/AuditLogs'));
const LazyArchiveSystem = lazy(() => import('@/components/data/ArchiveSystem'));

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState('messaging');
  const [activeDataTab, setActiveDataTab] = useState('backup');
  const [activeCommunicationTab, setActiveCommunicationTab] = useState('messaging');
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-red-600" />
              <CardTitle>System Management</CardTitle>
            </div>
            <CardDescription>
              Manage communication, data, and system performance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                <TabsTrigger value="communication" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Communication
                </TabsTrigger>
                <TabsTrigger value="data" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-600">
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
                    <TabsTrigger value="emails" className="rounded-none">
                      <FileText className="h-4 w-4 mr-2" />
                      Email Templates
                    </TabsTrigger>
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
                  
                  <TabsContent value="emails" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyEmailTemplateEditor}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                  
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
                    <TabsTrigger value="backup" className="rounded-none">
                      <Database className="h-4 w-4 mr-2" />
                      Backup & Recovery
                    </TabsTrigger>
                    <TabsTrigger value="export" className="rounded-none">
                      <FileText className="h-4 w-4 mr-2" />
                      Data Export
                    </TabsTrigger>
                    <TabsTrigger value="audit" className="rounded-none">
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Audit Logs
                    </TabsTrigger>
                    <TabsTrigger value="archive" className="rounded-none">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive System
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="backup" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyDataBackupSystem}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                  
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
                  
                  <TabsContent value="archive" className="pt-6 pb-6">
                    <LazyComponent 
                      component={LazyArchiveSystem}
                      fallback={<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg"></div>}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* The chat support widget is visible on all pages */}
        <ChatSupport />
      </div>
    </Layout>
  );
};

export default SystemManagement;
