
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useProducts, Product, ProductFilterOptions } from '@/hooks/use-products';
import CartSidebar from '@/components/shop/CartSidebar';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ShopFilters from '@/components/shop/ShopFilters';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/navigation/Sidebar';
import PublicShopHeader from '@/components/shop/PublicShopHeader';
import SearchHero from '@/components/shop/SearchHero';
import ProductsSection from '@/components/shop/ProductsSection';

const PublicShopContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  
  const filterOptions: ProductFilterOptions = {
    category: category === 'all' ? undefined : category,
    searchTerm,
    productType: productType as 'all' | 'disposable' | 'reusable',
    sortBy: sortBy as 'popularity' | 'price_low_to_high' | 'price_high_to_low' | 'newest'
  };
  
  const { products, loading, uniqueCategories } = useProducts(filterOptions);

  const handleViewDetails = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      {/* Sidebar Navigation */}
      {user && <Sidebar />}
      
      <div className={`flex-1 ${user ? 'ml-64' : ''}`}>
        {/* Modern Header */}
        <PublicShopHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero Section */}
          <SearchHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
          <ProductsSection 
            products={products}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
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
