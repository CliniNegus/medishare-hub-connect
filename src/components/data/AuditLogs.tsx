
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardCheck, Download, Search, RefreshCw, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  old_values: any;
  new_values: any;
  created_at: string;
}

const AuditLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user, page, actionFilter, resourceFilter, dateRange]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }

      if (resourceFilter !== 'all') {
        query = query.eq('resource_type', resourceFilter);
      }

      if (dateRange !== 'all') {
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (dateRange) {
          case '24hours':
            cutoffDate.setDate(now.getDate() - 1);
            break;
          case '7days':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '30days':
            cutoffDate.setDate(now.getDate() - 30);
            break;
        }
        
        if (dateRange !== 'all') {
          query = query.gte('created_at', cutoffDate.toISOString());
        }
      }

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%,resource_id.ilike.%${searchTerm}%`);
      }

      // Calculate pagination
      const { count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      const totalItems = count || 0;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));

      // Get page of items
      const startRange = (page - 1) * itemsPerPage;
      const endRange = startRange + itemsPerPage - 1;
      
      const { data, error } = await query.range(startRange, endRange);

      if (error) throw error;
      
      setLogs(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audit logs',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchLogs();
  };

  const exportLogs = async () => {
    try {
      toast({
        title: 'Export Started',
        description: 'Audit logs export is being prepared',
      });

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to CSV
      const headers = ['Date', 'Action', 'Resource Type', 'Resource ID', 'User ID', 'IP Address'];
      const csvContent = [
        headers.join(','),
        ...(data || []).map(log => [
          format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
          log.action,
          log.resource_type,
          log.resource_id || '',
          log.user_id || '',
          log.ip_address || ''
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: 'Audit logs have been exported successfully',
      });
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to export audit logs',
        variant: 'destructive',
      });
    }
  };

  const getLogActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'create_backup':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'update_settings':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
      case 'logout':
      case 'page_access':
      case 'system_page_access':
        return 'bg-purple-100 text-purple-800';
      case 'send_message':
      case 'archive_data':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Please sign in to view audit logs</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Audit Logs</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage(1);
                fetchLogs();
              }}
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <CardDescription>
          Track and monitor all system activities and changes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2 overflow-hidden flex flex-col">
        <div className="mb-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="w-32">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                    <SelectItem value="LOGOUT">Logout</SelectItem>
                    <SelectItem value="PAGE_ACCESS">Page Access</SelectItem>
                    <SelectItem value="SEND_MESSAGE">Send Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select value={resourceFilter} onValueChange={setResourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="data_backup">Backup</SelectItem>
                    <SelectItem value="system_settings">Settings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24hours">Last 24 Hours</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Filter
              </Button>
            </div>
          </form>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ClipboardCheck className="h-16 w-16 text-gray-300 mb-2" />
              <p>No audit logs found matching your criteria</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100%-45px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getLogActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.resource_type}</div>
                        <div className="text-xs text-gray-500">{log.resource_id || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {log.user_id || 'System'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.new_values ? JSON.stringify(log.new_values) : 'No details'}
                      </TableCell>
                      <TableCell>{log.ip_address || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
