
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleDashboard from '@/components/RoleDashboard';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductList } from '@/components/products/ProductList';
import type { Product, ProductFormValues } from '@/types/product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Shop {
  id: string;
  name: string;
  country: string;
}

const ProductManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shopIdFromUrl = queryParams.get('shop');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(shopIdFromUrl);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("add");
  
  useEffect(() => {
    fetchShops();
  }, [user]);
  
  useEffect(() => {
    fetchProducts();
  }, [selectedShop]);

  const fetchShops = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manufacturer_shops')
        .select('id, name, country')
        .eq('manufacturer_id', user.id);
      
      if (error) throw error;
      
      setShops(data || []);
      
      // If no shop is selected but we have shops, select the first one
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('equipment').select('*');
      
      if (role === 'manufacturer' && user) {
        query = query.eq('owner_id', user.id);
      }
      
      // Filter by selected shop if available
      if (selectedShop) {
        query = query.eq('shop_id', selectedShop);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
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
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        lease_rate: leaseRate,
        condition: values.condition,
        specs: values.specs,
        owner_id: user?.id,
        shop_id: selectedShop,
        status: 'Available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      if (editingProduct) {
        const { error } = await supabase
          .from('equipment')
          .update(productData)
          .eq('id', editingProduct.id);
          
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: `${values.name} has been updated successfully`,
        });
      } else {
        const { error } = await supabase
          .from('equipment')
          .insert(productData);
          
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
      console.error('Error saving product:', error.message);
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
      console.error('Error deleting product:', error.message);
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
              <div className="mb-6">
                <Label>Select Shop</Label>
                <Select value={selectedShop || ''} onValueChange={setSelectedShop}>
                  <SelectTrigger className="w-[280px] border-red-200 focus:ring-red-500">
                    <SelectValue placeholder="Select a shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        {shop.name} ({shop.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">No Virtual Shop Found</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You need to create a virtual shop before adding products. Create your first shop to continue.
              </p>
              <Button 
                onClick={() => navigate('/virtual-shops')} 
                className="bg-red-600 hover:bg-red-700"
              >
                Create a Shop
              </Button>
            </div>
          )}
        </div>
      </RoleDashboard>
    </ProtectedRoute>
  );
};

export default ProductManagement;
