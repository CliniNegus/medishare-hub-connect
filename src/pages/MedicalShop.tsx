
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, ClipboardList, Calculator } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentOptionsDialog from '@/components/PaymentOptionsDialog';

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
    const matchesType = productType === "all" || product.type === productType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const uniqueCategories = ["all", ...new Set(products.map(product => product.category))];

  const getActionButton = (product: any) => {
    if (product.type === "purchase") {
      return (
        <PaymentOptionsDialog
          productType="purchase"
          productName={product.name}
          price={product.price}
        >
          <Button 
            variant="default" 
            className="bg-red-600 hover:bg-red-700"
            disabled={!product.inStock}
          >
            Buy Now
          </Button>
        </PaymentOptionsDialog>
      );
    } else if (product.type === "lease") {
      return (
        <PaymentOptionsDialog
          productType="lease"
          productName={product.name}
          price={product.price}
          leaseRate={product.leaseRate}
        >
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Lease Options
          </Button>
        </PaymentOptionsDialog>
      );
    } else if (product.type === "finance") {
      return (
        <PaymentOptionsDialog
          productType="finance"
          productName={product.name}
          price={product.price}
          monthlyPayment={product.monthlyPayment}
        >
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Financing Options
          </Button>
        </PaymentOptionsDialog>
      );
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "purchase") return "";
    if (type === "lease") return <ClipboardList className="h-4 w-4 mr-1" />;
    if (type === "finance") return <Calculator className="h-4 w-4 mr-1" />;
  };

  const formatPrice = (price: number) => {
    return price >= 1000 ? 
      `$${(price/1000).toFixed(0)}K` : 
      `$${price.toFixed(2)}`;
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Medical Supplies Shop</h1>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2 border-red-300">
              <ShoppingCart className="h-5 w-5 text-red-600" />
              <span>Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
            </Button>
          </div>
        </div>

        {/* Product Type Tabs */}
        <Tabs defaultValue="all" value={productType} onValueChange={setProductType} className="mb-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              All Items
            </TabsTrigger>
            <TabsTrigger value="purchase" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Purchase
            </TabsTrigger>
            <TabsTrigger value="lease" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Lease
            </TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Finance
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                  </div>
                )}
                {product.type !== "purchase" && (
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      product.type === "lease" ? "bg-amber-100 text-amber-800 border-amber-300" : 
                      "bg-purple-100 text-purple-800 border-purple-300"
                    }`}
                  >
                    {getTypeIcon(product.type)}
                    {product.type === "lease" ? "Available for Lease" : "Financing Available"}
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="outline" className="border-red-300 text-red-600">{product.category}</Badge>
                </div>
                <p className="text-sm text-gray-500">{product.manufacturer}</p>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm">{product.description}</p>
                {product.type === "lease" && (
                  <p className="text-sm font-medium text-amber-700 mt-2">
                    Lease Rate: ${product.leaseRate}/month
                  </p>
                )}
                {product.type === "finance" && (
                  <p className="text-sm font-medium text-purple-700 mt-2">
                    Est. Payment: ${product.monthlyPayment}/month
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="font-bold">{formatPrice(product.price)}</span>
                {getActionButton(product)}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MedicalShop;
