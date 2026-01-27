import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export type VisibilityStatus = 'hidden' | 'visible_all' | 'visible_hospitals' | 'visible_investors';

export const useVisibilityManagement = () => {
  const { toast } = useToast();

  const updateEquipmentVisibility = useCallback(async (
    equipmentId: string,
    newVisibility: VisibilityStatus
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('update_equipment_visibility', {
        equipment_id: equipmentId,
        new_visibility: newVisibility,
      });

      if (error) throw error;

      toast({
        title: "Visibility Updated",
        description: "Equipment visibility has been updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating equipment visibility:', error);
      toast({
        title: "Failed to update visibility",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const updateProductVisibility = useCallback(async (
    productId: string,
    newVisibility: VisibilityStatus
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('update_product_visibility', {
        product_id: productId,
        new_visibility: newVisibility,
      });

      if (error) throw error;

      toast({
        title: "Visibility Updated",
        description: "Product visibility has been updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating product visibility:', error);
      toast({
        title: "Failed to update visibility",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const bulkUpdateVisibility = useCallback(async (
    items: { id: string; type: 'equipment' | 'product' }[],
    newVisibility: VisibilityStatus
  ): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;

    for (const item of items) {
      const result = item.type === 'equipment'
        ? await updateEquipmentVisibility(item.id, newVisibility)
        : await updateProductVisibility(item.id, newVisibility);
      
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    if (success > 0) {
      toast({
        title: "Bulk Update Complete",
        description: `Updated ${success} item(s)${failed > 0 ? `, ${failed} failed` : ''}`,
      });
    }

    return { success, failed };
  }, [updateEquipmentVisibility, updateProductVisibility, toast]);

  return {
    updateEquipmentVisibility,
    updateProductVisibility,
    bulkUpdateVisibility,
  };
};
