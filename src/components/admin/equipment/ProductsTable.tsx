
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
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductsTable = ({ products, loading, onEdit, onDelete }: ProductsTableProps) => {
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price (Ksh)</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-[#333333]">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {product.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-[#E02020]/20 text-[#E02020]">
                  {product.category || 'Uncategorized'}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                Ksh {product.price.toLocaleString()}
                {product.has_variants && (
                  <span className="text-xs text-gray-500 block">+ variants</span>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={product.stock_quantity > 0 ? "default" : "destructive"}
                  className={product.stock_quantity > 0 ? "bg-green-100 text-green-800" : ""}
                >
                  {product.stock_quantity} units
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {product.manufacturer || 'Not specified'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {product.is_featured && (
                    <Badge className="bg-[#E02020] text-white text-xs">Featured</Badge>
                  )}
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      product.stock_quantity > 0 
                        ? 'border-green-200 text-green-700' 
                        : 'border-red-200 text-red-700'
                    }`}
                  >
                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="text-[#333333] hover:text-[#E02020] hover:bg-[#E02020]/5"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
