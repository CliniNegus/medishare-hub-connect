
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CSVPreviewProps {
  data: any[];
  errors: string[];
}

const CSVPreview: React.FC<CSVPreviewProps> = ({ data, errors }) => {
  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <h4 className="text-sm font-medium text-destructive mb-2">Validation Errors:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-destructive">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 5).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name || '-'}</TableCell>
                <TableCell>{row.email || '-'}</TableCell>
                <TableCell>{row.phone || '-'}</TableCell>
                <TableCell>{row.address || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length > 5 && (
          <div className="py-2 text-center text-sm text-muted-foreground border-t">
            And {data.length - 5} more rows...
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVPreview;
