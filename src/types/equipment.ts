
export interface EquipmentDetails {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;
  status: string;
  location: string;
  lease_rate: number;
  condition: string;
  created_at: string;
  updated_at: string;
}

export const statusColors = {
  'Available': 'bg-green-500',
  'In Use': 'bg-black',
  'Maintenance': 'bg-red-700',
  'available': 'bg-green-500',
  'in-use': 'bg-black',
  'maintenance': 'bg-red-700'
};
