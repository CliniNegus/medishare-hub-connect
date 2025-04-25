
export interface Shop {
  id: string;
  name: string;
  country: string;
  description: string | null;
  logo_url: string | null;
  status: string | null;
  equipment_count: number;
  revenue_total: number;
}

export interface Equipment {
  id: string;
  name: string;
  status: string;
}
