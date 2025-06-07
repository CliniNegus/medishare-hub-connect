
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, RefreshCw, Loader, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ExportJob {
  id: string;
  table_name: string;
  format: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  record_count: number;
  file_size: string;
}

const DataExport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Form state
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');

  const availableTables = [
    'equipment',
    'orders',
    'leases',
    'maintenance',
    'hospitals',
    'profiles',
    'transactions',
    'bookings',
    'investments'
  ];

  useEffect(() => {
    if (user) {
      fetchExportJobs();
    }
  }, [user]);

  const fetchExportJobs = async () => {
    try {
      setLoading(true);
      
      // Since we don't have an export_jobs table yet, we'll simulate the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockJobs: ExportJob[] = [
        {
          id: '1',
          table_name: 'equipment',
          format: 'csv',
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          completed_at: new Date(Date.now() - 86000000).toISOString(),
          record_count: 150,
          file_size: '2.3 MB'
        },
        {
          id: '2',
          table_name: 'orders',
          format: 'excel',
          status: 'completed',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          completed_at: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
          record_count: 89,
          file_size: '1.8 MB'
        },
        {
          id: '3',
          table_name: 'profiles',
          format: 'json',
          status: 'in_progress',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          completed_at: null,
          record_count: 0,
          file_size: '0 MB'
        }
      ];
      
      setExportJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching export jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load export history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startExport = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one table to export',
        variant: 'destructive',
      });
      return;
    }

    try {
      setExporting(true);

      // Log the audit event
      await supabase.rpc('log_audit_event', {
        action_param: 'DATA_EXPORT',
        resource_type_param: 'export_job',
        resource_id_param: selectedTables.join(',')
      });

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Export Started',
        description: `Export job for ${selectedTables.length} table(s) has been queued`,
      });

      // Reset form
      setSelectedTables([]);
      setExportFormat('csv');
      setDateRange('all');

      // Refresh export jobs
      fetchExportJobs();
    } catch (error) {
      console.error('Error starting export:', error);
      toast({
        title: 'Error',
        description: 'Failed to start export process',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const downloadExport = (jobId: string) => {
    toast({
      title: 'Download Started',
      description: 'Your export file is being prepared for download',
    });
    
    // Simulate download preparation
    setTimeout(() => {
      toast({
        title: 'Download Ready',
        description: 'Your export file is ready to download',
      });
    }, 2000);
  };

  const handleTableToggle = (tableName: string, checked: boolean) => {
    if (checked) {
      setSelectedTables(prev => [...prev, tableName]);
    } else {
      setSelectedTables(prev => prev.filter(t => t !== tableName));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Please sign in to access data export features</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Data Export</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExportJobs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Export system data in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Export Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configure Export</h3>
            
            <div className="space-y-2">
              <Label>Select Tables to Export</Label>
              <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {availableTables.map(table => (
                    <div key={table} className="flex items-center space-x-2">
                      <Checkbox
                        id={table}
                        checked={selectedTables.includes(table)}
                        onCheckedChange={(checked) => handleTableToggle(table, checked as boolean)}
                      />
                      <label htmlFor={table} className="text-sm capitalize">
                        {table}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Export Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Tables selected: {selectedTables.length}</p>
                <p>• Format: {exportFormat.toUpperCase()}</p>
                <p>• Date range: {dateRange === 'all' ? 'All time' : dateRange}</p>
                <p>• Estimated size: ~{selectedTables.length * 0.5} MB</p>
              </div>
            </div>

            <Button
              onClick={startExport}
              disabled={exporting || selectedTables.length === 0}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {exporting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Starting Export...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Start Export
                </>
              )}
            </Button>
          </div>

          {/* Export History */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Export History</h3>
            <div className="border rounded-lg overflow-hidden h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-6 w-6 animate-spin text-red-600" />
                </div>
              ) : exportJobs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <FileText className="h-12 w-12 text-gray-300 mb-2 mr-2" />
                  <p>No export jobs yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportJobs.map(job => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium capitalize">
                          {job.table_name}
                        </TableCell>
                        <TableCell className="uppercase">
                          {job.format}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status === 'in_progress' && <Loader className="h-3 w-3 mr-1 animate-spin" />}
                            {job.status.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>{job.file_size}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => downloadExport(job.id)}
                            disabled={job.status !== 'completed'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
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

export default DataExport;
