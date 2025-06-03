
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  is_disposable?: boolean;
  rating?: number;
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: any;
  created_at: string;
  updated_at: string;
}

interface ProductFormValues {
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  is_disposable?: boolean;
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: any;
}

export const useAdminProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        stock_quantity: values.stock_quantity,
        manufacturer: values.manufacturer,
        image_url: values.image_url,
        is_featured: values.is_featured || false,
        is_disposable: values.is_disposable !== undefined ? values.is_disposable : true,
        sku: values.sku,
        tags: values.tags,
        weight: values.weight,
        dimensions: values.dimensions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);
        
      if (error) throw error;
      
      toast({
        title: "Product added",
        description: `${values.name} has been added to the shop`,
      });
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error.message);
      toast({
        title: "Failed to save product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId: string, values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        stock_quantity: values.stock_quantity,
        manufacturer: values.manufacturer,
        image_url: values.image_url,
        is_featured: values.is_featured || false,
        is_disposable: values.is_disposable !== undefined ? values.is_disposable : true,
        sku: values.sku,
        tags: values.tags,
        weight: values.weight,
        dimensions: values.dimensions,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product updated",
        description: `${values.name} has been updated successfully`,
      });
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error.message);
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    handleSubmit,
    handleUpdate,
    handleDelete,
    fetchProducts,
  };
};
