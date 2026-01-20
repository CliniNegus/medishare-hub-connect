import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ProductCSVRow, 
  EquipmentCSVRow, 
  UploadResult, 
  ValidationError,
  UploadMode,
  FileType,
  PreviewRecord
} from '@/components/catalog-upload/types';

export const useCatalogUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const logUpload = async (
    fileName: string,
    fileType: FileType,
    uploadMode: UploadMode,
    catalogType: 'products' | 'equipment',
    result: UploadResult
  ) => {
    if (!user) return;
    
    try {
      await supabase.from('catalog_upload_logs').insert({
        manufacturer_id: user.id,
        file_name: fileName,
        file_type: fileType,
        upload_mode: uploadMode,
        catalog_type: catalogType,
        records_created: result.created,
        records_updated: result.updated,
        records_skipped: result.skipped,
        records_failed: result.failed,
        error_details: result.errors as any,
        completed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log upload:', error);
    }
  };

  const getExistingProducts = async () => {
    if (!user) return new Map();
    
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('manufacturer_id', user.id);
    
    const map = new Map();
    data?.forEach(p => {
      const key = `${p.name}-${p.sku || ''}`.toLowerCase();
      map.set(key, p);
    });
    return map;
  };

  const getExistingEquipment = async () => {
    if (!user) return new Map();
    
    const { data } = await supabase
      .from('equipment')
      .select('*')
      .eq('owner_id', user.id);
    
    const map = new Map();
    data?.forEach(e => {
      const key = `${e.name}-${e.model || ''}-${e.serial_number || ''}`.toLowerCase();
      map.set(key, e);
    });
    return map;
  };

  const prepareProductsPreview = async (
    rows: ProductCSVRow[],
    mode: UploadMode,
    validationErrors: ValidationError[]
  ): Promise<PreviewRecord<ProductCSVRow>[]> => {
    const existingProducts = await getExistingProducts();
    const preview: PreviewRecord<ProductCSVRow>[] = [];
    
    const rowErrorMap = new Map<number, ValidationError[]>();
    validationErrors.forEach(err => {
      const existing = rowErrorMap.get(err.row) || [];
      existing.push(err);
      rowErrorMap.set(err.row, existing);
    });

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const key = `${row.name}-${row.sku || ''}`.toLowerCase();
      const existing = existingProducts.get(key);
      const rowErrors = rowErrorMap.get(rowNumber) || [];

      if (rowErrors.length > 0) {
        preview.push({
          data: row,
          status: 'error',
          errors: rowErrors,
          rowIndex: index
        });
      } else if (existing) {
        if (mode === 'add') {
          preview.push({
            data: row,
            status: 'skip',
            existingData: existing,
            errors: [],
            rowIndex: index
          });
        } else {
          const changes = getProductChanges(existing, row);
          preview.push({
            data: row,
            status: 'update',
            existingData: existing,
            changes,
            errors: [],
            rowIndex: index
          });
        }
      } else {
        if (mode === 'update') {
          preview.push({
            data: row,
            status: 'new',
            errors: [],
            rowIndex: index
          });
        } else {
          preview.push({
            data: row,
            status: 'new',
            errors: [],
            rowIndex: index
          });
        }
      }
    });

    return preview;
  };

  const prepareEquipmentPreview = async (
    rows: EquipmentCSVRow[],
    mode: UploadMode,
    validationErrors: ValidationError[]
  ): Promise<PreviewRecord<EquipmentCSVRow>[]> => {
    const existingEquipment = await getExistingEquipment();
    const preview: PreviewRecord<EquipmentCSVRow>[] = [];
    
    const rowErrorMap = new Map<number, ValidationError[]>();
    validationErrors.forEach(err => {
      const existing = rowErrorMap.get(err.row) || [];
      existing.push(err);
      rowErrorMap.set(err.row, existing);
    });

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const key = `${row.name}-${row.model || ''}-${row.serial_number || ''}`.toLowerCase();
      const existing = existingEquipment.get(key);
      const rowErrors = rowErrorMap.get(rowNumber) || [];

      if (rowErrors.length > 0) {
        preview.push({
          data: row,
          status: 'error',
          errors: rowErrors,
          rowIndex: index
        });
      } else if (existing) {
        if (mode === 'add') {
          preview.push({
            data: row,
            status: 'skip',
            existingData: existing,
            errors: [],
            rowIndex: index
          });
        } else {
          const changes = getEquipmentChanges(existing, row);
          preview.push({
            data: row,
            status: 'update',
            existingData: existing,
            changes,
            errors: [],
            rowIndex: index
          });
        }
      } else {
        preview.push({
          data: row,
          status: 'new',
          errors: [],
          rowIndex: index
        });
      }
    });

    return preview;
  };

  const getProductChanges = (existing: any, newData: ProductCSVRow) => {
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    const fields = ['name', 'description', 'category', 'price', 'stock_quantity', 'manufacturer', 'sku', 'is_disposable', 'weight', 'tags'];
    
    fields.forEach(field => {
      const oldVal = existing[field];
      const newVal = (newData as any)[field];
      
      if (newVal !== undefined && newVal !== '' && String(oldVal) !== String(newVal)) {
        changes.push({ field, oldValue: oldVal, newValue: newVal });
      }
    });
    
    return changes;
  };

  const getEquipmentChanges = (existing: any, newData: EquipmentCSVRow) => {
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    const fields = ['name', 'description', 'category', 'manufacturer', 'model', 'serial_number', 'sku', 'condition', 'status', 'location', 'price', 'lease_rate', 'quantity', 'specs', 'sales_option', 'pay_per_use_enabled', 'pay_per_use_price'];
    
    fields.forEach(field => {
      const oldVal = existing[field];
      const newVal = (newData as any)[field];
      
      if (newVal !== undefined && newVal !== '' && String(oldVal) !== String(newVal)) {
        changes.push({ field, oldValue: oldVal, newValue: newVal });
      }
    });
    
    return changes;
  };

  const uploadProducts = async (
    previewRecords: PreviewRecord<ProductCSVRow>[],
    mode: UploadMode,
    fileName: string,
    fileType: FileType,
    allowNewInUpdateMode: boolean = false
  ): Promise<UploadResult> => {
    if (!user) {
      return { success: 0, failed: previewRecords.length, created: 0, updated: 0, skipped: 0, errors: [{ row: 0, field: '', message: 'User not authenticated' }] };
    }

    setUploading(true);
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const errors: ValidationError[] = [];

    try {
      const existingProducts = await getExistingProducts();

      for (const record of previewRecords) {
        const row = record.data;
        const rowNumber = record.rowIndex + 2;

        if (record.status === 'error') {
          failedCount++;
          errors.push(...record.errors);
          continue;
        }

        if (record.status === 'skip') {
          skippedCount++;
          continue;
        }

        const key = `${row.name}-${row.sku || ''}`.toLowerCase();
        const existing = existingProducts.get(key);

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

        if (existing && mode === 'update') {
          const { error } = await supabase
            .from('products')
            .update({ ...productData, updated_at: new Date().toISOString() })
            .eq('id', existing.id);

          if (error) {
            errors.push({ row: rowNumber, field: '', message: `Failed to update: ${error.message}` });
            failedCount++;
          } else {
            updatedCount++;
          }
        } else if (!existing) {
          if (mode === 'update' && !allowNewInUpdateMode) {
            skippedCount++;
            continue;
          }

          const { error } = await supabase
            .from('products')
            .insert(productData);

          if (error) {
            errors.push({ row: rowNumber, field: '', message: `Failed to insert: ${error.message}` });
            failedCount++;
          } else {
            createdCount++;
          }
        } else {
          skippedCount++;
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

    const result: UploadResult = { 
      success: createdCount + updatedCount, 
      failed: failedCount, 
      created: createdCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors 
    };

    await logUpload(fileName, fileType, mode, 'products', result);
    return result;
  };

  const uploadEquipment = async (
    previewRecords: PreviewRecord<EquipmentCSVRow>[],
    mode: UploadMode,
    fileName: string,
    fileType: FileType,
    allowNewInUpdateMode: boolean = false
  ): Promise<UploadResult> => {
    if (!user) {
      return { success: 0, failed: previewRecords.length, created: 0, updated: 0, skipped: 0, errors: [{ row: 0, field: '', message: 'User not authenticated' }] };
    }

    setUploading(true);
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const errors: ValidationError[] = [];

    try {
      const existingEquipment = await getExistingEquipment();

      for (const record of previewRecords) {
        const row = record.data;
        const rowNumber = record.rowIndex + 2;

        if (record.status === 'error') {
          failedCount++;
          errors.push(...record.errors);
          continue;
        }

        if (record.status === 'skip') {
          skippedCount++;
          continue;
        }

        const key = `${row.name}-${row.model || ''}-${row.serial_number || ''}`.toLowerCase();
        const existing = existingEquipment.get(key);

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

        if (existing && mode === 'update') {
          const { error } = await supabase
            .from('equipment')
            .update({ ...equipmentData, updated_at: new Date().toISOString() })
            .eq('id', existing.id);

          if (error) {
            errors.push({ row: rowNumber, field: '', message: `Failed to update: ${error.message}` });
            failedCount++;
          } else {
            updatedCount++;
          }
        } else if (!existing) {
          if (mode === 'update' && !allowNewInUpdateMode) {
            skippedCount++;
            continue;
          }

          const { error } = await supabase
            .from('equipment')
            .insert(equipmentData);

          if (error) {
            errors.push({ row: rowNumber, field: '', message: `Failed to insert: ${error.message}` });
            failedCount++;
          } else {
            createdCount++;
          }
        } else {
          skippedCount++;
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

    const result: UploadResult = { 
      success: createdCount + updatedCount, 
      failed: failedCount, 
      created: createdCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors 
    };

    await logUpload(fileName, fileType, mode, 'equipment', result);
    return result;
  };

  return {
    uploadProducts,
    uploadEquipment,
    prepareProductsPreview,
    prepareEquipmentPreview,
    uploading
  };
};
