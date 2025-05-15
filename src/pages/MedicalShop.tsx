
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFilters from '@/components/shop/ShopFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { CartProvider } from '@/contexts/CartContext';
import CartSidebar from '@/components/shop/CartSidebar';

const MedicalShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");

  // Sample category data
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

          <ProductGrid />
          
          <CartSidebar />
        </div>
      </Layout>
    </CartProvider>
  );
};

export default MedicalShop;
