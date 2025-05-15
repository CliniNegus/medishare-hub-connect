
import React, { useState } from 'react';
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
import { Product } from '@/components/shop/ProductGrid';

const PublicShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sample product data (using the same data structure as MedicalShop)
  const products: Product[] = [
    { 
      id: 1, 
      name: "Surgical Masks (50-pack)", 
      category: "PPE", 
      price: 12.99, 
      manufacturer: "MediProtect", 
      image: "/placeholder.svg", 
      description: "High-quality surgical masks with 3-layer protection.",
      inStock: true,
      popular: false,
      rating: 4.5
    },
    { 
      id: 2, 
      name: "Nitrile Examination Gloves (100-pack)", 
      category: "PPE", 
      price: 24.99, 
      manufacturer: "SafeTouch", 
      image: "/placeholder.svg", 
      description: "Powder-free nitrile examination gloves, suitable for medical procedures.",
      inStock: true,
      popular: true,
      rating: 4.8
    },
    // ... more products
  ];

  const uniqueCategories = ["all", ...new Set(products.map(product => product.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

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

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {!product.inStock && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Out of Stock
                    </Badge>
                  )}
                  {product.popular && (
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
                      disabled={!product.inStock}
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
