
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleDashboard from '@/components/RoleDashboard';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductList } from '@/components/products/ProductList';
import { ShopSelector } from '@/components/products/ShopSelector';
import { NoShopsMessage } from '@/components/products/NoShopsMessage';
import { useProductManagement } from '@/hooks/use-product-management';
import type { Product } from '@/types/product';

interface Shop {
  id: string;
  name: string;
  country: string;
}

const ProductManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("add");

  const { products, loading, handleSubmit, handleUpdate, handleDelete } = useProductManagement({
    selectedShop
  });

  const fetchShops = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manufacturer_shops')
        .select('id, name, country')
        .eq('manufacturer_id', user.id);
      
      if (error) throw error;
      
      setShops(data || []);
      
      if (!selectedShop && data && data.length > 0) {
        setSelectedShop(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching shops:', error.message);
      toast({
        title: "Failed to load shops",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchShops();
  }, [user]);

  return (
    <ProtectedRoute>
      <RoleDashboard allowedRoles={['manufacturer', 'admin']}>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">Product Management</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/virtual-shops')}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Manage Shops
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
          
          {shops.length > 0 ? (
            <>
              <ShopSelector 
                shops={shops}
                selectedShop={selectedShop}
                onShopSelect={setSelectedShop}
              />
              
              <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="add">{editingProduct ? "Edit Product" : "Add Product"}</TabsTrigger>
                  <TabsTrigger value="list">Product List</TabsTrigger>
                </TabsList>
                
                <TabsContent value="add">
                  <ProductForm
                    onSubmit={editingProduct ? 
                      (values) => handleUpdate(editingProduct.id, values) : 
                      handleSubmit
                    }
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
            </>
          ) : (
            <NoShopsMessage />
          )}
        </div>
      </RoleDashboard>
    </ProtectedRoute>
  );
};

export default ProductManagement;
