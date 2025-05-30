
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Users, Eye } from "lucide-react";

interface ClusterLocation {
  id: string;
  name: string;
  region: string;
  equipment_count: number;
  status: string;
}

interface ClustersTabProps {
  clusterLocations: ClusterLocation[];
}

const ClustersTab: React.FC<ClustersTabProps> = ({ clusterLocations }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const totalClusters = clusterLocations.length;
  const totalHospitals = clusterLocations.reduce((sum, cluster) => sum + cluster.equipment_count, 0);

  if (clusterLocations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Hospital Clusters</h3>
          <p className="text-gray-500 mb-4">There are no hospital clusters to display at the moment.</p>
          <Button 
            variant="outline"
            className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
          >
            View All Locations
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">Hospital Cluster Distribution</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Total Clusters: <strong>{totalClusters}</strong></span>
          <span>Total Hospitals: <strong>{totalHospitals}</strong></span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-[#E02020] mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Clusters</p>
                <p className="text-2xl font-bold text-[#333333]">{totalClusters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-[#E02020] mr-3" />
              <div>
                <p className="text-sm text-gray-600">Partner Hospitals</p>
                <p className="text-2xl font-bold text-[#333333]">{totalHospitals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusterLocations.map((cluster) => (
          <Card key={cluster.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-[#333333] truncate">
                  {cluster.name}
                </CardTitle>
                <Badge className={getStatusBadgeColor(cluster.status)}>
                  {cluster.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {cluster.region}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Users className="h-3 w-3 mr-1" />
                    Hospitals
                  </span>
                  <span className="font-medium">{cluster.equipment_count}</span>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClustersTab;
