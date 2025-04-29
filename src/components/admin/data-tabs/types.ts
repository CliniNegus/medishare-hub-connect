
export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

export interface Maintenance {
  id: string;
  equipment: string;
  location: string;
  date: string;
  type: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

export interface DataTabsProps {
  recentEquipment: Equipment[];
  maintenanceSchedule: Maintenance[];
  recentTransactions: Transaction[];
}
