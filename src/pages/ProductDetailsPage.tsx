import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  manufacturer: string | null;
  sku: string | null;
  is_disposable: boolean | null;
  is_featured: boolean | null;
  weight: number | null;
  dimensions: any | null;
  rating: number | null;
  tags: string[] | null;
}

interface ProductVariant {
  id: string;
  dimension_name: string;
  dimension_value: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      setProduct(productData);

      // Fetch product variants if they exist
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .eq('is_active', true);

      if (variantsError) throw variantsError;

      setVariants(variantsData || []);
      if (variantsData && variantsData.length > 0) {
        setSelectedVariant(variantsData[0]);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

    if (currentStock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image_url: product.image_url,
      quantity,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const inStock = currentStock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center text-clinibuilds-red hover:text-red-700 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Shop
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-[500px] flex items-center justify-center overflow-hidden">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-3">
              <Badge variant="red-outline" className="px-3 py-1 text-sm font-medium">
                {product.category || 'Medical Equipment'}
              </Badge>
              {product.is_featured && (
                <Badge className="bg-clinibuilds-red px-3 py-1 text-sm font-medium">
                  Popular
                </Badge>
              )}
            </div>
            
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              
              {product.manufacturer && (
                <p className="text-lg text-gray-600 mb-4">
                  by <span className="font-medium text-gray-700">{product.manufacturer}</span>
                </p>
              )}

              {product.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">(Based on user reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-4xl font-bold text-clinibuilds-red mb-2">
                Ksh {currentPrice.toLocaleString()}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-gray-500" />
                <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? `${currentStock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Product Variants */}
            {variants.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Available Options:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-clinibuilds-red bg-red-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{variant.dimension_value}</div>
                      <div className="text-sm text-clinibuilds-red font-medium">
                        Ksh {variant.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {variant.stock_quantity} in stock
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
              {/* Quantity Selector */}
              {inStock && (
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full bg-clinibuilds-red hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-clinibuilds-red" />
                <span className="text-gray-700 font-medium">Quality Assured Medical Equipment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <Card className="mb-8 shadow-sm border-gray-100">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Specifications */}
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.sku && (
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-900">SKU</span>
                  <span className="text-gray-600">{product.sku}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-900">Weight</span>
                  <span className="text-gray-600">{product.weight} kg</span>
                </div>
              )}
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-gray-900">Type</span>
                <span className="text-gray-600">
                  {product.is_disposable ? 'Disposable' : 'Reusable'}
                </span>
              </div>
              {product.manufacturer && (
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-900">Manufacturer</span>
                  <span className="text-gray-600">{product.manufacturer}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
