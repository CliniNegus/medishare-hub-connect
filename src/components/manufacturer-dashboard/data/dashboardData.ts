
export interface LeasedProduct {
  id: string;
  name: string;
  model: string;
  hospital: string;
  leaseDate: string;
  leaseEnd: string;
  status: 'active' | 'maintenance' | 'expired';
}

export interface ClusterLocation {
  id: string;
  name: string;
  location: string;
  hospitals: number;
  equipmentCount: number;
  status: 'operational' | 'issue';
}

export interface PaymentReceived {
  id: string;
  date: string;
  hospital: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  equipment: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  type: 'disposable' | 'lease' | 'financing';
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalEquipment: number;
  activeLease: number;
  maintenance: number;
  available: number;
  monthlyRevenue: number;
}

export const leasedProducts: LeasedProduct[] = [
  {
    id: 'PROD-001',
    name: 'MRI Scanner X9',
    model: '2023-XR',
    hospital: 'City Hospital',
    leaseDate: '2024-10-15',
    leaseEnd: '2027-10-15',
    status: 'active'
  },
  {
    id: 'PROD-002',
    name: 'CT Scanner Ultra',
    model: 'CT-2000',
    hospital: 'Memorial Medical Center',
    leaseDate: '2024-08-22',
    leaseEnd: '2026-08-22',
    status: 'active'
  },
  {
    id: 'PROD-003',
    name: 'Patient Monitor Elite',
    model: 'PM-500',
    hospital: 'County Clinic',
    leaseDate: '2024-11-30',
    leaseEnd: '2025-11-30',
    status: 'active'
  },
  {
    id: 'PROD-004',
    name: 'X-Ray Machine',
    model: 'XR-100',
    hospital: 'University Hospital',
    leaseDate: '2023-05-12',
    leaseEnd: '2025-05-12',
    status: 'maintenance'
  },
  {
    id: 'PROD-005',
    name: 'Ultrasound Unit',
    model: 'US-300',
    hospital: 'Children\'s Hospital',
    leaseDate: '2024-01-10',
    leaseEnd: '2026-01-10',
    status: 'active'
  }
];

export const clusterLocations: ClusterLocation[] = [
  {
    id: 'CLST-001',
    name: 'Northeast Medical Cluster',
    location: 'Boston, MA',
    hospitals: 5,
    equipmentCount: 18,
    status: 'operational'
  },
  {
    id: 'CLST-002',
    name: 'West Coast Health Network',
    location: 'San Francisco, CA',
    hospitals: 7,
    equipmentCount: 24,
    status: 'operational'
  },
  {
    id: 'CLST-003',
    name: 'Southern Medical Group',
    location: 'Atlanta, GA',
    hospitals: 4,
    equipmentCount: 12,
    status: 'issue'
  },
  {
    id: 'CLST-004',
    name: 'Midwest Hospital Alliance',
    location: 'Chicago, IL',
    hospitals: 6,
    equipmentCount: 20,
    status: 'operational'
  }
];

export const paymentsReceived: PaymentReceived[] = [
  {
    id: 'PMT-001',
    date: '2025-04-05',
    hospital: 'City Hospital',
    amount: 12500,
    status: 'paid',
    equipment: 'MRI Scanner X9'
  },
  {
    id: 'PMT-002',
    date: '2025-04-02',
    hospital: 'Memorial Medical Center',
    amount: 8750,
    status: 'paid',
    equipment: 'CT Scanner Ultra'
  },
  {
    id: 'PMT-003',
    date: '2025-03-28',
    hospital: 'County Clinic',
    amount: 3200,
    status: 'pending',
    equipment: 'Patient Monitor Elite'
  },
  {
    id: 'PMT-004',
    date: '2025-03-25',
    hospital: 'University Hospital',
    amount: 4800,
    status: 'overdue',
    equipment: 'X-Ray Machine'
  },
  {
    id: 'PMT-005',
    date: '2025-03-22',
    hospital: 'Children\'s Hospital',
    amount: 5600,
    status: 'paid',
    equipment: 'Ultrasound Unit'
  }
];

export const shopProducts: ShopProduct[] = [
  {
    id: 'SHOP-001',
    name: 'Surgical Gloves (Box of 100)',
    type: 'disposable',
    price: 24.99,
    stock: 150,
    status: 'active'
  },
  {
    id: 'SHOP-002',
    name: 'Patient Monitors',
    type: 'lease',
    price: 599.99,
    stock: 12,
    status: 'active'
  },
  {
    id: 'SHOP-003',
    name: 'MRI Scanner Pro',
    type: 'financing',
    price: 450000,
    stock: 3,
    status: 'active'
  },
  {
    id: 'SHOP-004',
    name: 'Surgical Masks (Box of 50)',
    type: 'disposable',
    price: 19.99,
    stock: 200,
    status: 'active'
  },
  {
    id: 'SHOP-005',
    name: 'Ultrasound Machine',
    type: 'lease',
    price: 28000,
    stock: 8,
    status: 'active'
  },
  {
    id: 'SHOP-006',
    name: 'CT Scanner',
    type: 'financing',
    price: 320000,
    stock: 2,
    status: 'active'
  }
];

export const dashboardStats: DashboardStats = {
  totalEquipment: 72,
  activeLease: 56,
  maintenance: 8,
  available: 8,
  monthlyRevenue: 124500
};
