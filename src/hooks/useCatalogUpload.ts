import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProductCSVRow, EquipmentCSVRow, UploadResult, ValidationError } from '@/components/catalog-upload/types';
import { useCSVValidation } from './useCSVValidation';

export const useCatalogUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { validateProducts, validateEquipment } = useCSVValidation();
  const [uploading, setUploading] = useState(false);

  const uploadProducts = async (rows: ProductCSVRow[]): Promise<UploadResult> => {
    if (!user) {
      return { success: 0, failed: rows.length, errors: [{ row: 0, field: '', message: 'User not authenticated' }] };
    }

    // Validate all rows first
    const validationErrors = validateProducts(rows);
    if (validationErrors.length > 0) {
      return { success: 0, failed: rows.length, errors: validationErrors };
    }

    setUploading(true);
    let successCount = 0;
    let failedCount = 0;
    const errors: ValidationError[] = [];

    try {
      // Check for existing products to prevent duplicates
      const { data: existingProducts } = await supabase
        .from('products')
        .select('name, sku')
        .eq('manufacturer_id', user.id);

      const existingKeys = new Set(
        existingProducts?.map(p => `${p.name}-${p.sku || ''}`.toLowerCase()) || []
      );

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const key = `${row.name}-${row.sku || ''}`.toLowerCase();
        
        if (existingKeys.has(key)) {
          errors.push({
            row: i + 2,
            field: 'name',
            message: `Product "${row.name}" with SKU "${row.sku || 'N/A'}" already exists`
          });
          failedCount++;
          continue;
        }

        const productData = {
          name: String(row.name).trim(),
          description: row.description ? String(row.description).trim() : null,
          category: row.category ? String(row.category).trim() : null,
          price: parseFloat(String(row.price)),
          stock_quantity: parseInt(String(row.stock_quantity), 10),
          manufacturer: row.manufacturer ? String(row.manufacturer).trim() : null,
          manufacturer_id: user.id,
          sku: row.sku ? String(row.sku).trim() : null,
          is_disposable: row.is_disposable === 'true' || row.is_disposable === true,
          weight: row.weight ? parseFloat(String(row.weight)) : null,
          tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : null,
          is_featured: false,
        };

        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) {
          errors.push({
            row: i + 2,
            field: '',
            message: `Failed to insert: ${error.message}`
          });
          failedCount++;
        } else {
          successCount++;
          existingKeys.add(key);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }

    return { success: successCount, failed: failedCount, errors };
  };

  const uploadEquipment = async (rows: EquipmentCSVRow[]): Promise<UploadResult> => {
    if (!user) {
      return { success: 0, failed: rows.length, errors: [{ row: 0, field: '', message: 'User not authenticated' }] };
    }

    // Validate all rows first
    const validationErrors = validateEquipment(rows);
    if (validationErrors.length > 0) {
      return { success: 0, failed: rows.length, errors: validationErrors };
    }

    setUploading(true);
    let successCount = 0;
    let failedCount = 0;
    const errors: ValidationError[] = [];

    try {
      // Check for existing equipment to prevent duplicates
      const { data: existingEquipment } = await supabase
        .from('equipment')
        .select('name, model, serial_number')
        .eq('owner_id', user.id);

      const existingKeys = new Set(
        existingEquipment?.map(e => `${e.name}-${e.model || ''}-${e.serial_number || ''}`.toLowerCase()) || []
      );

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const key = `${row.name}-${row.model || ''}-${row.serial_number || ''}`.toLowerCase();
        
        if (existingKeys.has(key)) {
          errors.push({
            row: i + 2,
            field: 'name',
            message: `Equipment "${row.name}" with model "${row.model || 'N/A'}" and serial "${row.serial_number || 'N/A'}" already exists`
          });
          failedCount++;
          continue;
        }

        const equipmentData = {
          name: String(row.name).trim(),
          description: row.description ? String(row.description).trim() : null,
          category: row.category ? String(row.category).toLowerCase().trim() : null,
          manufacturer: row.manufacturer ? String(row.manufacturer).trim() : null,
          model: row.model ? String(row.model).trim() : null,
          serial_number: row.serial_number ? String(row.serial_number).trim() : null,
          sku: row.sku ? String(row.sku).trim() : null,
          condition: row.condition ? String(row.condition).trim() : 'New',
          status: row.status ? String(row.status).trim() : 'Available',
          location: row.location ? String(row.location).trim() : null,
          price: row.price ? parseFloat(String(row.price)) : null,
          lease_rate: row.lease_rate ? parseFloat(String(row.lease_rate)) : null,
          quantity: row.quantity ? parseInt(String(row.quantity), 10) : 1,
          specs: row.specs ? String(row.specs).trim() : null,
          sales_option: row.sales_option ? String(row.sales_option).trim() : 'Both',
          pay_per_use_enabled: row.pay_per_use_enabled === 'true' || row.pay_per_use_enabled === true,
          pay_per_use_price: row.pay_per_use_price ? parseFloat(String(row.pay_per_use_price)) : null,
          owner_id: user.id,
        };

        const { error } = await supabase
          .from('equipment')
          .insert(equipmentData);

        if (error) {
          errors.push({
            row: i + 2,
            field: '',
            message: `Failed to insert: ${error.message}`
          });
          failedCount++;
        } else {
          successCount++;
          existingKeys.add(key);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }

    return { success: successCount, failed: failedCount, errors };
  };

  return {
    uploadProducts,
    uploadEquipment,
    uploading
  };
};
