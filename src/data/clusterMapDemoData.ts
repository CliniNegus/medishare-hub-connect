// Demo data for Cluster Map feature - isolated mock data
// This file contains all demo data for the Cluster Map feature

export interface ClusterMapCluster {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  facility_count: number;
  shared_device_count: number;
  utilization_pct: number;
  active_bookings: number;
  pending_requests: number;
  // Investor-specific fields
  investor_capital_needed: number;
  projected_monthly_return: number;
  payback_months: number;
  risk_score: 'low' | 'medium' | 'high';
}

export interface ClusterMapFacility {
  id: string;
  cluster_id: string;
  name: string;
  type: 'Hospital' | 'Clinic';
  lat: number;
  lng: number;
  status: 'Can Lend' | 'Needs Equipment' | 'In Use';
  open_requests: number;
  bookings_this_month: number;
}

export interface ClusterMapEquipment {
  id: string;
  cluster_id: string;
  name: string;
  category: string;
  current_facility_id: string;
  status: 'Available' | 'Booked' | 'In Transit' | 'Maintenance';
  next_available_at: string | null;
}

export interface ClusterMapMovement {
  id: string;
  equipment_id: string;
  from_facility_id: string;
  to_facility_id: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  started_at: string;
  completed_at: string | null;
}

// Lagos, Nigeria centered demo clusters
export const DEMO_CLUSTERS: ClusterMapCluster[] = [
  {
    id: 'cluster-1',
    name: 'Lagos Island Medical Hub',
    center_lat: 6.4541,
    center_lng: 3.3947,
    facility_count: 5,
    shared_device_count: 28,
    utilization_pct: 72,
    active_bookings: 12,
    pending_requests: 4,
    investor_capital_needed: 450000,
    projected_monthly_return: 12500,
    payback_months: 36,
    risk_score: 'low',
  },
  {
    id: 'cluster-2',
    name: 'Ikeja Healthcare Network',
    center_lat: 6.6018,
    center_lng: 3.3515,
    facility_count: 4,
    shared_device_count: 22,
    utilization_pct: 85,
    active_bookings: 18,
    pending_requests: 7,
    investor_capital_needed: 320000,
    projected_monthly_return: 9800,
    payback_months: 32,
    risk_score: 'medium',
  },
  {
    id: 'cluster-3',
    name: 'Victoria Island Cluster',
    center_lat: 6.4281,
    center_lng: 3.4219,
    facility_count: 3,
    shared_device_count: 15,
    utilization_pct: 45,
    active_bookings: 6,
    pending_requests: 2,
    investor_capital_needed: 280000,
    projected_monthly_return: 7200,
    payback_months: 38,
    risk_score: 'low',
  },
  {
    id: 'cluster-4',
    name: 'Lekki Medical Zone',
    center_lat: 6.4698,
    center_lng: 3.5852,
    facility_count: 6,
    shared_device_count: 35,
    utilization_pct: 68,
    active_bookings: 15,
    pending_requests: 5,
    investor_capital_needed: 520000,
    projected_monthly_return: 15200,
    payback_months: 34,
    risk_score: 'medium',
  },
  {
    id: 'cluster-5',
    name: 'Surulere Health District',
    center_lat: 6.5059,
    center_lng: 3.3509,
    facility_count: 4,
    shared_device_count: 18,
    utilization_pct: 92,
    active_bookings: 22,
    pending_requests: 9,
    investor_capital_needed: 380000,
    projected_monthly_return: 11800,
    payback_months: 32,
    risk_score: 'high',
  },
];

export const DEMO_FACILITIES: ClusterMapFacility[] = [
  // Lagos Island Medical Hub facilities
  { id: 'fac-1', cluster_id: 'cluster-1', name: 'Lagos General Hospital', type: 'Hospital', lat: 6.4521, lng: 3.3927, status: 'Can Lend', open_requests: 2, bookings_this_month: 8 },
  { id: 'fac-2', cluster_id: 'cluster-1', name: 'Island Maternity Clinic', type: 'Clinic', lat: 6.4561, lng: 3.3967, status: 'Needs Equipment', open_requests: 3, bookings_this_month: 5 },
  { id: 'fac-3', cluster_id: 'cluster-1', name: 'Marina Medical Center', type: 'Hospital', lat: 6.4501, lng: 3.3907, status: 'In Use', open_requests: 0, bookings_this_month: 12 },
  { id: 'fac-4', cluster_id: 'cluster-1', name: 'CMS Specialist Hospital', type: 'Hospital', lat: 6.4581, lng: 3.3987, status: 'Can Lend', open_requests: 1, bookings_this_month: 6 },
  { id: 'fac-5', cluster_id: 'cluster-1', name: 'Broad Street Clinic', type: 'Clinic', lat: 6.4491, lng: 3.3897, status: 'Can Lend', open_requests: 0, bookings_this_month: 4 },
  
  // Ikeja Healthcare Network facilities
  { id: 'fac-6', cluster_id: 'cluster-2', name: 'Ikeja General Hospital', type: 'Hospital', lat: 6.6008, lng: 3.3505, status: 'Needs Equipment', open_requests: 4, bookings_this_month: 15 },
  { id: 'fac-7', cluster_id: 'cluster-2', name: 'GRA Medical Clinic', type: 'Clinic', lat: 6.6038, lng: 3.3545, status: 'In Use', open_requests: 2, bookings_this_month: 9 },
  { id: 'fac-8', cluster_id: 'cluster-2', name: 'Allen Avenue Hospital', type: 'Hospital', lat: 6.5988, lng: 3.3485, status: 'Can Lend', open_requests: 1, bookings_this_month: 11 },
  { id: 'fac-9', cluster_id: 'cluster-2', name: 'Opebi Health Center', type: 'Clinic', lat: 6.6058, lng: 3.3565, status: 'Needs Equipment', open_requests: 3, bookings_this_month: 7 },
  
  // Victoria Island Cluster facilities
  { id: 'fac-10', cluster_id: 'cluster-3', name: 'VI Medical Plaza', type: 'Hospital', lat: 6.4271, lng: 3.4209, status: 'Can Lend', open_requests: 1, bookings_this_month: 8 },
  { id: 'fac-11', cluster_id: 'cluster-3', name: 'Eko Hospital VI', type: 'Hospital', lat: 6.4301, lng: 3.4249, status: 'Can Lend', open_requests: 0, bookings_this_month: 6 },
  { id: 'fac-12', cluster_id: 'cluster-3', name: 'Oniru Specialist Clinic', type: 'Clinic', lat: 6.4261, lng: 3.4189, status: 'In Use', open_requests: 1, bookings_this_month: 4 },
  
  // Lekki Medical Zone facilities
  { id: 'fac-13', cluster_id: 'cluster-4', name: 'Lekki Phase 1 Hospital', type: 'Hospital', lat: 6.4688, lng: 3.5842, status: 'Can Lend', open_requests: 2, bookings_this_month: 10 },
  { id: 'fac-14', cluster_id: 'cluster-4', name: 'Chevron Medical Center', type: 'Hospital', lat: 6.4718, lng: 3.5882, status: 'Needs Equipment', open_requests: 3, bookings_this_month: 8 },
  { id: 'fac-15', cluster_id: 'cluster-4', name: 'Ajah Community Clinic', type: 'Clinic', lat: 6.4668, lng: 3.5822, status: 'In Use', open_requests: 1, bookings_this_month: 5 },
  { id: 'fac-16', cluster_id: 'cluster-4', name: 'VGC Health Hub', type: 'Hospital', lat: 6.4738, lng: 3.5902, status: 'Can Lend', open_requests: 0, bookings_this_month: 7 },
  { id: 'fac-17', cluster_id: 'cluster-4', name: 'Sangotedo Medical', type: 'Clinic', lat: 6.4648, lng: 3.5802, status: 'Needs Equipment', open_requests: 2, bookings_this_month: 3 },
  { id: 'fac-18', cluster_id: 'cluster-4', name: 'Ikate Specialist Hospital', type: 'Hospital', lat: 6.4708, lng: 3.5872, status: 'Can Lend', open_requests: 1, bookings_this_month: 9 },
  
  // Surulere Health District facilities
  { id: 'fac-19', cluster_id: 'cluster-5', name: 'Randle General Hospital', type: 'Hospital', lat: 6.5049, lng: 3.3499, status: 'In Use', open_requests: 4, bookings_this_month: 18 },
  { id: 'fac-20', cluster_id: 'cluster-5', name: 'Adeniran Ogunsanya Clinic', type: 'Clinic', lat: 6.5079, lng: 3.3539, status: 'Needs Equipment', open_requests: 5, bookings_this_month: 12 },
  { id: 'fac-21', cluster_id: 'cluster-5', name: 'Bode Thomas Medical', type: 'Hospital', lat: 6.5029, lng: 3.3479, status: 'In Use', open_requests: 3, bookings_this_month: 14 },
  { id: 'fac-22', cluster_id: 'cluster-5', name: 'Masha Health Center', type: 'Clinic', lat: 6.5089, lng: 3.3549, status: 'Needs Equipment', open_requests: 2, bookings_this_month: 8 },
];

export const DEMO_EQUIPMENT: ClusterMapEquipment[] = [
  // Lagos Island Medical Hub equipment
  { id: 'eq-1', cluster_id: 'cluster-1', name: 'MRI Scanner Pro X9', category: 'Imaging', current_facility_id: 'fac-1', status: 'Available', next_available_at: null },
  { id: 'eq-2', cluster_id: 'cluster-1', name: 'CT Scanner Ultra', category: 'Imaging', current_facility_id: 'fac-3', status: 'Booked', next_available_at: '2025-01-25' },
  { id: 'eq-3', cluster_id: 'cluster-1', name: 'Ultrasound System', category: 'Diagnostics', current_facility_id: 'fac-1', status: 'Available', next_available_at: null },
  { id: 'eq-4', cluster_id: 'cluster-1', name: 'Patient Monitor Array', category: 'Monitoring', current_facility_id: 'fac-4', status: 'In Transit', next_available_at: '2025-01-23' },
  { id: 'eq-5', cluster_id: 'cluster-1', name: 'Ventilator Unit', category: 'Life Support', current_facility_id: 'fac-2', status: 'Maintenance', next_available_at: '2025-01-28' },
  
  // Ikeja Healthcare Network equipment
  { id: 'eq-6', cluster_id: 'cluster-2', name: 'Digital X-Ray System', category: 'Imaging', current_facility_id: 'fac-6', status: 'Booked', next_available_at: '2025-01-24' },
  { id: 'eq-7', cluster_id: 'cluster-2', name: 'ECG Machine', category: 'Diagnostics', current_facility_id: 'fac-7', status: 'In Transit', next_available_at: '2025-01-22' },
  { id: 'eq-8', cluster_id: 'cluster-2', name: 'Defibrillator', category: 'Emergency', current_facility_id: 'fac-8', status: 'Available', next_available_at: null },
  { id: 'eq-9', cluster_id: 'cluster-2', name: 'Anesthesia Workstation', category: 'Surgery', current_facility_id: 'fac-9', status: 'Booked', next_available_at: '2025-01-26' },
  
  // Victoria Island Cluster equipment
  { id: 'eq-10', cluster_id: 'cluster-3', name: 'Portable Ultrasound', category: 'Diagnostics', current_facility_id: 'fac-10', status: 'Available', next_available_at: null },
  { id: 'eq-11', cluster_id: 'cluster-3', name: 'Infusion Pump Set', category: 'Treatment', current_facility_id: 'fac-11', status: 'Available', next_available_at: null },
  { id: 'eq-12', cluster_id: 'cluster-3', name: 'Pulse Oximeter Array', category: 'Monitoring', current_facility_id: 'fac-12', status: 'Booked', next_available_at: '2025-01-23' },
  
  // Lekki Medical Zone equipment
  { id: 'eq-13', cluster_id: 'cluster-4', name: 'Robotic Surgery Arm', category: 'Surgery', current_facility_id: 'fac-13', status: 'Booked', next_available_at: '2025-01-30' },
  { id: 'eq-14', cluster_id: 'cluster-4', name: 'MRI Scanner', category: 'Imaging', current_facility_id: 'fac-14', status: 'Maintenance', next_available_at: '2025-02-01' },
  { id: 'eq-15', cluster_id: 'cluster-4', name: 'Dialysis Machine', category: 'Treatment', current_facility_id: 'fac-15', status: 'In Transit', next_available_at: '2025-01-22' },
  { id: 'eq-16', cluster_id: 'cluster-4', name: 'Fetal Monitor', category: 'Monitoring', current_facility_id: 'fac-16', status: 'Available', next_available_at: null },
  { id: 'eq-17', cluster_id: 'cluster-4', name: 'Endoscopy System', category: 'Diagnostics', current_facility_id: 'fac-17', status: 'Booked', next_available_at: '2025-01-25' },
  
  // Surulere Health District equipment
  { id: 'eq-18', cluster_id: 'cluster-5', name: 'CT Scanner Dual', category: 'Imaging', current_facility_id: 'fac-19', status: 'Booked', next_available_at: '2025-01-24' },
  { id: 'eq-19', cluster_id: 'cluster-5', name: 'Ventilator ICU', category: 'Life Support', current_facility_id: 'fac-20', status: 'In Transit', next_available_at: '2025-01-22' },
  { id: 'eq-20', cluster_id: 'cluster-5', name: 'Mammography Unit', category: 'Imaging', current_facility_id: 'fac-21', status: 'Booked', next_available_at: '2025-01-27' },
];

export const DEMO_MOVEMENTS: ClusterMapMovement[] = [
  { id: 'mov-1', equipment_id: 'eq-4', from_facility_id: 'fac-3', to_facility_id: 'fac-4', status: 'In Progress', started_at: '2025-01-20T09:00:00Z', completed_at: null },
  { id: 'mov-2', equipment_id: 'eq-7', from_facility_id: 'fac-8', to_facility_id: 'fac-7', status: 'In Progress', started_at: '2025-01-21T14:00:00Z', completed_at: null },
  { id: 'mov-3', equipment_id: 'eq-15', from_facility_id: 'fac-16', to_facility_id: 'fac-15', status: 'In Progress', started_at: '2025-01-21T10:00:00Z', completed_at: null },
  { id: 'mov-4', equipment_id: 'eq-19', from_facility_id: 'fac-21', to_facility_id: 'fac-20', status: 'In Progress', started_at: '2025-01-21T11:00:00Z', completed_at: null },
  { id: 'mov-5', equipment_id: 'eq-1', from_facility_id: 'fac-2', to_facility_id: 'fac-1', status: 'Completed', started_at: '2025-01-18T08:00:00Z', completed_at: '2025-01-18T12:00:00Z' },
  { id: 'mov-6', equipment_id: 'eq-8', from_facility_id: 'fac-6', to_facility_id: 'fac-8', status: 'Completed', started_at: '2025-01-17T09:00:00Z', completed_at: '2025-01-17T11:00:00Z' },
  { id: 'mov-7', equipment_id: 'eq-10', from_facility_id: 'fac-11', to_facility_id: 'fac-10', status: 'Completed', started_at: '2025-01-15T14:00:00Z', completed_at: '2025-01-15T16:00:00Z' },
  { id: 'mov-8', equipment_id: 'eq-2', from_facility_id: 'fac-1', to_facility_id: 'fac-3', status: 'Completed', started_at: '2025-01-14T10:00:00Z', completed_at: '2025-01-14T14:00:00Z' },
  { id: 'mov-9', equipment_id: 'eq-13', from_facility_id: 'fac-14', to_facility_id: 'fac-13', status: 'Completed', started_at: '2025-01-12T08:00:00Z', completed_at: '2025-01-12T13:00:00Z' },
  { id: 'mov-10', equipment_id: 'eq-18', from_facility_id: 'fac-22', to_facility_id: 'fac-19', status: 'Completed', started_at: '2025-01-10T09:00:00Z', completed_at: '2025-01-10T12:00:00Z' },
];

// Helper functions
export const getClusterById = (id: string): ClusterMapCluster | undefined => 
  DEMO_CLUSTERS.find(c => c.id === id);

export const getFacilitiesByCluster = (clusterId: string): ClusterMapFacility[] => 
  DEMO_FACILITIES.filter(f => f.cluster_id === clusterId);

export const getEquipmentByCluster = (clusterId: string): ClusterMapEquipment[] => 
  DEMO_EQUIPMENT.filter(e => e.cluster_id === clusterId);

export const getFacilityById = (id: string): ClusterMapFacility | undefined => 
  DEMO_FACILITIES.find(f => f.id === id);

export const getEquipmentById = (id: string): ClusterMapEquipment | undefined => 
  DEMO_EQUIPMENT.find(e => e.id === id);

export const getMovementsByEquipment = (equipmentId: string): ClusterMapMovement[] => 
  DEMO_MOVEMENTS.filter(m => m.equipment_id === equipmentId).slice(0, 3);

// Get top clusters for investment (sorted by utilization)
export const getTopInvestmentClusters = (): ClusterMapCluster[] => 
  [...DEMO_CLUSTERS].sort((a, b) => b.utilization_pct - a.utilization_pct).slice(0, 3);
