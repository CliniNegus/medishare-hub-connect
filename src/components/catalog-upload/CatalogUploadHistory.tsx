import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSpreadsheet, FileText, Plus, RefreshCw, SkipForward, XCircle, Calendar, Package, Cpu } from 'lucide-react';
import { format } from 'date-fns';

const CatalogUploadHistory: React.FC = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const { data: logs, isLoading } = useQuery({
    queryKey: ['catalog-upload-logs', user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('catalog_upload_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Upload History</h3>
        <p className="text-muted-foreground">
          Your catalog upload history will appear here after you upload files.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Uploads</h3>
        <Badge variant="outline" className="text-muted-foreground">
          {logs.length} records
        </Badge>
      </div>

      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-center">
                <Plus className="h-4 w-4 inline mr-1" />
                Created
              </TableHead>
              <TableHead className="text-center">
                <RefreshCw className="h-4 w-4 inline mr-1" />
                Updated
              </TableHead>
              <TableHead className="text-center">
                <SkipForward className="h-4 w-4 inline mr-1" />
                Skipped
              </TableHead>
              <TableHead className="text-center">
                <XCircle className="h-4 w-4 inline mr-1" />
                Failed
              </TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(log.file_type)}
                    <span className="max-w-[200px] truncate" title={log.file_name}>
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
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default CatalogUploadHistory;
