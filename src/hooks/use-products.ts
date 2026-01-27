
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

export type VisibilityStatus = 'hidden' | 'visible_all' | 'visible_hospitals' | 'visible_investors';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  manufacturer: string | null;
  manufacturer_id: string | null;
  sku: string | null;
  is_disposable: boolean | null;
  is_featured: boolean | null;
  weight: number | null;
  dimensions: any | null;
  rating: number | null;
  tags: string[] | null;
  visibility_status?: string | null;
}

export interface ProductFilterOptions {
  category?: string;
  featured?: boolean;
  searchTerm?: string;
  productType?: 'all' | 'disposable' | 'reusable';
  sortBy?: 'popularity' | 'price_low_to_high' | 'price_high_to_low' | 'newest';
}

export const useProducts = (options?: ProductFilterOptions) => {
  const { user, userRoles } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(['all']);

  // Fetch unique categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
        
        if (error) throw error;
        
        if (data) {
          const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
          setUniqueCategories(['all', ...categories]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' });
        
        // Apply visibility filter based on user role
        // Admins see everything, manufacturers see their own, others see based on visibility
        const primaryRole = userRoles.primaryRole;
        
        if (!userRoles.isAdmin) {
          if (primaryRole === 'manufacturer' && user?.id) {
            // Manufacturers can see all their own products plus visible products
            query = query.or(`manufacturer_id.eq.${user.id},visibility_status.eq.visible_all,visibility_status.eq.visible_hospitals,visibility_status.eq.visible_investors`);
          } else if (primaryRole === 'hospital') {
            // Hospitals see visible_all and visible_hospitals
            query = query.in('visibility_status', ['visible_all', 'visible_hospitals']);
          } else if (primaryRole === 'investor') {
            // Investors see visible_all and visible_investors
            query = query.in('visibility_status', ['visible_all', 'visible_investors']);
          } else {
            // Public users only see visible_all
            query = query.eq('visibility_status', 'visible_all');
          }
        }
        
        // Apply category filter
        if (options?.category && options.category !== 'all') {
          query = query.eq('category', options.category);
        }
        
        // Apply featured filter
        if (options?.featured === true) {
          query = query.eq('is_featured', true);
        }
        
        // Apply product type filter (disposable vs. reusable)
        if (options?.productType) {
          if (options.productType === 'disposable') {
            query = query.eq('is_disposable', true);
          } else if (options.productType === 'reusable') {
            query = query.eq('is_disposable', false);
          }
          // 'all' doesn't need a filter
        }
        
        // Apply search filter
        if (options?.searchTerm && options.searchTerm.trim() !== '') {
          const term = options.searchTerm.toLowerCase().trim();
          query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%,manufacturer.ilike.%${term}%`);
        }
        
        // Apply sorting
        if (options?.sortBy) {
          switch (options.sortBy) {
            case 'price_low_to_high':
              query = query.order('price', { ascending: true });
              break;
            case 'price_high_to_low':
              query = query.order('price', { ascending: false });
              break;
            case 'newest':
              query = query.order('created_at', { ascending: false });
              break;
            case 'popularity':
            default:
              // Default sorting by rating or featured status
              query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
              break;
          }
        } else {
          // Default sorting
          query = query.order('is_featured', { ascending: false }).order('name', { ascending: true });
        }
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        setProducts(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options?.category, options?.featured, options?.searchTerm, options?.productType, options?.sortBy, user?.id, userRoles]);

  return { 
    products, 
    loading, 
    error, 
    totalCount,
    uniqueCategories
  };
};
