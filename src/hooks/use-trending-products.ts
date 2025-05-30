
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { sampleProducts } from '@/data/sampleProducts';
import { Product } from '@/hooks/use-products';

export const useTrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from database
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(6);

        if (error) {
          console.error('Error fetching products from database:', error);
          // Fall back to sample data
          setProducts(sampleProducts as Product[]);
        } else if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts as Product[]);
        } else {
          // If no products in database, use sample data
          setProducts(sampleProducts as Product[]);
        }
      } catch (error) {
        console.error('Error in fetchTrendingProducts:', error);
        // Fall back to sample data
        setProducts(sampleProducts as Product[]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  return { products, loading };
};
