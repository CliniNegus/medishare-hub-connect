import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
  headers: string[];
  data: Array<Record<string, any>>;
  mobileCardRenderer?: (item: any, index: number) => React.ReactNode;
  className?: string;
  cellRenderer?: (value: any, header: string, item: any) => React.ReactNode;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  headers,
  data,
  mobileCardRenderer,
  className,
  cellRenderer
}) => {
  const defaultMobileCard = (item: any, index: number) => (
    <div key={index} className="mobile-card">
      {headers.map((header) => (
        <div key={header} className="mobile-card-row">
          <span className="mobile-card-label">{header}:</span>
          <span className="mobile-card-value text-responsive">
            {cellRenderer ? cellRenderer(item[header.toLowerCase()], header, item) : item[header.toLowerCase()]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("mobile-table-wrapper", className)}>
      {/* Desktop Table View */}
      <div className="table-desktop table-responsive">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="text-responsive">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  {headers.map((header) => (
                    <TableCell key={header} className="text-responsive">
                      {cellRenderer ? cellRenderer(item[header.toLowerCase()], header, item) : item[header.toLowerCase()]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards md:hidden">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available
          </div>
        ) : (
          data.map((item, index) => 
            mobileCardRenderer ? mobileCardRenderer(item, index) : defaultMobileCard(item, index)
          )
        )}
      </div>
    </div>
  );
};

export default ResponsiveTable;