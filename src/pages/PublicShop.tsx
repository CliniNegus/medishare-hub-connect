
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import CartSidebar from '@/components/shop/CartSidebar';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import { supabase } from '@/integrations/supabase/client';
import { useProducts, Product } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';

const PublicShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(["all"]);
  
  const { products, loading } = useProducts({ 
    category: category === 'all' ? undefined : category, 
    searchTerm 
  });
  
  const { addToCart } = useCart();

  // Fetch unique categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);
      
      if (!error && data) {
        const categories = [...new Set(data.map(item => item.category))];
        setUniqueCategories(["all", ...categories]);
      }
    };
    
    fetchCategories();
  }, []);

  const handleGuestPurchase = () => {
    toast({
      title: "Account Required",
      description: "Please create an account or sign in to complete your purchase.",
      variant: "default",
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-red-600">Medical Supplies Shop</h1>
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="outline" className="border-red-300">
                    Sign In
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-red-300"
                  onClick={() => toast({
                    title: "Guest Cart",
                    description: "Sign in to save your cart items",
                  })}
                >
                  <ShoppingCart className="h-5 w-5 text-red-600" />
                  <span>View Cart</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="border-red-300">
                <Filter className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100"></div>
                  <CardHeader className="p-4">
                    <CardTitle className="h-4 bg-gray-200 rounded w-3/4"></CardTitle>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={product.image_url || "/placeholder.svg"} 
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                    {product.stock_quantity <= 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-red-600">Popular</Badge>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-gray-500">{product.manufacturer}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{product.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 flex items-center justify-between">
                    <span className="font-bold text-red-600">${product.price}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        onClick={handleGuestPurchase}
                        disabled={product.stock_quantity <= 0}
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
        
        <CartSidebar />
        
        <ProductDetailsModal 
          product={selectedProduct}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </CartProvider>
  );
};

export default PublicShop;
