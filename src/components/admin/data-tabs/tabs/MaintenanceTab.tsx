
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Maintenance } from '../types';
import { Badge } from "@/components/ui/badge";

interface MaintenanceTabProps {
  maintenance: Maintenance[];
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ maintenance }) => {
  if (maintenance.length === 0) {
    return <p className="text-gray-500 py-4">No maintenance data available.</p>;
  }

  // Safely format date with error handling
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Determine if maintenance is upcoming, today, or overdue
  const getMaintenanceStatus = (dateString: string) => {
    if (!dateString) {
      return { label: 'No Date', class: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const maintenanceDate = new Date(dateString);
      if (isNaN(maintenanceDate.getTime())) {
        return { label: 'Invalid Date', class: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };
      }
      
      maintenanceDate.setHours(0, 0, 0, 0);
      
      const diffTime = maintenanceDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays < 0) return { label: 'Overdue', class: 'bg-red-100 text-red-800 hover:bg-red-100' };
      if (diffDays === 0) return { label: 'Today', class: 'bg-[#E02020] text-white hover:bg-[#E02020]/90' };
      if (diffDays <= 7) return { label: 'Upcoming', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' };
      return { label: 'Scheduled', class: 'bg-blue-100 text-blue-800 hover:bg-blue-100' };
    } catch (error) {
      console.error('Error calculating maintenance status:', error);
      return { label: 'Unknown', class: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Maintenance Schedule</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipment</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenance.map((item) => {
            const status = getMaintenanceStatus(item.date);
            
            return (
              <TableRow key={item.id}>
                <TableCell>{item.equipment || 'Unknown Equipment'}</TableCell>
                <TableCell>{item.location || 'Unknown Location'}</TableCell>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>{item.type || 'Maintenance'}</TableCell>
                <TableCell>
                  <Badge className={status.class}>
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceTab;
