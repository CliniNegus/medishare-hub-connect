import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Archive, Download, RefreshCw, Upload, Loader, CheckCheck, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Backup {
  id: string;
  name: string;
  created_at: string;
  size: string;
  type: string;
  status: 'completed' | 'in_progress' | 'failed';
  download_url?: string;
}

const DataBackupSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backupType, setBackupType] = useState('full');
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [backupName, setBackupName] = useState('');

  React.useEffect(() => {
    if (user) {
      fetchBackups();
    }

    // Simulate progress updates
    if (backupInProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setBackupInProgress(false);
            toast({
              title: 'Backup Completed',
              description: 'Your data has been backed up successfully',
            });
            fetchBackups();
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [user, backupInProgress]);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      
      // Simulate API call to get backups
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockBackups: Backup[] = [
        {
          id: '1',
          name: 'Full System Backup',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          size: '42.5 MB',
          type: 'full',
          status: 'completed',
          download_url: '#'
        },
        {
          id: '2',
          name: 'User Data Only',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          size: '15.2 MB',
          type: 'partial',
          status: 'completed',
          download_url: '#'
        },
        {
          id: '3',
          name: 'Equipment Database',
          created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
          size: '8.7 MB',
          type: 'partial',
          status: 'completed',
          download_url: '#'
        }
      ];
      
      setBackups(mockBackups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load backup history',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const startBackup = async () => {
    if (!backupName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a name for your backup',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setBackupInProgress(true);
      setProgress(0);
      
      toast({
        title: 'Backup Started',
        description: 'Your data backup is in progress',
      });
      
      // The actual backup process is simulated with the useEffect above
    } catch (error) {
      console.error('Error starting backup:', error);
      toast({
        title: 'Error',
        description: 'Failed to start backup process',
        variant: 'destructive',
      });
      setBackupInProgress(false);
    }
  };

  const restoreFromBackup = async (backupId: string) => {
    try {
      setRestoreInProgress(true);
      setSelectedBackupId(backupId);
      
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: 'Restore Completed',
        description: 'Your data has been restored successfully',
      });
      
      setRestoreInProgress(false);
      setSelectedBackupId(null);
    } catch (error) {
      console.error('Error restoring from backup:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore from backup',
        variant: 'destructive',
      });
      setRestoreInProgress(false);
      setSelectedBackupId(null);
    }
  };

  const downloadBackup = (backupId: string) => {
    // In a real system, this would generate a download link
    toast({
      title: 'Download Started',
      description: 'Your backup file is being prepared for download',
    });
    
    // Simulate download preparation
    setTimeout(() => {
      toast({
        title: 'Download Ready',
        description: 'Your backup file is ready to download',
      });
    }, 2000);
  };

  const selectBackupTab = () => {
    const backupTab = document.querySelector('[data-value="backup"]');
    if (backupTab && backupTab instanceof HTMLElement) {
      backupTab.click();
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Backup & Recovery</CardTitle>
          <CardDescription>Please sign in to manage data backups</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Data Backup & Recovery</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBackups}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Securely backup and restore your system data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="backup" className="h-full flex flex-col">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="backup">Create Backup</TabsTrigger>
              <TabsTrigger value="restore">Restore & History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="backup" className="flex-1 overflow-auto p-4 mt-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="backup-name">Backup Name</Label>
                <Input
                  id="backup-name"
                  placeholder="Enter a name for this backup"
                  value={backupName}
                  onChange={e => setBackupName(e.target.value)}
                  disabled={backupInProgress}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-type">Backup Type</Label>
                <Select value={backupType} onValueChange={setBackupType} disabled={backupInProgress}>
                  <SelectTrigger id="backup-type">
                    <SelectValue placeholder="Select backup type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full System Backup</SelectItem>
                    <SelectItem value="users">User Data Only</SelectItem>
                    <SelectItem value="equipment">Equipment Database</SelectItem>
                    <SelectItem value="transactions">Transaction History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {backupInProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backup in progress...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={startBackup}
                  disabled={backupInProgress || !backupName.trim()}
                >
                  {backupInProgress ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating Backup...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </>
                  )}
                </Button>
              </div>
              
              <div className="rounded-lg border p-4 mt-6">
                <h3 className="text-sm font-medium mb-2">About Data Backups</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Full system backup includes all database tables and user files</li>
                  <li>• User data backup includes profiles, preferences, and permissions</li>
                  <li>• Equipment backup includes inventory, maintenance records, and equipment details</li>
                  <li>• Transaction backup includes financial records and payment history</li>
                  <li>• Backups are encrypted and stored securely in multiple locations</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="restore" className="flex-1 overflow-auto p-4 mt-0">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader className="h-6 w-6 animate-spin text-red-600" />
              </div>
            ) : backups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Archive className="h-12 w-12 text-gray-300 mb-2" />
                <p>No backups found</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={selectBackupTab}
                >
                  Create Your First Backup
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium mb-3">Backup History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map(backup => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-medium">{backup.name}</TableCell>
                        <TableCell>
                          {backup.type === 'full' ? 'Full System' : 'Partial'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(backup.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            backup.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : backup.status === 'in_progress' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {backup.status === 'completed' && <CheckCheck className="h-3 w-3 mr-1" />}
                            {backup.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                            {backup.status === 'completed' ? 'Completed' : backup.status === 'in_progress' ? 'In Progress' : 'Failed'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => downloadBackup(backup.id)}
                              disabled={backup.status !== 'completed'}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => restoreFromBackup(backup.id)}
                              disabled={restoreInProgress || backup.status !== 'completed'}
                            >
                              <Upload className={`h-4 w-4 ${restoreInProgress && selectedBackupId === backup.id ? 'animate-spin' : ''}`} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 rounded-lg border p-4 bg-gray-50">
                  <h3 className="text-sm font-medium mb-2">Restore Instructions</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Restoring from a backup will replace all current data with the data from the selected backup.
                    This action cannot be undone. Make sure to create a backup of your current data before restoring.
                  </p>
                  <div className="text-xs text-amber-600 font-medium">
                    Note: The system will be temporarily unavailable during the restore process.
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataBackupSystem;
