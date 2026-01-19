import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Building, Users, Eye, Loader2, Hospital } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  working_hours: string | null;
}

interface ClusterLocation {
  id: string;
  name: string;
  region: string;
  description?: string;
  equipment_count: number;
  status: string;
}

interface ClustersTabProps {
  clusterLocations: ClusterLocation[];
}

const ClustersTab: React.FC<ClustersTabProps> = ({ clusterLocations: initialClusters }) => {
  const { toast } = useToast();
  const [clusters, setClusters] = useState<ClusterLocation[]>(initialClusters);
  const [loading, setLoading] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<ClusterLocation | null>(null);
  const [clusterHospitals, setClusterHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch clusters with real data from Supabase
  useEffect(() => {
    const fetchClusters = async () => {
      setLoading(true);
      try {
        const { data: clustersData, error: clustersError } = await supabase
          .from('hospital_clusters')
          .select('*')
          .order('name');

        if (clustersError) throw clustersError;

        // Get hospital count for each cluster
        const clustersWithCounts = await Promise.all(
          (clustersData || []).map(async (cluster) => {
            const { count } = await supabase
              .from('hospitals')
              .select('*', { count: 'exact', head: true })
              .eq('cluster_id', cluster.id);

            return {
              id: cluster.id,
              name: cluster.name,
              region: cluster.region,
              description: cluster.description,
              equipment_count: count || 0,
              status: (count || 0) > 0 ? 'active' : 'inactive'
            };
          })
        );

        setClusters(clustersWithCounts);
      } catch (error: any) {
        console.error('Error fetching clusters:', error);
        toast({
          variant: "destructive",
          title: "Error fetching clusters",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, [toast]);

  const handleViewDetails = async (cluster: ClusterLocation) => {
    setSelectedCluster(cluster);
    setDetailsOpen(true);
    setLoadingHospitals(true);

    try {
      const { data: hospitals, error } = await supabase
        .from('hospitals')
        .select('id, name, address, phone, website, working_hours')
        .eq('cluster_id', cluster.id)
        .order('name');

      if (error) throw error;
      setClusterHospitals(hospitals || []);
    } catch (error: any) {
      console.error('Error fetching cluster hospitals:', error);
      toast({
        variant: "destructive",
        title: "Error fetching hospitals",
        description: error.message,
      });
      setClusterHospitals([]);
    } finally {
      setLoadingHospitals(false);
    }
  };

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

  const totalClusters = clusters.length;
  const activeClusters = clusters.filter(c => c.status === 'active').length;
  const totalHospitals = clusters.reduce((sum, cluster) => sum + cluster.equipment_count, 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#E02020] animate-spin" />
          <h3 className="text-lg font-medium mb-2">Loading Clusters</h3>
          <p className="text-gray-500">Fetching hospital cluster data...</p>
        </CardContent>
      </Card>
    );
  }

  if (clusters.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Hospital Clusters</h3>
          <p className="text-gray-500 mb-4">There are no hospital clusters to display at the moment.</p>
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
          <span>Active: <strong>{activeClusters}</strong></span>
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
                <p className="text-2xl font-bold text-[#333333]">{activeClusters}</p>
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
        {clusters.map((cluster) => (
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
              {cluster.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {cluster.description}
                </p>
              )}
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
                    onClick={() => handleViewDetails(cluster)}
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

      {/* Cluster Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#E02020]" />
              {selectedCluster?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedCluster?.description || `Cluster in ${selectedCluster?.region} region`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Cluster Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#E02020]" />
                    <div>
                      <p className="text-xs text-gray-500">Region</p>
                      <p className="font-medium text-sm">{selectedCluster?.region}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#E02020]" />
                    <div>
                      <p className="text-xs text-gray-500">Hospitals</p>
                      <p className="font-medium text-sm">{selectedCluster?.equipment_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hospitals List */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                Hospitals in this Cluster
              </h4>
              
              {loadingHospitals ? (
                <div className="text-center py-6">
                  <Loader2 className="h-6 w-6 mx-auto animate-spin text-[#E02020]" />
                  <p className="text-sm text-gray-500 mt-2">Loading hospitals...</p>
                </div>
              ) : clusterHospitals.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <Building className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No hospitals in this cluster yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {clusterHospitals.map((hospital) => (
                    <Card key={hospital.id} className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-sm">{hospital.name}</h5>
                            <p className="text-xs text-gray-500 mt-1">{hospital.address}</p>
                            {hospital.phone && (
                              <p className="text-xs text-gray-400 mt-0.5">📞 {hospital.phone}</p>
                            )}
                            {hospital.working_hours && (
                              <p className="text-xs text-gray-400 mt-0.5">🕐 {hospital.working_hours}</p>
                            )}
                          </div>
                          {hospital.website && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#E02020] hover:text-[#E02020] hover:bg-red-50"
                              onClick={() => window.open(hospital.website!, '_blank')}
                            >
                              Visit
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClustersTab;
