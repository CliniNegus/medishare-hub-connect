
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Maintenance } from './types';

interface MaintenanceTabProps {
  maintenance: Maintenance[];
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ maintenance }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenance.map((item) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaintenanceTab;
