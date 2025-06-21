
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CategoryData {
  category: string;
  count: number;
  items: Array<{
    id: string;
    name: string;
    status: string;
    manufacturer: string | null;
  }>;
}

export const useEquipmentCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name, category, status, manufacturer')
        .order('category', { ascending: true });

      if (error) throw error;

      // Group equipment by category
      const categoryMap = new Map<string, CategoryData>();
      
      data?.forEach((item) => {
        const category = item.category || 'Uncategorized';
        
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            category,
            count: 0,
            items: []
          });
        }
        
        const categoryData = categoryMap.get(category)!;
        categoryData.count++;
        categoryData.items.push({
          id: item.id,
          name: item.name,
          status: item.status || 'Unknown',
          manufacturer: item.manufacturer
        });
      });

      // Convert map to array and sort by category name
      const categoriesArray = Array.from(categoryMap.values()).sort((a, b) => 
        a.category.localeCompare(b.category)
      );
      
      setCategories(categoriesArray);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      toast({
        title: "Error loading categories",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refreshCategories: fetchCategories,
  };
};
