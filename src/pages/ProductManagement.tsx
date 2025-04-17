import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleDashboard from '@/components/RoleDashboard';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductList } from '@/components/products/ProductList';
import type { Product, ProductFormValues } from '@/types/product';

const ProductManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("add");
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('equipment').select('*');
      
      if (role === 'manufacturer' && user) {
        query = query.eq('owner_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const leaseRate = values.lease_rate || Math.round(values.price * 0.05);
      
      if (editingProduct) {
        const { error } = await supabase
          .from('equipment')
          .update({
            ...values,
            lease_rate: leaseRate,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);
          
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: `${values.name} has been updated successfully`,
        });
      } else {
        const { error } = await supabase
          .from('equipment')
          .insert({
            ...values,
            lease_rate: leaseRate,
            owner_id: user?.id,
            status: 'Available',
          });
          
        if (error) throw error;
        
        toast({
          title: "Product added",
          description: `${values.name} has been added to your inventory`,
        });
      }
      
      setEditingProduct(null);
      setActiveTab("list");
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Failed to save product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <RoleDashboard allowedRoles={['manufacturer', 'admin']}>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">Product Management</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Back to Dashboard
            </Button>
          </div>
          
          <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="add">{editingProduct ? "Edit Product" : "Add Product"}</TabsTrigger>
              <TabsTrigger value="list">Product List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add">
              <ProductForm
                onSubmit={handleSubmit}
                initialValues={editingProduct || undefined}
                isLoading={loading}
                isEditing={!!editingProduct}
                onCancel={() => {
                  setEditingProduct(null);
                  setActiveTab("list");
                }}
              />
            </TabsContent>
            
            <TabsContent value="list">
              <ProductList
                products={products}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setActiveTab("add");
                }}
                onDelete={handleDelete}
                onAdd={() => setActiveTab("add")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </RoleDashboard>
    </ProtectedRoute>
  );
};

export default ProductManagement;
