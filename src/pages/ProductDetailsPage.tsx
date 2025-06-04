
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Truck, Shield, Heart } from 'lucide-react';
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
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
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
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="max-h-96 max-w-full object-contain"
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-red-200 text-red-700">
                  {product.category || 'Medical Equipment'}
                </Badge>
                {product.is_featured && (
                  <Badge className="bg-red-600">Popular</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {product.manufacturer && (
                <p className="text-lg text-gray-600 mb-4">by {product.manufacturer}</p>
              )}

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">(Based on user reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-red-600">
              Ksh {currentPrice.toLocaleString()}
            </div>

            {/* Product Variants */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Available Options:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="font-medium">{variant.dimension_value}</div>
                      <div className="text-sm text-gray-600">
                        Ksh {variant.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {variant.stock_quantity} in stock
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? `${currentStock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
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
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Warranty Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Quality Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Product Specifications */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.sku && (
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="ml-2 text-gray-600">{product.sku}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-900">Weight:</span>
                  <span className="ml-2 text-gray-600">{product.weight} kg</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900">Type:</span>
                <span className="ml-2 text-gray-600">
                  {product.is_disposable ? 'Disposable' : 'Reusable'}
                </span>
              </div>
              {product.manufacturer && (
                <div>
                  <span className="font-medium text-gray-900">Manufacturer:</span>
                  <span className="ml-2 text-gray-600">{product.manufacturer}</span>
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
