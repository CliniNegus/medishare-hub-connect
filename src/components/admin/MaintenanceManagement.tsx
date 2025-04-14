
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Maintenance {
  id: string;
  equipment: string;
  location: string;
  date: string;
  type: string;
}

interface MaintenanceManagementProps {
  maintenanceSchedule: Maintenance[];
  maintenanceAlerts: number;
}

const MaintenanceManagement = ({ maintenanceSchedule, maintenanceAlerts }: MaintenanceManagementProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Maintenance Management</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance Alerts</h3>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
          <h4 className="font-semibold text-yellow-700 mb-2">Equipment Requiring Immediate Attention: {maintenanceAlerts}</h4>
          <p className="text-yellow-600 mb-3">The following equipment items require immediate maintenance:</p>
          <ul className="list-disc list-inside text-yellow-600 mb-3">
            <li>MRI Scanner X9 (City Hospital) - Calibration Overdue</li>
            <li>CT Scanner Ultra (Warehouse) - Preventive Maintenance Required</li>
            <li>Patient Monitor X3 (Memorial Hospital) - Error Codes Reported</li>
          </ul>
          <Button variant="outline" size="sm">View All Alerts</Button>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-4">Upcoming Maintenance Schedule</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenanceSchedule.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.equipment}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs 
                  ${item.type === 'Preventive' ? 'bg-green-100 text-green-800' : 
                    item.type === 'Calibration' ? 'bg-blue-100 text-blue-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {item.type}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Cancel</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceManagement;
