
import { EquipmentProps } from '../EquipmentCard';
import { ClusterNode } from '../ClusterMap';

export const equipmentData: EquipmentProps[] = [
  {
    id: '1',
    name: 'MRI Scanner XR-5000',
    image: '/placeholder.svg',
    type: 'Imaging',
    location: 'Central Hospital',
    cluster: 'North Medical',
    status: 'available',
    pricePerUse: 500
  },
  {
    id: '2',
    name: 'Ventilator Pro 2022',
    image: '/placeholder.svg',
    type: 'Respiratory',
    location: 'St. Mary\'s Clinic',
    cluster: 'North Medical',
    status: 'in-use',
    pricePerUse: 120,
    nextAvailable: 'Tomorrow, 2PM'
  },
  {
    id: '3',
    name: 'Ultrasound Scanner',
    image: '/placeholder.svg',
    type: 'Imaging',
    location: 'Downtown Medical',
    cluster: 'West Network',
    status: 'available',
    pricePerUse: 250
  },
  {
    id: '4',
    name: 'Patient Monitor V8',
    image: '/placeholder.svg',
    type: 'Monitoring',
    location: 'Veterans Hospital',
    cluster: 'East Alliance',
    status: 'maintenance',
    pricePerUse: 80,
    nextAvailable: 'In 3 days'
  },
  {
    id: '5',
    name: 'Surgical Robot Assistant',
    image: '/placeholder.svg',
    type: 'Surgical',
    location: 'University Hospital',
    cluster: 'South Consortium',
    status: 'available',
    pricePerUse: 1200
  },
  {
    id: '6',
    name: 'Portable X-Ray System',
    image: '/placeholder.svg',
    type: 'Imaging',
    location: 'Community Health',
    cluster: 'West Network',
    status: 'in-use',
    pricePerUse: 150,
    nextAvailable: 'Today, 6PM'
  }
];

export const clusterNodes: ClusterNode[] = [
  { id: '1', name: 'Central Hospital', lat: 37.7749, lng: -122.4194, equipmentCount: 12, type: 'hospital' },
  { id: '2', name: 'St. Mary\'s Clinic', lat: 37.7833, lng: -122.4167, equipmentCount: 5, type: 'clinic' },
  { id: '3', name: 'Downtown Medical', lat: 37.7694, lng: -122.4862, equipmentCount: 8, type: 'hospital' },
  { id: '4', name: 'Veterans Hospital', lat: 37.7837, lng: -122.4324, equipmentCount: 15, type: 'hospital' },
  { id: '5', name: 'Community Health', lat: 37.7739, lng: -122.4312, equipmentCount: 3, type: 'clinic' },
];

export const recentTransactions: {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'return';
}[] = [
  { id: '1', date: 'Apr 10, 2025', description: 'Investment Return - MRI Scanner', amount: 240, type: 'return' },
  { id: '2', date: 'Apr 07, 2025', description: 'Deposit to Investment Pool', amount: 5000, type: 'deposit' },
  { id: '3', date: 'Apr 05, 2025', description: 'Equipment Purchase - Ultrasound', amount: 1200, type: 'withdrawal' },
  { id: '4', date: 'Apr 02, 2025', description: 'Investment Return - Ventilators', amount: 320, type: 'return' },
];
