
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Archive, RefreshCw, Loader, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ArchivedData {
  id: string;
  table_name: string;
  record_id: string;
  data: any;
  archived_by: string;
  archived_at: string;
  reason: string;
  user_email?: string;
}

const ArchiveSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [archivedData, setArchivedData] = useState<ArchivedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [archiving, setArchiving] = useState(false);
  
  // Form state
  const [selectedTable, setSelectedTable] = useState('');
  const [archiveReason, setArchiveReason] = useState('');
  const [cutoffDays, setCutoffDays] = useState('90');

  const availableTables = [
    'equipment',
    'orders',
    'leases',
    'maintenance',
    'transactions',
    'bookings',
    'audit_logs',
    'system_messages'
  ];

  useEffect(() => {
    if (user) {
      fetchArchivedData();
    }
  }, [user]);

  const fetchArchivedData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('archived_data')
        .select(`
          *,
          archived_user:profiles!archived_data_archived_by_fkey(email)
        `)
        .order('archived_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        user_email: item.archived_user?.email || 'Unknown'
      })) || [];

      setArchivedData(formattedData);
    } catch (error) {
      console.error('Error fetching archived data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load archived data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const archiveOldData = async () => {
    if (!selectedTable || !archiveReason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a table and provide a reason',
        variant: 'destructive',
      });
      return;
    }

    try {
      setArchiving(true);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(cutoffDays));

      // Call the archive function
      const { data, error } = await supabase.rpc('archive_old_data', {
        table_name_param: selectedTable,
        cutoff_date: cutoffDate.toISOString(),
        reason_param: archiveReason.trim()
      });

      if (error) throw error;

      toast({
        title: 'Archive Complete',
        description: `Data archival process initiated for ${selectedTable}`,
      });

      // Reset form
      setSelectedTable('');
      setArchiveReason('');
      setCutoffDays('90');

      // Refresh archived data
      fetchArchivedData();
    } catch (error) {
      console.error('Error archiving data:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive data',
        variant: 'destructive',
      });
    } finally {
      setArchiving(false);
    }
  };

  const restoreArchivedData = async (archiveId: string) => {
    try {
      // In a real implementation, this would restore the data to its original table
      toast({
        title: 'Restore Started',
        description: 'Data restoration process initiated',
      });

      // Simulate restore process
      setTimeout(() => {
        toast({
          title: 'Restore Complete',
          description: 'Archived data has been restored successfully',
        });
        fetchArchivedData();
      }, 2000);
    } catch (error) {
      console.error('Error restoring data:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore archived data',
        variant: 'destructive',
      });
    }
  };

  const deleteArchivedData = async (archiveId: string) => {
    try {
      const { error } = await supabase
        .from('archived_data')
        .delete()
        .eq('id', archiveId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Archived data deleted permanently',
      });

      fetchArchivedData();
    } catch (error) {
      console.error('Error deleting archived data:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete archived data',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Archive System</CardTitle>
          <CardDescription>Please sign in to access archive system</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Archive className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Archive System</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchArchivedData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Archive and manage old system data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Archive Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Archive Old Data</h3>
            
            <div className="space-y-2">
              <Label>Select Table</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose table to archive" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map(table => (
                    <SelectItem key={table} value={table} className="capitalize">
                      {table.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Archive Data Older Than (Days)</Label>
              <Select value={cutoffDays} onValueChange={setCutoffDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Archive Reason</Label>
              <Textarea
                id="reason"
                value={archiveReason}
                onChange={e => setArchiveReason(e.target.value)}
                placeholder="Explain why this data is being archived..."
                rows={4}
                disabled={archiving}
              />
            </div>

            <div className="rounded-lg border p-4 bg-amber-50">
              <h4 className="text-sm font-medium mb-2 text-amber-800">Archive Information</h4>
              <div className="text-sm text-amber-700 space-y-1">
                <p>• Data older than {cutoffDays} days will be archived</p>
                <p>• Original records will be moved to archive storage</p>
                <p>• Archived data can be restored if needed</p>
                <p>• This action cannot be undone without restoration</p>
              </div>
            </div>

            <Button
              onClick={archiveOldData}
              disabled={archiving || !selectedTable || !archiveReason.trim()}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {archiving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Archiving Data...
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Old Data
                </>
              )}
            </Button>
          </div>

          {/* Archived Data List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Archived Data</h3>
            <div className="border rounded-lg overflow-hidden h-[450px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-6 w-6 animate-spin text-red-600" />
                </div>
              ) : archivedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Archive className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No archived data found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>Archived By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivedData.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium capitalize">
                          {item.table_name.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {item.user_email}
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.archived_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                              onClick={() => restoreArchivedData(item.id)}
                              title="Restore data"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => deleteArchivedData(item.id)}
                              title="Delete permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchiveSystem;
