
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MedicalShop = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

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
      inStock: true 
    },
    { 
      id: 2, 
      name: "Nitrile Examination Gloves (100-pack)", 
      category: "PPE", 
      price: 24.99, 
      manufacturer: "SafeTouch", 
      image: "/placeholder.svg", 
      description: "Powder-free nitrile examination gloves, suitable for medical procedures.",
      inStock: true 
    },
    { 
      id: 3, 
      name: "Surgical Gowns (10-pack)", 
      category: "PPE", 
      price: 89.99, 
      manufacturer: "MediProtect", 
      image: "/placeholder.svg", 
      description: "Disposable surgical gowns with fluid resistance.",
      inStock: false 
    },
    { 
      id: 4, 
      name: "Digital Thermometer", 
      category: "Diagnostic", 
      price: 29.99, 
      manufacturer: "TempScan", 
      image: "/placeholder.svg", 
      description: "Fast-reading digital thermometer with LCD display.",
      inStock: true 
    },
    { 
      id: 5, 
      name: "Disposable Syringes (25-pack)", 
      category: "Instruments", 
      price: 15.99, 
      manufacturer: "MediSupply", 
      image: "/placeholder.svg", 
      description: "Sterile disposable syringes for medication administration.",
      inStock: true 
    },
    { 
      id: 6, 
      name: "Absorbent Gauze Pads (100-pack)", 
      category: "Wound Care", 
      price: 19.99, 
      manufacturer: "WoundCare", 
      image: "/placeholder.svg", 
      description: "Sterile absorbent gauze pads for wound dressing.",
      inStock: true 
    },
    { 
      id: 7, 
      name: "IV Administration Sets (10-pack)", 
      category: "Infusion", 
      price: 39.99, 
      manufacturer: "FluidFlow", 
      image: "/placeholder.svg", 
      description: "Sterile IV administration sets for fluid therapy.",
      inStock: true 
    },
    { 
      id: 8, 
      name: "Pulse Oximeter", 
      category: "Diagnostic", 
      price: 49.99, 
      manufacturer: "VitalCheck", 
      image: "/placeholder.svg", 
      description: "Fingertip pulse oximeter for measuring oxygen saturation.",
      inStock: true 
    }
  ];

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["all", ...new Set(products.map(product => product.category))];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Medical Supplies Shop</h1>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
            </Button>
          </div>
        </div>

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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <p className="text-sm text-gray-500">{product.manufacturer}</p>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <Button 
                  variant="default" 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MedicalShop;
