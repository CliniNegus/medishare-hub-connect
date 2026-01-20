import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, FileText, Plus, RefreshCw, SkipForward, XCircle, Calendar, Package, Cpu, Search, Users } from 'lucide-react';
import { format } from 'date-fns';

const AdminCatalogUploads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-catalog-upload-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalog_upload_logs')
        .select(`
          *,
          profiles:manufacturer_id (
            full_name,
            email,
            organization
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = 
      log.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.profiles as any)?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.profiles as any)?.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCatalog = catalogFilter === 'all' || log.catalog_type === catalogFilter;
    const matchesMode = modeFilter === 'all' || log.upload_mode === modeFilter;
    
    return matchesSearch && matchesCatalog && matchesMode;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType === 'xlsx') {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    }
    return <FileText className="h-4 w-4 text-blue-600" />;
  };

  const getCatalogIcon = (catalogType: string) => {
    if (catalogType === 'products') {
      return <Package className="h-4 w-4" />;
    }
    return <Cpu className="h-4 w-4" />;
  };

  const totalStats = logs?.reduce((acc, log) => ({
    created: acc.created + log.records_created,
    updated: acc.updated + log.records_updated,
    skipped: acc.skipped + log.records_skipped,
    failed: acc.failed + log.records_failed
  }), { created: 0, updated: 0, skipped: 0, failed: 0 }) || { created: 0, updated: 0, skipped: 0, failed: 0 };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Catalog Uploads</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage catalog uploads from all manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Total Created</span>
              </div>
              <p className="text-3xl font-bold">{totalStats.created}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <RefreshCw className="h-5 w-5" />
                <span className="text-sm font-medium">Total Updated</span>
              </div>
              <p className="text-3xl font-bold">{totalStats.updated}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <SkipForward className="h-5 w-5" />
                <span className="text-sm font-medium">Total Skipped</span>
              </div>
              <p className="text-3xl font-bold">{totalStats.skipped}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Total Failed</span>
              </div>
              <p className="text-3xl font-bold">{totalStats.failed}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Logs</CardTitle>
            <CardDescription>
              All catalog uploads from manufacturers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by file name, manufacturer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={catalogFilter} onValueChange={setCatalogFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Catalog Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Upload Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="add">Add</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScrollArea className="h-[500px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead className="text-center">Created</TableHead>
                      <TableHead className="text-center">Updated</TableHead>
                      <TableHead className="text-center">Skipped</TableHead>
                      <TableHead className="text-center">Failed</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {(log.profiles as any)?.full_name || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(log.profiles as any)?.organization || (log.profiles as any)?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFileIcon(log.file_type)}
                            <span className="max-w-[150px] truncate" title={log.file_name}>
                              {log.file_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getCatalogIcon(log.catalog_type)}
                            <span className="capitalize">{log.catalog_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.upload_mode === 'add' ? 'default' : 'secondary'}>
                            {log.upload_mode === 'add' ? 'Add' : 'Update'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-600 font-medium">{log.records_created}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-blue-600 font-medium">{log.records_updated}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-muted-foreground">{log.records_skipped}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={log.records_failed > 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                            {log.records_failed}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!filteredLogs || filteredLogs.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No upload logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminCatalogUploads;
