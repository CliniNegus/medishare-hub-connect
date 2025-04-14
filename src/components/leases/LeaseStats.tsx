
import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, DollarSign, Calendar, Building } from "lucide-react";

interface LeaseStatsProps {
  leases: any[];
  userRole?: string;
}

const LeaseStats = ({ leases, userRole }: LeaseStatsProps) => {
  const stats = useMemo(() => {
    const activeLeases = leases.filter(lease => lease.status === 'active');
    
    // Calculate total value of active leases
    const totalActiveValue = activeLeases.reduce(
      (sum, lease) => sum + (lease.total_value || 0), 
      0
    );
    
    // Calculate monthly revenue from active leases
    const monthlyRevenue = activeLeases.reduce(
      (sum, lease) => sum + (lease.monthly_payment || 0), 
      0
    );
    
    // Count unique equipment and hospitals/investors
    const uniqueEquipment = new Set(leases.map(lease => lease.equipment_id)).size;
    
    let uniquePartners;
    if (userRole === 'hospital') {
      // Count unique investors
      uniquePartners = new Set(
        leases.filter(lease => lease.investor_id).map(lease => lease.investor_id)
      ).size;
    } else if (userRole === 'investor') {
      // Count unique hospitals
      uniquePartners = new Set(leases.map(lease => lease.hospital_id)).size;
    } else {
      // Count unique hospitals + investors
      const hospitals = new Set(leases.map(lease => lease.hospital_id));
      const investors = new Set(leases.filter(lease => lease.investor_id).map(lease => lease.investor_id));
      uniquePartners = hospitals.size + investors.size;
    }
    
    return {
      activeLeases: activeLeases.length,
      totalActiveValue,
      monthlyRevenue,
      uniqueEquipment,
      uniquePartners
    };
  }, [leases, userRole]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Leases</p>
            <p className="text-2xl font-bold">{stats.activeLeases}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Unique Equipment</p>
            <p className="text-2xl font-bold">{stats.uniqueEquipment}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {userRole === 'hospital' ? 'Investors' : 
               userRole === 'investor' ? 'Hospitals' : 
               'Partners'}
            </p>
            <p className="text-2xl font-bold">{stats.uniquePartners}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Building className="h-6 w-6 text-amber-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseStats;
