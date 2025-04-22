
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
  entity_type: string;
  entity_id: string;
  user_id: string;
  user_email: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

const AuditLogs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user, page, actionFilter, entityFilter, dateRange]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockLogs: AuditLog[] = [];
      const actions = ['create', 'update', 'delete', 'login', 'logout', 'export', 'import'];
      const entities = ['equipment', 'user', 'lease', 'maintenance', 'payment', 'backup', 'hospital'];
      
      const getRandomDate = () => {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30); // Random date within 30 days
        now.setDate(now.getDate() - daysAgo);
        return now.toISOString();
      };
      
      // Generate 100 random logs
      for (let i = 0; i < 100; i++) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        const entity = entities[Math.floor(Math.random() * entities.length)];
        
        mockLogs.push({
          id: `log-${i}`,
          action,
          entity_type: entity,
          entity_id: `${entity}-${Math.floor(Math.random() * 1000)}`,
          user_id: `user-${Math.floor(Math.random() * 20)}`,
          user_email: `user${Math.floor(Math.random() * 20)}@example.com`,
          details: `${action} operation on ${entity}`,
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          timestamp: getRandomDate()
        });
      }
      
      // Sort by timestamp, newest first
      mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Apply filters
      let filteredLogs = mockLogs;
      
      if (actionFilter !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.action === actionFilter);
      }
      
      if (entityFilter !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.entity_type === entityFilter);
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
        
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) > cutoffDate);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.action.toLowerCase().includes(term) ||
          log.entity_type.toLowerCase().includes(term) ||
          log.entity_id.toLowerCase().includes(term) ||
          log.user_email.toLowerCase().includes(term) ||
          log.details.toLowerCase().includes(term)
        );
      }
      
      // Calculate pagination
      const totalItems = filteredLogs.length;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      
      // Get page of items
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
      
      setLogs(paginatedLogs);
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

  const exportLogs = () => {
    toast({
      title: 'Export Started',
      description: 'Audit logs export is being prepared',
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Audit logs export is ready for download',
      });
    }, 2000);
  };

  const getLogActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
      case 'logout':
        return 'bg-purple-100 text-purple-800';
      case 'export':
      case 'import':
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
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="import">Import</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="backup">Backup</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
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
                    <TableHead>Entity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getLogActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.entity_type}</div>
                        <div className="text-xs text-gray-500">{log.entity_id}</div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {log.user_email}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>{log.ip_address}</TableCell>
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
