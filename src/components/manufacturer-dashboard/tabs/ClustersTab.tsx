
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from "lucide-react";

interface ClusterLocation {
  id: string;
  name: string;
  location: string;
  hospitals: number;
  equipmentCount: number;
  status: 'operational' | 'issue';
}

interface ClustersTabProps {
  clusterLocations: ClusterLocation[];
}

const ClustersTab = ({ clusterLocations }: ClustersTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Cluster Locations</h2>
        <Button variant="outline" size="sm">
          <MapPin className="h-4 w-4 mr-2" />
          View Map
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cluster Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Hospitals</TableHead>
            <TableHead>Equipment Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusterLocations.map((cluster) => (
            <TableRow key={cluster.id}>
              <TableCell className="font-medium">{cluster.id}</TableCell>
              <TableCell>{cluster.name}</TableCell>
              <TableCell>{cluster.location}</TableCell>
              <TableCell>{cluster.hospitals}</TableCell>
              <TableCell>{cluster.equipmentCount}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${cluster.status === 'operational' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {cluster.status.charAt(0).toUpperCase() + cluster.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Details</Button>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClustersTab;
