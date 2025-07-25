
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFilters from '@/components/shop/ShopFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { CartProvider } from '@/contexts/CartContext';
import CartSidebar from '@/components/shop/CartSidebar';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ShopFeatures from '@/components/shop/ShopFeatures';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import { useProducts } from '@/hooks/use-products';

const MedicalShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  
  // Use the useProducts hook to get uniqueCategories
  const { uniqueCategories } = useProducts();
  
  return (
    <CartProvider>
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <ShopHeader />
          
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
            <h2 className="text-xl font-semibold mb-4">All Products</h2>
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
          
          <CartSidebar />
        </div>
      </Layout>
    </CartProvider>
  );
};

export default MedicalShop;
