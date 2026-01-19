import { useCallback } from 'react';
import { ValidationError, ProductCSVRow, EquipmentCSVRow } from '@/components/catalog-upload/types';
import {
  PRODUCT_REQUIRED_FIELDS,
  EQUIPMENT_REQUIRED_FIELDS,
  PRODUCT_CATEGORIES,
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_STATUSES,
  SALES_OPTIONS
} from '@/components/catalog-upload/csv-templates';

export const useCSVValidation = () => {
  const validateProductRow = useCallback((row: ProductCSVRow, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    const rowNumber = rowIndex + 2; // +2 for header row and 0-indexing

    // Required fields
    if (!row.name || String(row.name).trim() === '') {
      errors.push({ row: rowNumber, field: 'name', message: 'Name is required' });
    }

    // Price validation
    const price = parseFloat(String(row.price));
    if (isNaN(price)) {
      errors.push({ row: rowNumber, field: 'price', message: 'Price must be a valid number' });
    } else if (price < 0) {
      errors.push({ row: rowNumber, field: 'price', message: 'Price must be positive' });
    }

    // Stock quantity validation
    const stockQty = parseInt(String(row.stock_quantity), 10);
    if (isNaN(stockQty)) {
      errors.push({ row: rowNumber, field: 'stock_quantity', message: 'Stock quantity must be a valid number' });
    } else if (stockQty < 0) {
      errors.push({ row: rowNumber, field: 'stock_quantity', message: 'Stock quantity must be ≥ 0' });
    }

    // Category validation (optional but if provided, must be valid)
    if (row.category && !PRODUCT_CATEGORIES.includes(row.category)) {
      errors.push({ 
        row: rowNumber, 
        field: 'category', 
        message: `Invalid category. Must be one of: ${PRODUCT_CATEGORIES.join(', ')}` 
      });
    }

    // Weight validation (optional but if provided, must be valid)
    if (row.weight !== undefined && row.weight !== '') {
      const weight = parseFloat(String(row.weight));
      if (isNaN(weight) || weight < 0) {
        errors.push({ row: rowNumber, field: 'weight', message: 'Weight must be a positive number' });
      }
    }

    return errors;
  }, []);

  const validateEquipmentRow = useCallback((row: EquipmentCSVRow, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    const rowNumber = rowIndex + 2;

    // Required fields
    if (!row.name || String(row.name).trim() === '') {
      errors.push({ row: rowNumber, field: 'name', message: 'Name is required' });
    }

    // Price validation (optional but if provided, must be valid)
    if (row.price !== undefined && row.price !== '') {
      const price = parseFloat(String(row.price));
      if (isNaN(price)) {
        errors.push({ row: rowNumber, field: 'price', message: 'Price must be a valid number' });
      } else if (price < 0) {
        errors.push({ row: rowNumber, field: 'price', message: 'Price must be positive' });
      }
    }

    // Lease rate validation
    if (row.lease_rate !== undefined && row.lease_rate !== '') {
      const leaseRate = parseFloat(String(row.lease_rate));
      if (isNaN(leaseRate) || leaseRate < 0) {
        errors.push({ row: rowNumber, field: 'lease_rate', message: 'Lease rate must be a positive number' });
      }
    }

    // Quantity validation
    if (row.quantity !== undefined && row.quantity !== '') {
      const qty = parseInt(String(row.quantity), 10);
      if (isNaN(qty) || qty < 0) {
        errors.push({ row: rowNumber, field: 'quantity', message: 'Quantity must be ≥ 0' });
      }
    }

    // Category validation
    if (row.category && !EQUIPMENT_CATEGORIES.includes(row.category.toLowerCase())) {
      errors.push({ 
        row: rowNumber, 
        field: 'category', 
        message: `Invalid category. Must be one of: ${EQUIPMENT_CATEGORIES.join(', ')}` 
      });
    }

    // Condition validation
    if (row.condition && !EQUIPMENT_CONDITIONS.includes(row.condition)) {
      errors.push({ 
        row: rowNumber, 
        field: 'condition', 
        message: `Invalid condition. Must be one of: ${EQUIPMENT_CONDITIONS.join(', ')}` 
      });
    }

    // Status validation
    if (row.status && !EQUIPMENT_STATUSES.includes(row.status)) {
      errors.push({ 
        row: rowNumber, 
        field: 'status', 
        message: `Invalid status. Must be one of: ${EQUIPMENT_STATUSES.join(', ')}` 
      });
    }

    // Sales option validation
    if (row.sales_option && !SALES_OPTIONS.includes(row.sales_option)) {
      errors.push({ 
        row: rowNumber, 
        field: 'sales_option', 
        message: `Invalid sales option. Must be one of: ${SALES_OPTIONS.join(', ')}` 
      });
    }

    // Pay-per-use price validation
    if (row.pay_per_use_price !== undefined && row.pay_per_use_price !== '') {
      const ppuPrice = parseFloat(String(row.pay_per_use_price));
      if (isNaN(ppuPrice) || ppuPrice < 0) {
        errors.push({ row: rowNumber, field: 'pay_per_use_price', message: 'Pay-per-use price must be a positive number (daily rate)' });
      }
    }

    return errors;
  }, []);

  const validateProducts = useCallback((rows: ProductCSVRow[]): ValidationError[] => {
    const allErrors: ValidationError[] = [];
    const nameModelMap = new Map<string, number>();

    rows.forEach((row, index) => {
      // Validate individual row
      const rowErrors = validateProductRow(row, index);
      allErrors.push(...rowErrors);

      // Check for duplicates
      const key = `${row.name}-${row.sku || ''}`.toLowerCase();
      if (nameModelMap.has(key)) {
        allErrors.push({
          row: index + 2,
          field: 'name',
          message: `Duplicate entry: same name and SKU found on row ${nameModelMap.get(key)}`
        });
      } else {
        nameModelMap.set(key, index + 2);
      }
    });

    return allErrors;
  }, [validateProductRow]);

  const validateEquipment = useCallback((rows: EquipmentCSVRow[]): ValidationError[] => {
    const allErrors: ValidationError[] = [];
    const nameModelMap = new Map<string, number>();

    rows.forEach((row, index) => {
      const rowErrors = validateEquipmentRow(row, index);
      allErrors.push(...rowErrors);

      // Check for duplicates
      const key = `${row.name}-${row.model || ''}-${row.serial_number || ''}`.toLowerCase();
      if (nameModelMap.has(key)) {
        allErrors.push({
          row: index + 2,
          field: 'name',
          message: `Duplicate entry: same name, model, and serial number found on row ${nameModelMap.get(key)}`
        });
      } else {
        nameModelMap.set(key, index + 2);
      }
    });

    return allErrors;
  }, [validateEquipmentRow]);

  return {
    validateProducts,
    validateEquipment,
    validateProductRow,
    validateEquipmentRow
  };
};
