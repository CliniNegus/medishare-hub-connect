export interface ProductCSVRow {
  name: string;
  description?: string;
  category?: string;
  price: string | number;
  stock_quantity: string | number;
  manufacturer?: string;
  sku?: string;
  is_disposable?: string | boolean;
  weight?: string | number;
  tags?: string;
}

export interface EquipmentCSVRow {
  name: string;
  description?: string;
  category?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  sku?: string;
  condition?: string;
  status?: string;
  location?: string;
  price?: string | number;
  lease_rate?: string | number;
  quantity?: string | number;
  specs?: string;
  sales_option?: string;
  pay_per_use_enabled?: string | boolean;
  pay_per_use_price?: string | number;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface UploadResult {
  success: number;
  failed: number;
  created: number;
  updated: number;
  skipped: number;
  errors: ValidationError[];
}

export type UploadMode = 'add' | 'update';
export type FileType = 'csv' | 'xlsx';

export type RecordStatus = 'new' | 'update' | 'error' | 'skip';

export interface PreviewRecord<T> {
  data: T;
  status: RecordStatus;
  existingData?: T;
  changes?: { field: string; oldValue: any; newValue: any }[];
  errors: ValidationError[];
  rowIndex: number;
}

export interface CatalogUploadLog {
  id: string;
  manufacturer_id: string;
  file_name: string;
  file_type: FileType;
  upload_mode: UploadMode;
  catalog_type: 'products' | 'equipment';
  records_created: number;
  records_updated: number;
  records_skipped: number;
  records_failed: number;
  error_details: ValidationError[];
  created_at: string;
  completed_at: string | null;
}
