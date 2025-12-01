import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductList } from '@/components/products/ProductList';
import { ShopSelector } from '@/components/products/ShopSelector';
import { NoShopsMessage } from '@/components/products/NoShopsMessage';
import { useProductManagement } from '@/hooks/use-product-management';
import type { Product } from '@/types/product';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFilters from '@/components/shop/ShopFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import CartSidebar from '@/components/shop/CartSidebar';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ShopFeatures from '@/components/shop/ShopFeatures';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import { useProducts } from '@/hooks/use-products';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Shop {
  id: string;
  name: string;
  country: string;
}

const ProductManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserRole();
  const { toast } = useToast();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("add");

  // Shopping view states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  
  const { totalItems, setIsOpen } = useCart();
  const { uniqueCategories } = useProducts();

  const { products, loading, handleSubmit, handleUpdate, handleDelete } = useProductManagement({
    selectedShop
  });

  // Check if user is manufacturer or admin
  const isManagementRole = profile?.role === 'manufacturer' || profile?.role === 'admin';

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
    if (isManagementRole) {
      fetchShops();
    }
  }, [user, isManagementRole]);

  // Render shopping view for hospital/investor users
  if (!isManagementRole) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#F5F5F5]">
          <div className="bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white py-8">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Medical Products Shop</h1>
                  <p className="text-white/90">Browse and purchase medical supplies and equipment</p>
                </div>
                <Button 
                  className="bg-white text-[#E02020] hover:bg-white/90"
                  onClick={() => setIsOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart ({totalItems})
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <CategoryNavigation
              selectedCategory={category}
              onCategoryChange={setCategory}
            />
            
            <ShopFilters
              searchTerm={searchTerm}
              category={category}
              productType={productType}
              sortBy={sortBy}
              uniqueCategories={uniqueCategories}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategory}
              onProductTypeChange={setProductType}
              onSortByChange={setSortBy}
            />
            
            <TrendingProducts />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-[#333333]">All Products</h2>
              <ProductGrid 
                filterOptions={{
                  category: category === 'all' ? undefined : category,
                  searchTerm,
                  productType: productType as 'all' | 'disposable' | 'reusable',
                  sortBy: sortBy as 'popularity' | 'price_low_to_high' | 'price_high_to_low' | 'newest'
                }}
              />
            </div>
            
            <ShopFeatures />
          </div>
          
          <CartSidebar />
        </div>
      </ProtectedRoute>
    );
  }

  // Render management view for manufacturer/admin users
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#E02020]">Product Management</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/virtual-shops')}
              className="border-[#E02020] text-[#E02020] hover:bg-red-50"
            >
              Manage Shops
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-[#E02020] text-[#E02020] hover:bg-red-50"
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
    </ProtectedRoute>
  );
};

export default ProductManagement;
