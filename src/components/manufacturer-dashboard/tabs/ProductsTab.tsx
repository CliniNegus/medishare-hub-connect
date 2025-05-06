
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, Calendar } from "lucide-react";

interface LeasedProduct {
  id: string;
  name: string;
  model: string;
  hospital: string;
  leaseDate: string;
  leaseEnd: string;
  status: 'active' | 'maintenance' | 'expired';
}

interface ProductsTabProps {
  leasedProducts: LeasedProduct[];
}

const ProductsTab = ({ leasedProducts }: ProductsTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Leased Products</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Lease Date</TableHead>
            <TableHead>Lease End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leasedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.model}</TableCell>
              <TableCell>{product.hospital}</TableCell>
              <TableCell>{product.leaseDate}</TableCell>
              <TableCell>{product.leaseEnd}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                    product.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTab;
