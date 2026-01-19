export const PRODUCT_CSV_TEMPLATE = `name,description,category,price,stock_quantity,manufacturer,sku,is_disposable,weight,tags
"Example Product 1","Product description here","Diagnostic",29.99,100,"Your Company","SKU001",true,0.5,"diagnostic,medical"
"Example Product 2","Another product description","Surgical",149.99,50,"Your Company","SKU002",false,1.2,"surgical,instruments"
`;

export const EQUIPMENT_CSV_TEMPLATE = `name,description,category,manufacturer,model,serial_number,sku,condition,status,location,price,lease_rate,quantity,specs,sales_option,pay_per_use_enabled,pay_per_use_price
"MRI Scanner","High-resolution MRI machine","imaging","Medical Corp","MRI-5000","SN12345","EQ001","New","Available","Lagos, Nigeria",250000,5000,1,"3 Tesla, Full Body Scanning","Lease",true,150
"Ultrasound Machine","Portable ultrasound device","diagnostic","Medical Corp","US-200","SN12346","EQ002","Good","Available","Abuja, Nigeria",45000,1000,2,"Portable, LCD Display","Both",true,50
`;

export const PRODUCT_REQUIRED_FIELDS = ['name', 'price', 'stock_quantity'];
export const EQUIPMENT_REQUIRED_FIELDS = ['name'];

export const PRODUCT_CATEGORIES = [
  'Diagnostic',
  'Surgical',
  'Respiratory',
  'Monitoring',
  'Laboratory',
  'Imaging',
  'Emergency',
  'General',
  'Consumables',
  'Personal Protective Equipment'
];

export const EQUIPMENT_CATEGORIES = [
  'imaging',
  'surgical',
  'respiratory',
  'monitoring',
  'diagnostic',
  'laboratory',
  'emergency',
  'general'
];

export const EQUIPMENT_CONDITIONS = ['New', 'Excellent', 'Good', 'Fair', 'Refurbished'];
export const EQUIPMENT_STATUSES = ['Available', 'In Use', 'Maintenance', 'Reserved'];
export const SALES_OPTIONS = ['Lease', 'Sale', 'Both', 'Pay-per-use'];
