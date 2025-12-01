import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import type { StockLevel } from "@/hooks/use-manufacturer-analytics";

interface LowStockTableProps {
  items: StockLevel[];
  loading?: boolean;
  threshold?: number;
}

const LowStockTable: React.FC<LowStockTableProps> = ({ 
  items, 
  loading,
  threshold = 20 
}) => {
  const lowStockItems = items.filter(item => item.stock < threshold);

  const getStockBadge = (stock: number) => {
    if (stock < 10) {
      return <Badge variant="destructive">Critical</Badge>;
    }
    if (stock < 20) {
      return <Badge className="bg-amber-500">Low</Badge>;
    }
    return <Badge>Healthy</Badge>;
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#333333] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Low Stock Items
            </CardTitle>
            <p className="text-sm text-gray-600">Products below {threshold} units</p>
          </div>
          {lowStockItems.length > 0 && (
            <Badge variant="destructive" className="text-lg">
              {lowStockItems.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {lowStockItems.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-gray-500">
            <AlertTriangle className="h-12 w-12 mb-2 text-gray-300" />
            <p>All products are well stocked!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.product_id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.stock < 10 ? 'text-red-600 font-bold' : 'text-amber-600 font-semibold'}>
                        {item.stock} units
                      </span>
                    </TableCell>
                    <TableCell>{getStockBadge(item.stock)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockTable;
