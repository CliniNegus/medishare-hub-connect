
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminProductManagement } from '@/hooks/useAdminProductManagement';
import ProductsTable from './ProductsTable';
import AddProductModal from '../AddProductModal';
import EditProductModal from './EditProductModal';

const ProductManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const { products, loading, handleUpdate, handleDelete, fetchProducts } = useAdminProductManagement();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-gradient-to-r from-[#E02020]/5 to-transparent">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-[#333333]">
              Product Management
            </CardTitle>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#E02020] hover:bg-[#E02020]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name, description, or manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <ProductsTable
            products={filteredProducts}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        isAdmin={true}
        onProductAdded={handleProductAdded}
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          onUpdate={handleUpdate}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default ProductManagementSection;
