import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  stock_quantity: number;
}

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productIds = wishlistItems.map(item => item.product_id);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!wishlistLoading) {
      fetchProducts();
    }
  }, [wishlistItems, wishlistLoading]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });
  };

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (wishlistLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 fill-white" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-white/90 text-lg">
            {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-2 text-[#333333]">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            >
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4 text-[#E02020]" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-[#333333] mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-[#E02020]">
                      Ksh {product.price.toFixed(2)}
                    </span>
                    {product.stock_quantity > 0 ? (
                      <span className="text-xs text-green-600 font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock_quantity === 0}
                    className="w-full bg-[#E02020] hover:bg-[#c01c1c] text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;