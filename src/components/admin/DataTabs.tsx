
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  status: string;
  location: string;
}

interface Maintenance {
  id: string;
  equipment: string;
  location: string;
  date: string;
  type: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

interface DataTabsProps {
  recentEquipment: Equipment[];
  maintenanceSchedule: Maintenance[];
  recentTransactions: Transaction[];
}

const DataTabs = ({ recentEquipment, maintenanceSchedule, recentTransactions }: DataTabsProps) => {
  return (
    <Tabs defaultValue="equipment" className="bg-white p-4 rounded-lg shadow-sm">
      <TabsList className="mb-4">
        <TabsTrigger value="equipment">Recent Equipment</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
        <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="equipment">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${item.status === 'Leased' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Available' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="maintenance">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="transactions">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${item.type === 'Income' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {item.type}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};

export default DataTabs;
