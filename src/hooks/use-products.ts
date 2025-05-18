
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface Product {
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

export const useProducts = (options?: {
  category?: string;
  featured?: boolean;
  searchTerm?: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('products')
          .select('*');
        
        // Apply filters if provided
        if (options?.category && options.category !== 'all') {
          query = query.eq('category', options.category);
        }
        
        if (options?.featured === true) {
          query = query.eq('is_featured', true);
        }
        
        if (options?.searchTerm && options.searchTerm.trim() !== '') {
          const term = options.searchTerm.toLowerCase().trim();
          query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%,manufacturer.ilike.%${term}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options?.category, options?.featured, options?.searchTerm]);

  return { products, loading, error };
};
