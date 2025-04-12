
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'imaging' | 'surgical' | 'respiratory' | 'monitoring' | 'diagnostic';
  manufacturer: string;
  currentStock: number;
  availableForSharing: number;
  price: number;
  leasingPrice: number;
  image: string;
  description: string;
  inUse: number;
  onMaintenance: number;
  location: string;
  cluster: string;
  dateAdded: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  contactPerson: string;
  email: string;
  phone: string;
  itemsLeased: number;
}
