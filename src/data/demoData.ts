// Static demo data for demonstration purposes
// This data is only shown to demo users or when real data is empty

export const DEMO_MANUFACTURER_DATA = {
  products: [
    { id: 'demo-prod-1', name: 'MRI Scanner Pro X9', category: 'Imaging', price: 250000, stock: 5, status: 'active' },
    { id: 'demo-prod-2', name: 'CT Scanner Ultra HD', category: 'Imaging', price: 185000, stock: 3, status: 'active' },
    { id: 'demo-prod-3', name: 'Portable X-Ray Unit', category: 'Diagnostic', price: 45000, stock: 12, status: 'active' },
    { id: 'demo-prod-4', name: 'Ultrasound Scanner', category: 'Diagnostic', price: 35000, stock: 8, status: 'active' },
    { id: 'demo-prod-5', name: 'Patient Monitor V3', category: 'Monitoring', price: 12000, stock: 25, status: 'active' },
    { id: 'demo-prod-6', name: 'Surgical Robotic Arm', category: 'Surgical', price: 420000, stock: 2, status: 'active' },
    { id: 'demo-prod-7', name: 'Anesthesia Workstation', category: 'Anesthesia', price: 65000, stock: 7, status: 'active' },
    { id: 'demo-prod-8', name: 'Defibrillator Pro', category: 'Emergency', price: 8500, stock: 30, status: 'active' },
    { id: 'demo-prod-9', name: 'Ventilator ICU-500', category: 'Respiratory', price: 28000, stock: 15, status: 'active' },
    { id: 'demo-prod-10', name: 'ECG Machine 12-Lead', category: 'Cardiac', price: 6500, stock: 20, status: 'active' },
  ],
  orders: [
    { 
      id: 'demo-order-1', 
      customer: 'City General Hospital', 
      equipment: 'MRI Scanner Pro X9',
      status: 'processing', 
      amount: 250000,
      date: '2024-01-15'
    },
    { 
      id: 'demo-order-2', 
      customer: 'Regional Medical Center', 
      equipment: 'Patient Monitor V3 (x5)',
      status: 'shipped', 
      amount: 60000,
      date: '2024-01-12'
    },
  ],
  creditTerms: {
    limit: 500000,
    usedCredit: 125000,
    paymentCycle: 60,
    returnsPolicy: 'DOA (Dead on Arrival) items accepted within 30 days. Full refund or replacement available. Standard returns accepted within 14 days with 15% restocking fee.'
  },
  stats: {
    totalEquipment: 127,
    activeLease: 23,
    maintenance: 5,
    available: 99,
    monthlyRevenue: 125000
  }
};

export const DEMO_HOSPITAL_DATA = {
  bookingRequests: [
    { 
      id: 'demo-booking-1',
      equipment: 'Portable X-Ray Unit', 
      requestedDate: '2024-01-20', 
      status: 'confirmed',
      duration: '3 days',
      cost: 1500
    },
    { 
      id: 'demo-booking-2',
      equipment: 'Ultrasound Scanner', 
      requestedDate: '2024-01-25', 
      status: 'pending',
      duration: '1 week',
      cost: 2800
    },
  ],
  equipment: [
    { 
      id: 'demo-equip-1',
      name: 'CT Scanner', 
      status: 'active', 
      lastMaintenance: '2024-01-10',
      location: 'Radiology Dept.'
    },
    { 
      id: 'demo-equip-2',
      name: 'MRI Scanner', 
      status: 'active', 
      lastMaintenance: '2024-01-05',
      location: 'Imaging Center'
    },
    { 
      id: 'demo-equip-3',
      name: 'Ventilator ICU-500', 
      status: 'maintenance', 
      lastMaintenance: '2024-01-18',
      location: 'ICU Ward'
    },
  ],
  recentOrders: [
    {
      id: 'demo-ho-1',
      product: 'Surgical Gloves (Box of 100)',
      quantity: 50,
      status: 'delivered',
      date: '2024-01-14',
      amount: 750
    },
    {
      id: 'demo-ho-2',
      product: 'Syringes 10ml (Pack of 500)',
      quantity: 10,
      status: 'shipped',
      date: '2024-01-16',
      amount: 350
    },
  ],
  stats: {
    totalEquipment: 45,
    activeBookings: 8,
    pendingOrders: 3,
    maintenanceDue: 2
  }
};

export const DEMO_INVESTOR_DATA = {
  financedAssets: [
    { 
      id: 'demo-asset-1',
      name: 'CT Scanner Ultra HD', 
      hospital: 'Metro Hospital', 
      totalValue: 180000, 
      amountPaid: 90000,
      remainingBalance: 90000,
      roi: 9.5,
      status: 'active',
      term: '36 months'
    },
    { 
      id: 'demo-asset-2',
      name: 'MRI Scanner Pro', 
      hospital: 'City General Hospital', 
      totalValue: 275000, 
      amountPaid: 45000,
      remainingBalance: 230000,
      roi: 11.2,
      status: 'active',
      term: '48 months'
    },
  ],
  repaymentSchedule: [
    { 
      id: 'demo-repay-1',
      asset: 'CT Scanner Ultra HD',
      dueDate: '2024-02-01', 
      amount: 5000, 
      status: 'upcoming' 
    },
    { 
      id: 'demo-repay-2',
      asset: 'MRI Scanner Pro',
      dueDate: '2024-02-15', 
      amount: 7500, 
      status: 'upcoming' 
    },
    { 
      id: 'demo-repay-3',
      asset: 'CT Scanner Ultra HD',
      dueDate: '2024-01-01', 
      amount: 5000, 
      status: 'paid' 
    },
  ],
  opportunities: [
    {
      id: 'demo-opp-1',
      hospital: 'North Shore Medical',
      equipment: 'Robotic Surgery System',
      amount: 420000,
      term: '48 months',
      estimatedRoi: 12.5,
      risk: 'medium'
    },
    {
      id: 'demo-opp-2',
      hospital: 'Downtown Clinic',
      equipment: 'Diagnostic Lab Equipment',
      amount: 150000,
      term: '24 months',
      estimatedRoi: 8.7,
      risk: 'low'
    },
  ],
  stats: {
    totalInvested: 455000,
    activeInvestments: 2,
    averageRoi: 10.35,
    projectedEarnings: 47075,
    walletBalance: 125000
  }
};

// Check if user is a demo user
export const isDemoUser = (email: string | undefined): boolean => {
  if (!email) return false;
  return email.endsWith('@clinibuilds.com') && email.includes('demo');
};
