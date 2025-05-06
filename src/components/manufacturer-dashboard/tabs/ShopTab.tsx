
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus } from "lucide-react";

interface ShopProduct {
  id: string;
  name: string;
  type: 'disposable' | 'lease' | 'financing';
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

interface ShopTabProps {
  shopProducts: ShopProduct[];
}

const ShopTab = ({ shopProducts }: ShopTabProps) => {
  const [shopFilter, setShopFilter] = useState<'all' | 'disposable' | 'lease' | 'financing'>('all');
  
  const filteredShopProducts = shopFilter === 'all' 
    ? shopProducts 
    : shopProducts.filter(product => product.type === shopFilter);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Shop Products Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Catalog
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex items-center">
        <div className="text-sm font-medium mr-4">Filter by type:</div>
        <div className="flex space-x-2">
          <Button 
            variant={shopFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setShopFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={shopFilter === 'disposable' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setShopFilter('disposable')}
          >
            Disposables
          </Button>
          <Button 
            variant={shopFilter === 'lease' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setShopFilter('lease')}
          >
            Lease Equipment
          </Button>
          <Button 
            variant={shopFilter === 'financing' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setShopFilter('financing')}
          >
            Financing Options
          </Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredShopProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${product.type === 'disposable' ? 'bg-blue-100 text-blue-800' : 
                    product.type === 'lease' ? 'bg-purple-100 text-purple-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                </span>
              </TableCell>
              <TableCell>${product.price.toLocaleString()}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Remove</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShopTab;
