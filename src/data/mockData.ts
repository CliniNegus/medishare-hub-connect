
import { InventoryItem, Manufacturer } from '../models/inventory';
import { Order } from '../models/orders';

export const inventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'MRI Scanner XR-5000',
    sku: 'MRI-XR5000',
    category: 'imaging',
    manufacturer: 'MediTech Solutions',
    currentStock: 5,
    availableForSharing: 3,
    price: 120000,
    leasingPrice: 2500,
    image: '/placeholder.svg',
    description: 'High-performance MRI scanner with advanced imaging capabilities.',
    inUse: 2,
    onMaintenance: 0,
    location: 'Central Hospital',
    cluster: 'North Medical',
    dateAdded: '2025-01-15'
  },
  {
    id: '2',
    name: 'Ventilator Pro 2025',
    sku: 'VENT-P2025',
    category: 'respiratory',
    manufacturer: 'AirMed Systems',
    currentStock: 12,
    availableForSharing: 5,
    price: 35000,
    leasingPrice: 800,
    image: '/placeholder.svg',
    description: 'Advanced ventilator system with multiple ventilation modes.',
    inUse: 4,
    onMaintenance: 3,
    location: 'St. Mary\'s Clinic',
    cluster: 'North Medical',
    dateAdded: '2025-02-20'
  },
  {
    id: '3',
    name: 'Surgical Robot Assistant XR-1',
    sku: 'SRA-XR1',
    category: 'surgical',
    manufacturer: 'RoboSurg Inc',
    currentStock: 2,
    availableForSharing: 1,
    price: 250000,
    leasingPrice: 5000,
    image: '/placeholder.svg',
    description: 'Precision surgical robot assistant for minimally invasive procedures.',
    inUse: 1,
    onMaintenance: 0,
    location: 'University Hospital',
    cluster: 'South Consortium',
    dateAdded: '2025-03-10'
  },
  {
    id: '4',
    name: 'Patient Monitor V9',
    sku: 'PM-V9',
    category: 'monitoring',
    manufacturer: 'VitalTech',
    currentStock: 20,
    availableForSharing: 8,
    price: 15000,
    leasingPrice: 400,
    image: '/placeholder.svg',
    description: 'Comprehensive patient monitoring system with wireless capabilities.',
    inUse: 10,
    onMaintenance: 2,
    location: 'Veterans Hospital',
    cluster: 'East Alliance',
    dateAdded: '2025-02-05'
  },
  {
    id: '5',
    name: 'Portable X-Ray System Pro',
    sku: 'PXR-PRO',
    category: 'imaging',
    manufacturer: 'MediTech Solutions',
    currentStock: 8,
    availableForSharing: 3,
    price: 45000,
    leasingPrice: 900,
    image: '/placeholder.svg',
    description: 'High-resolution portable X-ray system for bedside imaging.',
    inUse: 3,
    onMaintenance: 2,
    location: 'Community Health',
    cluster: 'West Network',
    dateAdded: '2025-01-25'
  },
  {
    id: '6',
    name: 'Ultrasound Scanner HD',
    sku: 'US-HD2025',
    category: 'imaging',
    manufacturer: 'SonoView Medical',
    currentStock: 10,
    availableForSharing: 4,
    price: 60000,
    leasingPrice: 1200,
    image: '/placeholder.svg',
    description: 'High-definition ultrasound scanner with 3D/4D capabilities.',
    inUse: 4,
    onMaintenance: 2,
    location: 'Downtown Medical',
    cluster: 'West Network',
    dateAdded: '2025-03-05'
  }
];

export const manufacturerData: Manufacturer[] = [
  {
    id: '1',
    name: 'MediTech Solutions',
    logo: '/placeholder.svg',
    contactPerson: 'Dr. Emily Chen',
    email: 'echen@meditech.com',
    phone: '(555) 123-4567',
    itemsLeased: 12
  },
  {
    id: '2',
    name: 'AirMed Systems',
    logo: '/placeholder.svg',
    contactPerson: 'Robert Johnson',
    email: 'rjohnson@airmedsystems.com',
    phone: '(555) 234-5678',
    itemsLeased: 8
  },
  {
    id: '3',
    name: 'RoboSurg Inc',
    logo: '/placeholder.svg',
    contactPerson: 'Sarah Williams',
    email: 'swilliams@robosurg.com',
    phone: '(555) 345-6789',
    itemsLeased: 5
  },
  {
    id: '4',
    name: 'VitalTech',
    logo: '/placeholder.svg',
    contactPerson: 'Michael Brown',
    email: 'mbrown@vitaltech.com',
    phone: '(555) 456-7890',
    itemsLeased: 15
  },
  {
    id: '5',
    name: 'SonoView Medical',
    logo: '/placeholder.svg',
    contactPerson: 'Jennifer Lopez',
    email: 'jlopez@sonoview.com',
    phone: '(555) 567-8901',
    itemsLeased: 9
  }
];

export const orderData: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    customer: {
      id: '1',
      name: 'Central Hospital',
      type: 'hospital',
      cluster: 'North Medical'
    },
    items: [
      {
        id: '1',
        inventoryItemId: '1',
        name: 'MRI Scanner XR-5000',
        quantity: 1,
        unitPrice: 120000,
        subtotal: 120000
      }
    ],
    totalAmount: 120000,
    status: 'delivered',
    paymentMethod: 'wallet',
    dateCreated: '2025-01-20',
    dateUpdated: '2025-01-25',
    shippingAddress: '123 Medical Center Dr, San Francisco, CA'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    customer: {
      id: '2',
      name: 'St. Mary\'s Clinic',
      type: 'clinic',
      cluster: 'North Medical'
    },
    items: [
      {
        id: '1',
        inventoryItemId: '2',
        name: 'Ventilator Pro 2025',
        quantity: 2,
        unitPrice: 35000,
        subtotal: 70000
      },
      {
        id: '2',
        inventoryItemId: '4',
        name: 'Patient Monitor V9',
        quantity: 3,
        unitPrice: 15000,
        subtotal: 45000
      }
    ],
    totalAmount: 115000,
    status: 'shipped',
    paymentMethod: 'credit',
    dateCreated: '2025-02-15',
    dateUpdated: '2025-02-18',
    shippingAddress: '456 Health Plaza, Oakland, CA',
    trackingNumber: 'TRK123456789'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    customer: {
      id: '3',
      name: 'University Hospital',
      type: 'hospital',
      cluster: 'South Consortium'
    },
    items: [
      {
        id: '1',
        inventoryItemId: '3',
        name: 'Surgical Robot Assistant XR-1',
        quantity: 1,
        unitPrice: 250000,
        subtotal: 250000
      }
    ],
    totalAmount: 250000,
    status: 'processing',
    paymentMethod: 'invoice',
    dateCreated: '2025-03-10',
    dateUpdated: '2025-03-12',
    shippingAddress: '789 University Ave, San Jose, CA'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-004',
    customer: {
      id: '4',
      name: 'Veterans Hospital',
      type: 'hospital',
      cluster: 'East Alliance'
    },
    items: [
      {
        id: '1',
        inventoryItemId: '4',
        name: 'Patient Monitor V9',
        quantity: 5,
        unitPrice: 15000,
        subtotal: 75000
      }
    ],
    totalAmount: 75000,
    status: 'pending',
    paymentMethod: 'wallet',
    dateCreated: '2025-04-05',
    dateUpdated: '2025-04-05',
    shippingAddress: '321 Veterans Blvd, Palo Alto, CA'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-005',
    customer: {
      id: '5',
      name: 'Community Health',
      type: 'clinic',
      cluster: 'West Network'
    },
    items: [
      {
        id: '1',
        inventoryItemId: '5',
        name: 'Portable X-Ray System Pro',
        quantity: 2,
        unitPrice: 45000,
        subtotal: 90000
      }
    ],
    totalAmount: 90000,
    status: 'cancelled',
    paymentMethod: 'credit',
    dateCreated: '2025-03-25',
    dateUpdated: '2025-03-28',
    shippingAddress: '654 Community Way, Santa Clara, CA',
    notes: 'Order cancelled due to budget constraints.'
  }
];
