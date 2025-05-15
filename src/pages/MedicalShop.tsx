
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFilters from '@/components/shop/ShopFilters';
import ProductGrid from '@/components/shop/ProductGrid';

const MedicalShop = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");

  // Sample product data - Now handled by the useEquipmentData hook inside ProductGrid
  const uniqueCategories = ["all", "PPE", "Diagnostic", "Imaging", "Surgical"];
  
  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <ShopHeader cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
        
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
      </div>
    </Layout>
  );
};

export default MedicalShop;
