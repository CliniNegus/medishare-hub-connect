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

  // Sample product data
  const products = [
    { 
      id: 1, 
      name: "Surgical Masks (50-pack)", 
      category: "PPE", 
      price: 12.99, 
      manufacturer: "MediProtect", 
      image: "/placeholder.svg", 
      description: "High-quality surgical masks with 3-layer protection.",
      inStock: true,
      type: "purchase" // Available to purchase
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
      type: "purchase" // Available to purchase
    },
    { 
      id: 3, 
      name: "Surgical Gowns (10-pack)", 
      category: "PPE", 
      price: 89.99, 
      manufacturer: "MediProtect", 
      image: "/placeholder.svg", 
      description: "Disposable surgical gowns with fluid resistance.",
      inStock: false,
      type: "purchase" // Available to purchase
    },
    { 
      id: 4, 
      name: "Digital Thermometer", 
      category: "Diagnostic", 
      price: 29.99, 
      manufacturer: "TempScan", 
      image: "/placeholder.svg", 
      description: "Fast-reading digital thermometer with LCD display.",
      inStock: true,
      type: "purchase" // Available to purchase
    },
    { 
      id: 5, 
      name: "MRI Machine - Standard Model", 
      category: "Imaging", 
      price: 789000, 
      manufacturer: "MediTech", 
      image: "/placeholder.svg", 
      description: "Standard MRI machine for diagnostic imaging.",
      inStock: true,
      type: "lease", // Available for lease
      leaseRate: 15000 // Monthly lease rate
    },
    { 
      id: 6, 
      name: "CT Scanner - Advanced", 
      category: "Imaging", 
      price: 450000, 
      manufacturer: "ImagingPro", 
      image: "/placeholder.svg", 
      description: "Advanced CT scanner with high-resolution imaging capabilities.",
      inStock: true,
      type: "finance", // Available for financing
      monthlyPayment: 12500 // Estimated monthly payment with financing
    },
    { 
      id: 7, 
      name: "Ultrasound Machine", 
      category: "Imaging", 
      price: 85000, 
      manufacturer: "SonoView", 
      image: "/placeholder.svg", 
      description: "Portable ultrasound machine with high-quality imaging.",
      inStock: true,
      type: "lease", // Available for lease
      leaseRate: 2500 // Monthly lease rate
    },
    { 
      id: 8, 
      name: "Anesthesia Workstation", 
      category: "Surgical", 
      price: 125000, 
      manufacturer: "SurgicalTech", 
      image: "/placeholder.svg", 
      description: "Complete anesthesia workstation for surgical procedures.",
      inStock: true,
      type: "finance", // Available for financing
      monthlyPayment: 3750 // Estimated monthly payment with financing
    }
  ];

  const uniqueCategories = ["all", ...new Set(products.map(product => product.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    const matchesType = productType === "all" || product.type === productType;
    return matchesSearch && matchesCategory && matchesType;
  });

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

        <ProductGrid products={filteredProducts} />
      </div>
    </Layout>
  );
};

export default MedicalShop;
