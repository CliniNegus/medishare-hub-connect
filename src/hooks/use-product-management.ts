
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductFormValues } from '@/types/product';

interface UseProductManagementProps {
  selectedShop: string | null;
}

export const useProductManagement = ({ selectedShop }: UseProductManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('equipment').select('*');
      
      if (user) {
        query = query.eq('owner_id', user.id);
      }
      
      if (selectedShop) {
        query = query.eq('shop_id', selectedShop);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database results to Product type and handle sales_option
      const mappedProducts: Product[] = (data || []).map(item => {
        // Ensure sales_option is one of the allowed values or null
        let validSalesOption: 'direct_sale' | 'lease' | 'both' | null = null;
        if (item.sales_option === 'direct_sale' || item.sales_option === 'lease' || item.sales_option === 'both') {
          validSalesOption = item.sales_option;
        }
        
        return {
          ...item,
          sales_option: validSalesOption
        } as Product;
      });
      
      setProducts(mappedProducts);
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
      
      const leaseRate = values.lease_rate || Math.round(values.price * 0.05);
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        lease_rate: leaseRate,
        condition: values.condition,
        specs: values.specs,
        owner_id: user?.id,
        shop_id: selectedShop,
        status: 'Available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sales_option: values.sales_option
      };

      const { error } = await supabase
        .from('equipment')
        .insert(productData);
        
      if (error) throw error;
      
      toast({
        title: "Product added",
        description: `${values.name} has been added to your inventory`,
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

  const handleUpdate = async (productId: string | number, values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const leaseRate = values.lease_rate || Math.round(values.price * 0.05);
      
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        lease_rate: leaseRate,
        condition: values.condition,
        specs: values.specs,
        updated_at: new Date().toISOString(),
        sales_option: values.sales_option
      };

      const { error } = await supabase
        .from('equipment')
        .update(productData)
        .eq('id', String(productId)); // Convert productId to string
        
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

  const handleDelete = async (productId: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', String(productId)); // Convert productId to string
        
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
  }, [selectedShop]);

  return {
    products,
    loading,
    handleSubmit,
    handleUpdate,
    handleDelete,
  };
};
