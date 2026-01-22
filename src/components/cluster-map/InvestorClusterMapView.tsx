import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, DollarSign, Clock, AlertTriangle, 
  Building, MapPin, Activity, Calendar, Package, 
  ChevronRight, Layers, ArrowRightLeft, Sparkles
} from 'lucide-react';
import { 
  DEMO_CLUSTERS, 
  getClusterById,
  getFacilitiesByCluster,
  getEquipmentByCluster,
  getFacilityById,
  getTopInvestmentClusters,
  ClusterMapCluster
} from '@/data/clusterMapDemoData';
import ClusterMapCanvas from './ClusterMapCanvas';
import EquipmentMovementModal from './EquipmentMovementModal';
import ExpressInterestModal from './ExpressInterestModal';

interface InvestorClusterMapViewProps {
  className?: string;
}

const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
  switch (risk) {
    case 'low':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Low Risk</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Medium Risk</Badge>;
    case 'high':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">High Risk</Badge>;
  }
};

const getUtilizationColor = (utilization: number): string => {
  if (utilization < 50) return 'bg-green-100 text-green-700 border-green-200';
  if (utilization < 75) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

const getFacilityStatusBadge = (status: string) => {
  switch (status) {
    case 'Can Lend':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Can Lend</Badge>;
    case 'Needs Equipment':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Needs Equipment</Badge>;
    case 'In Use':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">In Use</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

const getEquipmentStatusBadge = (status: string) => {
  switch (status) {
    case 'Available':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Available</Badge>;
    case 'Booked':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Booked</Badge>;
    case 'In Transit':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">In Transit</Badge>;
    case 'Maintenance':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">Maintenance</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

const InvestorClusterMapView: React.FC<InvestorClusterMapViewProps> = ({ className }) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [expressInterestOpen, setExpressInterestOpen] = useState(false);

  const handleSelectCluster = useCallback((clusterId: string | null) => {
    setSelectedClusterId(clusterId);
  }, []);

  const handleFacilityClick = useCallback((facilityId: string) => {
    console.log('Facility clicked:', facilityId);
  }, []);

  const selectedCluster = selectedClusterId ? getClusterById(selectedClusterId) : null;
  const topClusters = getTopInvestmentClusters();

  const renderInvestorPanel = () => {
    if (!selectedCluster) {
      return (
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Investment Opportunities
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="p-4 space-y-6">
              {/* Top Clusters to Invest */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Top Clusters to Invest
                </h4>
                <div className="space-y-2">
                  {topClusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      onClick={() => handleSelectCluster(cluster.id)}
                      className="bg-muted/30 hover:bg-muted/50 rounded-lg p-3 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{cluster.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {getRiskBadge(cluster.risk_score)}
                            <span className="text-xs text-muted-foreground">
                              {cluster.utilization_pct}% utilization
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="text-green-600 font-medium">
                          ${cluster.projected_monthly_return.toLocaleString()}/mo
                        </span>
                        {' · '}
                        {cluster.payback_months}mo payback
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty state */}
              <div className="text-center py-8">
                <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a Cluster</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a cluster bubble on the map or select from the top clusters above
                </p>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      );
    }

    const facilities = getFacilitiesByCluster(selectedCluster.id);
    const equipment = getEquipmentByCluster(selectedCluster.id);

    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            {selectedCluster.name}
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1">
          <CardContent className="p-4 space-y-6">
            {/* Investment Snapshot - Investor Only */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Investment Snapshot
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-foreground">
                    ${(selectedCluster.investor_capital_needed / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-muted-foreground">Capital Needed</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">
                    ${selectedCluster.projected_monthly_return.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Monthly Return</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedCluster.payback_months}
                  </div>
                  <div className="text-xs text-muted-foreground">Payback (months)</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  {getRiskBadge(selectedCluster.risk_score)}
                  <div className="text-xs text-muted-foreground mt-1">Risk Score</div>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-primary hover:bg-primary/90"
                onClick={() => setExpressInterestOpen(true)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Express Interest to Invest
              </Button>
            </div>

            {/* Cluster Summary */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Cluster Summary
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">{selectedCluster.facility_count}</div>
                  <div className="text-xs text-muted-foreground">Facilities</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">{selectedCluster.shared_device_count}</div>
                  <div className="text-xs text-muted-foreground">Shared Devices</div>
                </div>
                <div className={`rounded-lg p-3 text-center border ${getUtilizationColor(selectedCluster.utilization_pct)}`}>
                  <div className="text-2xl font-bold">{selectedCluster.utilization_pct}%</div>
                  <div className="text-xs opacity-80">Utilization</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-foreground">{selectedCluster.active_bookings}</div>
                  <div className="text-xs text-muted-foreground">Active Bookings</div>
                </div>
              </div>
            </div>

            {/* Facility List */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Facilities ({facilities.length})
              </h4>
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    onClick={() => handleFacilityClick(facility.id)}
                    className="bg-muted/30 hover:bg-muted/50 rounded-lg p-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{facility.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {facility.type}
                          </Badge>
                          {getFacilityStatusBadge(facility.status)}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {facility.bookings_this_month} bookings
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {facility.open_requests} requests
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment List */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Equipment ({equipment.length})
              </h4>
              <div className="space-y-2">
                {equipment.map((item) => {
                  const currentFacility = getFacilityById(item.current_facility_id);
                  return (
                    <div
                      key={item.id}
                      className="bg-muted/30 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {item.category}
                          </div>
                        </div>
                        {getEquipmentStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {currentFacility?.name || 'Unknown'}
                        </div>
                        {item.next_available_at && (
                          <div className="text-xs text-muted-foreground">
                            Available: {new Date(item.next_available_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full text-xs h-7"
                        onClick={() => setSelectedEquipmentId(item.id)}
                      >
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        View Movement
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </ScrollArea>

        {/* Equipment Movement Modal */}
        <EquipmentMovementModal
          equipmentId={selectedEquipmentId}
          onClose={() => setSelectedEquipmentId(null)}
        />

        {/* Express Interest Modal */}
        <ExpressInterestModal
          cluster={selectedCluster}
          open={expressInterestOpen}
          onClose={() => setExpressInterestOpen(false)}
        />
      </Card>
    );
  };

  return (
    <div className={`h-[calc(100vh-280px)] min-h-[500px] ${className || ''}`}>
      {/* Desktop: Side by side layout */}
      <div className="hidden md:grid md:grid-cols-[70%_30%] gap-4 h-full">
        <ClusterMapCanvas
          clusters={DEMO_CLUSTERS}
          selectedClusterId={selectedClusterId}
          onSelectCluster={handleSelectCluster}
          onSelectFacility={handleFacilityClick}
        />
        {renderInvestorPanel()}
      </div>

      {/* Mobile: Stacked layout */}
      <div className="md:hidden flex flex-col gap-4 h-full">
        <div className="h-[300px] flex-shrink-0">
          <ClusterMapCanvas
            clusters={DEMO_CLUSTERS}
            selectedClusterId={selectedClusterId}
            onSelectCluster={handleSelectCluster}
            onSelectFacility={handleFacilityClick}
          />
        </div>
        <div className="flex-1 min-h-[300px]">
          {renderInvestorPanel()}
        </div>
      </div>
    </div>
  );
};

export default InvestorClusterMapView;
