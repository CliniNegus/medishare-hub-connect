
import React from 'react';
import { Layout } from '@/components/Layout';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFilters from '@/components/shop/ShopFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { CartProvider } from '@/contexts/CartContext';
import TrendingProducts from '@/components/shop/TrendingProducts';

const MedicalShop = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [productType, setProductType] = React.useState("all");

  // Sample categories - in a real app would come from the API
  const uniqueCategories = ["all", "PPE", "Diagnostic", "Imaging", "Surgical"];
  
  return (
    <CartProvider>
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <ShopHeader />
          
          <ShopFilters 
            searchTerm={searchTerm}
            category={category}
            productType={productType}
            uniqueCategories={uniqueCategories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategory}
            onProductTypeChange={setProductType}
          />

          <TrendingProducts />

          <div className="mt-10 mb-6">
            <h2 className="text-xl font-bold">All Products</h2>
          </div>

          <ProductGrid />
        </div>
      </Layout>
    </CartProvider>
  );
};

export default MedicalShop;
