import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ValidationError } from './types';

interface CSVPreviewTableProps {
  data: Record<string, any>[];
  columns: string[];
  errors: ValidationError[];
  maxPreviewRows?: number;
}

const CSVPreviewTable: React.FC<CSVPreviewTableProps> = ({ 
  data, 
  columns, 
  errors,
  maxPreviewRows = 10
}) => {
  const getRowErrors = (rowIndex: number): ValidationError[] => {
    return errors.filter(e => e.row === rowIndex + 2);
  };

  const getCellError = (rowIndex: number, field: string): ValidationError | undefined => {
    return errors.find(e => e.row === rowIndex + 2 && e.field === field);
  };

  const displayData = data.slice(0, maxPreviewRows);
  const hasMore = data.length > maxPreviewRows;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {errors.length === 0 ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                All {data.length} rows passed validation
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {errors.length} validation error(s) found
              </span>
            </>
          )}
        </div>
        <Badge variant="outline">
          {data.length} total rows
        </Badge>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-12">Status</TableHead>
              {columns.map((col) => (
                <TableHead key={col} className="min-w-[120px]">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, rowIndex) => {
              const rowErrors = getRowErrors(rowIndex);
              const hasErrors = rowErrors.length > 0;
              
              return (
                <TableRow 
                  key={rowIndex}
                  className={hasErrors ? 'bg-destructive/5' : ''}
                >
                  <TableCell className="text-muted-foreground text-sm">
                    {rowIndex + 1}
                  </TableCell>
                  <TableCell>
                    {hasErrors ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  {columns.map((col) => {
                    const cellError = getCellError(rowIndex, col);
                    return (
                      <TableCell 
                        key={col}
                        className={cellError ? 'text-destructive font-medium' : ''}
                        title={cellError?.message}
                      >
                        <div className="max-w-[200px] truncate">
                          {row[col] !== undefined && row[col] !== null 
                            ? String(row[col]) 
                            : <span className="text-muted-foreground">-</span>
                          }
                        </div>
                        {cellError && (
                          <div className="text-xs text-destructive mt-1">
                            {cellError.message}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {hasMore && (
          <div className="py-3 text-center text-sm text-muted-foreground border-t bg-muted/30">
            Showing first {maxPreviewRows} of {data.length} rows
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVPreviewTable;
