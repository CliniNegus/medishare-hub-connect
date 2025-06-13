
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Search, Star, TrendingUp, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';
import CartSidebar from '@/components/shop/CartSidebar';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import TrendingProducts from '@/components/shop/TrendingProducts';
import { useProducts, Product, ProductFilterOptions } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';
import ShopFilters from '@/components/shop/ShopFilters';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/navigation/Sidebar';

const PublicShopContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const filterOptions: ProductFilterOptions = {
    category: category === 'all' ? undefined : category,
    searchTerm,
    productType: productType as 'all' | 'disposable' | 'reusable',
    sortBy: sortBy as 'popularity' | 'price_low_to_high' | 'price_high_to_low' | 'newest'
  };
  
  const { products, loading, uniqueCategories } = useProducts(filterOptions);
  const { addToCart, setIsOpen, totalItems } = useCart();

  const handleViewCart = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to view your cart.",
        variant: "default",
      });
      navigate('/auth');
      return;
    }
    setIsOpen(true);
  };

  const handleViewDetails = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      {/* Sidebar Navigation */}
      {user && <Sidebar />}
      
      <div className={`flex-1 ${user ? 'ml-64' : ''}`}>
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Medical Supplies Shop
                  </h1>
                  <p className="text-gray-600 text-sm">Professional healthcare equipment & supplies</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline" className="border-red-200 hover:border-red-300 hover:bg-red-50 font-medium">
                      Sign In
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="primary-red"
                  className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleViewCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>View Cart</span>
                  {totalItems > 0 && (
                    <Badge className="bg-white text-red-600 ml-1">{totalItems}</Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12 bg-gradient-to-r from-red-50 via-white to-red-50 rounded-2xl border border-red-100">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find the Perfect Medical Equipment
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Discover high-quality medical supplies and equipment from trusted manufacturers worldwide
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for medical supplies, equipment, or manufacturers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Trending Products Section */}
          <TrendingProducts />

          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <Filter className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
            </div>
            
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
          </div>

          {/* Products Grid Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
                  <p className="text-sm text-gray-600">Browse our complete medical equipment catalog</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {products.length} items
              </Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <Card key={idx} className="overflow-hidden border-0 shadow-lg">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
                    <CardHeader className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img 
                        src={product.image_url || "/placeholder.svg"} 
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      
                      {product.stock_quantity <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive" className="text-white shadow-lg">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      
                      {product.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 border-0 shadow-md">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      
                      {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                        <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 border-orange-200 text-orange-700">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 font-medium">{product.manufacturer}</p>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
                          {product.category || 'Medical Equipment'}
                        </Badge>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 flex items-center justify-between">
                      <span className="font-bold text-xl text-red-600">Ksh {product.price.toLocaleString()}</span>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleViewDetails(e, product)}
                        className="border-gray-200 hover:border-red-300 hover:bg-red-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && products.length === 0 && (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <CartSidebar />
      
      <ProductDetailsModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

const PublicShop = () => {
  return (
    <PublicShopContent />
  );
};

export default PublicShop;
