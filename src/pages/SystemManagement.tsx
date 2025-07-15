
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
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b bg-white">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-[#E02020]" />
              <div>
                <h1 className="text-2xl font-bold text-[#333333]">System Management</h1>
                <p className="text-sm text-gray-600">
                  Manage communication, data, and system performance settings
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-6 py-4 border-b bg-white">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="communication">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Communication
                  </TabsTrigger>
                  <TabsTrigger value="data">
                    <Database className="h-4 w-4 mr-2" />
                    Data Management
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="communication" className="h-full m-0 p-0">
                  <div className="h-full flex flex-col">
                    <Tabs value={activeCommunicationTab} onValueChange={setActiveCommunicationTab} className="flex-1 flex flex-col">
                      <div className="px-6 py-4 border-b bg-white">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="messaging">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Messaging
                          </TabsTrigger>
                          <TabsTrigger value="notifications">
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                          </TabsTrigger>
                          {role === 'admin' && (
                            <TabsTrigger value="emails">
                              <FileText className="h-4 w-4 mr-2" />
                              Email Templates
                            </TabsTrigger>
                          )}
                          <TabsTrigger value="support">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Support Chat
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <TabsContent value="messaging" className="h-full m-0 p-0">
                          <div className="h-full p-6">
                            <LazyComponent 
                              component={LazyMessagingSystem} 
                              fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="notifications" className="h-full m-0 p-0">
                          <div className="h-full p-6">
                            <LazyComponent 
                              component={LazyNotificationSystem}
                              fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                            />
                          </div>
                        </TabsContent>
                        
                        {role === 'admin' && (
                          <TabsContent value="emails" className="h-full m-0 p-0">
                            <div className="h-full p-6">
                              <LazyComponent 
                                component={LazyEmailTemplateEditor}
                                fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                              />
                            </div>
                          </TabsContent>
                        )}
                        
                        <TabsContent value="support" className="h-full m-0 p-0">
                          <div className="h-full p-6">
                            <LazyComponent 
                              component={LazyChatSupport}
                              fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                            />
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </TabsContent>
                
                <TabsContent value="data" className="h-full m-0 p-0">
                  <div className="h-full flex flex-col">
                    <Tabs value={activeDataTab} onValueChange={setActiveDataTab} className="flex-1 flex flex-col">
                      <div className="px-6 py-4 border-b bg-white">
                        <TabsList className="grid w-full grid-cols-4">
                          {role === 'admin' && (
                            <TabsTrigger value="backup">
                              <Database className="h-4 w-4 mr-2" />
                              Backup & Recovery
                            </TabsTrigger>
                          )}
                          <TabsTrigger value="export">
                            <FileText className="h-4 w-4 mr-2" />
                            Data Export
                          </TabsTrigger>
                          <TabsTrigger value="audit">
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            Audit Logs
                          </TabsTrigger>
                          {role === 'admin' && (
                            <TabsTrigger value="archive">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive System
                            </TabsTrigger>
                          )}
                        </TabsList>
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        {role === 'admin' && (
                          <TabsContent value="backup" className="h-full m-0 p-0">
                            <div className="h-full p-6">
                              <LazyComponent 
                                component={LazyDataBackupSystem}
                                fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                              />
                            </div>
                          </TabsContent>
                        )}
                        
                        <TabsContent value="export" className="h-full m-0 p-0">
                          <div className="h-full p-6">
                            <LazyComponent 
                              component={LazyDataExport}
                              fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="audit" className="h-full m-0 p-0">
                          <div className="h-full p-6">
                            <LazyComponent 
                              component={LazyAuditLogs}
                              fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                            />
                          </div>
                        </TabsContent>
                        
                        {role === 'admin' && (
                          <TabsContent value="archive" className="h-full m-0 p-0">
                            <div className="h-full p-6">
                              <LazyComponent 
                                component={LazyArchiveSystem}
                                fallback={<div className="h-full animate-pulse bg-gray-100 rounded-lg"></div>}
                              />
                            </div>
                          </TabsContent>
                        )}
                      </div>
                    </Tabs>
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

export default SystemManagement;
