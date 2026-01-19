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
  errors: ValidationError[];
}
