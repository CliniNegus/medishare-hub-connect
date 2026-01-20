import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Plus, RefreshCw, SkipForward, ArrowRight } from 'lucide-react';
import { PreviewRecord, RecordStatus } from './types';

interface EnhancedPreviewTableProps<T> {
  records: PreviewRecord<T>[];
  columns: string[];
}

const statusConfig: Record<RecordStatus, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'New', color: 'bg-green-100 text-green-800 border-green-200', icon: <Plus className="h-3 w-3" /> },
  update: { label: 'Update', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <RefreshCw className="h-3 w-3" /> },
  error: { label: 'Error', color: 'bg-red-100 text-red-800 border-red-200', icon: <AlertCircle className="h-3 w-3" /> },
  skip: { label: 'Skip', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <SkipForward className="h-3 w-3" /> }
};

function EnhancedPreviewTable<T extends Record<string, any>>({ records, columns }: EnhancedPreviewTableProps<T>) {
  const displayColumns = columns.slice(0, 6);

  const getCellValue = (record: PreviewRecord<T>, column: string) => {
    const value = record.data[column];
    const change = record.changes?.find(c => c.field === column);
    const hasError = record.errors.some(e => e.field === column);

    if (change) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1 rounded">
                <span className="line-through text-muted-foreground text-xs">{String(change.oldValue ?? '')}</span>
                <ArrowRight className="h-3 w-3 flex-shrink-0" />
                <span className="font-medium">{String(change.newValue ?? '')}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Will change from "{change.oldValue}" to "{change.newValue}"</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <span className={hasError ? 'text-destructive font-medium' : ''}>
        {value !== undefined && value !== null && value !== '' ? String(value) : '-'}
      </span>
    );
  };

  const summary = {
    new: records.filter(r => r.status === 'new').length,
    update: records.filter(r => r.status === 'update').length,
    skip: records.filter(r => r.status === 'skip').length,
    error: records.filter(r => r.status === 'error').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {summary.new > 0 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Plus className="h-3 w-3 mr-1" /> {summary.new} New
          </Badge>
        )}
        {summary.update > 0 && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <RefreshCw className="h-3 w-3 mr-1" /> {summary.update} Updates
          </Badge>
        )}
        {summary.skip > 0 && (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            <SkipForward className="h-3 w-3 mr-1" /> {summary.skip} Skipped
          </Badge>
        )}
        {summary.error > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> {summary.error} Errors
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[60px]">Row</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              {displayColumns.map((col) => (
                <TableHead key={col} className="capitalize">
                  {col.replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => {
              const config = statusConfig[record.status];
              return (
                <TableRow 
                  key={index} 
                  className={record.status === 'error' ? 'bg-red-50/50' : record.status === 'skip' ? 'bg-gray-50/50' : ''}
                >
                  <TableCell className="font-mono text-sm">{record.rowIndex + 2}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${config.color} flex items-center gap-1 w-fit`}>
                      {config.icon}
                      {config.label}
                    </Badge>
                  </TableCell>
                  {displayColumns.map((col) => (
                    <TableCell key={col} className="max-w-[200px] truncate">
                      {getCellValue(record, col)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {records.some(r => r.errors.length > 0) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="font-medium text-red-800 mb-2">Validation Errors</h4>
          <ul className="space-y-1 text-sm text-red-700">
            {records.flatMap(r => r.errors).slice(0, 10).map((error, i) => (
              <li key={i}>Row {error.row}: {error.message}</li>
            ))}
            {records.flatMap(r => r.errors).length > 10 && (
              <li className="text-muted-foreground">...and {records.flatMap(r => r.errors).length - 10} more errors</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EnhancedPreviewTable;
