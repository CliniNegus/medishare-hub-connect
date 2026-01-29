
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import VisibilityControl, { VisibilityStatus } from './VisibilityControl';

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  has_variants?: boolean;
  created_at: string;
  visibility_status?: string | null;
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onRefresh?: () => void;
}

const ProductsTable = ({ products, loading, onEdit, onDelete, onRefresh }: ProductsTableProps) => {
  const { userRoles } = useAuth();
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table className="min-w-[800px] w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%] min-w-[180px]">Product</TableHead>
            <TableHead className="w-[12%] min-w-[90px]">Category</TableHead>
            <TableHead className="w-[10%] min-w-[80px]">Price</TableHead>
            <TableHead className="w-[10%] min-w-[70px]">Stock</TableHead>
            <TableHead className="w-[12%] min-w-[90px]">Manufacturer</TableHead>
            <TableHead className="w-[12%] min-w-[100px]">Status</TableHead>
            {userRoles.isAdmin && <TableHead className="w-[120px]">Visibility</TableHead>}
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="p-2">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[#333333] truncate text-sm" title={product.name}>
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-xs text-gray-500 truncate" title={product.description}>
                        {product.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-2">
                <Badge variant="outline" className="border-[#E02020]/20 text-[#E02020] text-xs whitespace-nowrap">
                  {product.category || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell className="font-medium p-2 text-sm">
                <span className="whitespace-nowrap">Ksh {product.price.toLocaleString()}</span>
                {product.has_variants && (
                  <span className="text-xs text-gray-500 block">+ variants</span>
                )}
              </TableCell>
              <TableCell className="p-2">
                <Badge 
                  variant={product.stock_quantity > 0 ? "default" : "destructive"}
                  className={`text-xs ${product.stock_quantity > 0 ? "bg-green-100 text-green-800" : ""}`}
                >
                  {product.stock_quantity}
                </Badge>
              </TableCell>
              <TableCell className="p-2">
                <span className="text-xs text-gray-600 truncate block" title={product.manufacturer || 'Not specified'}>
                  {product.manufacturer || 'N/A'}
                </span>
              </TableCell>
              <TableCell className="p-2">
                <div className="flex flex-col gap-1">
                  {product.is_featured && (
                    <Badge className="bg-[#E02020] text-white text-xs w-fit">Featured</Badge>
                  )}
                  <Badge 
                    variant="outline"
                    className={`text-xs whitespace-nowrap w-fit ${
                      product.stock_quantity > 0 
                        ? 'border-green-200 text-green-700' 
                        : 'border-red-200 text-red-700'
                    }`}
                  >
                    {product.stock_quantity > 0 ? 'In Stock' : 'Out'}
                  </Badge>
                </div>
              </TableCell>
              {userRoles.isAdmin && (
                <TableCell className="p-2">
                  <VisibilityControl
                    itemId={product.id}
                    itemType="product"
                    currentVisibility={product.visibility_status || 'hidden'}
                    itemName={product.name}
                    onVisibilityChange={() => {
                      onRefresh?.();
                    }}
                    compact
                  />
                </TableCell>
              )}
              <TableCell className="text-right p-2">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="text-[#333333] hover:text-[#E02020] hover:bg-[#E02020]/5 h-7 w-7 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
