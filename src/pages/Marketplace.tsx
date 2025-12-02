import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Package, ShoppingCart, TrendingUp, Filter } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import ProductCard from '@/components/shop/ProductCard';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import { Product } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { products, loading, uniqueCategories } = useProducts({
    searchTerm: searchTerm || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const featuredProducts = useProducts({ featured: true });

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Medical Marketplace</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover high-quality medical equipment and supplies from trusted manufacturers worldwide
              </p>
              
              {/* Search Bar */}
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for medical equipment, supplies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg bg-background/80 backdrop-blur-sm border-2 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Products */}
          {featuredProducts.products.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </Card>
                  ))
                ) : (
                  featuredProducts.products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Categories Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </Badge>
              {uniqueCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* All Products */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="products" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="equipment" className="gap-2">
                <Package className="h-4 w-4" />
                Equipment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Available Products</CardTitle>
                  <CardDescription>
                    Browse all available medical products and supplies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">No products found</p>
                      <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {products.map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        Showing {products.length} products
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Marketplace</CardTitle>
                  <CardDescription>
                    Find medical equipment for purchase or lease
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">Equipment listings coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Browse our product catalog in the meantime
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => document.querySelector('[value="products"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      View Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <ProductDetailsModal
          product={selectedProduct}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Marketplace;
