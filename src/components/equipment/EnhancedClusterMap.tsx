
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Filter, Layers, Navigation, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface EnhancedClusterNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  equipmentCount: number;
  availableCount: number;
  inUseCount: number;
  maintenanceCount: number;
  type: 'hospital' | 'clinic' | 'warehouse';
  status: 'operational' | 'partial' | 'offline';
  address: string;
  contact: string;
  lastUpdated: string;
}

interface EnhancedClusterMapProps {
  nodes: EnhancedClusterNode[];
  selectedNodeId?: string;
  onSelectNode?: (id: string) => void;
  centerLat?: number;
  centerLng?: number;
  onRefresh?: () => void;
}

const EnhancedClusterMap: React.FC<EnhancedClusterMapProps> = ({ 
  nodes, 
  selectedNodeId,
  onSelectNode,
  centerLat = 6.5244,
  centerLng = 3.3792, // Default to Lagos, Nigeria
  onRefresh
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample mapbox token input (in real app, this should come from environment)
  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [centerLng, centerLat],
        zoom: 10,
        pitch: 0,
        bearing: 0,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Initialize markers when map loads
      map.current.on('load', () => {
        updateMarkers();
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter nodes based on search and filters
    const filteredNodes = nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
      const matchesType = typeFilter === 'all' || node.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Add markers for filtered nodes
    filteredNodes.forEach(node => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-transform hover:scale-110 ${
            node.status === 'operational' ? 'bg-green-500' :
            node.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
          }">
            ${node.equipmentCount}
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
            node.type === 'hospital' ? 'bg-blue-500' :
            node.type === 'clinic' ? 'bg-purple-500' : 'bg-gray-500'
          }"></div>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([node.lng, node.lat])
        .addTo(map.current!);

      // Add popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-gray-900 mb-1">${node.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${node.address}</p>
          <div class="grid grid-cols-3 gap-2 mb-2">
            <div class="text-center">
              <div class="text-xs text-gray-500">Available</div>
              <div class="font-medium text-green-600">${node.availableCount}</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500">In Use</div>
              <div class="font-medium text-blue-600">${node.inUseCount}</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500">Maintenance</div>
              <div class="font-medium text-orange-600">${node.maintenanceCount}</div>
            </div>
          </div>
          <div class="text-xs text-gray-500">Updated: ${new Date(node.lastUpdated).toLocaleTimeString()}</div>
        </div>
      `);

      marker.getElement().addEventListener('mouseenter', () => {
        marker.setPopup(popup).togglePopup();
      });

      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

      marker.getElement().addEventListener('click', () => {
        onSelectNode && onSelectNode(node.id);
      });

      markersRef.current.push(marker);
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    updateMarkers();
    onRefresh && onRefresh();
    setTimeout(() => setIsLoading(false), 1000);
  };

  const centerOnSelection = () => {
    if (!map.current || !selectedNodeId) return;
    
    const selectedNode = nodes.find(node => node.id === selectedNodeId);
    if (selectedNode) {
      map.current.flyTo({
        center: [selectedNode.lng, selectedNode.lat],
        zoom: 14,
        duration: 1000
      });
    }
  };

  useEffect(() => {
    if (map.current) {
      updateMarkers();
    }
  }, [nodes, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    if (selectedNodeId) {
      centerOnSelection();
    }
  }, [selectedNodeId]);

  if (!mapboxToken) {
    return (
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="text-red-800 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-600" />
            Equipment Cluster Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                Please enter your Mapbox public token to enable the interactive map.
                Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a>
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter Mapbox public token..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTokenSubmit} className="bg-red-600 hover:bg-red-700">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200">
      <CardHeader className="bg-red-50 border-b border-red-200">
        <CardTitle className="text-red-800 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-600" />
            Equipment Cluster Map
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-red-600 border-red-300">
              {nodes.length} Locations
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Controls Panel */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hospital">Hospitals</SelectItem>
                <SelectItem value="clinic">Clinics</SelectItem>
                <SelectItem value="warehouse">Warehouses</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch 
                id="heatmap" 
                checked={showHeatmap}
                onCheckedChange={setShowHeatmap}
              />
              <Label htmlFor="heatmap" className="text-sm">Heatmap</Label>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="h-96 w-full"
            style={{ minHeight: '400px' }}
          />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
            <h4 className="font-medium text-sm mb-2">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Partial Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Offline</span>
              </div>
              <hr className="my-1" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Clinic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Warehouse</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border min-w-[200px]">
            <h4 className="font-medium text-sm mb-2">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-1 bg-green-50 rounded">
                <div className="font-medium text-green-600">
                  {nodes.reduce((sum, node) => sum + node.availableCount, 0)}
                </div>
                <div className="text-green-700">Available</div>
              </div>
              <div className="text-center p-1 bg-blue-50 rounded">
                <div className="font-medium text-blue-600">
                  {nodes.reduce((sum, node) => sum + node.inUseCount, 0)}
                </div>
                <div className="text-blue-700">In Use</div>
              </div>
              <div className="text-center p-1 bg-orange-50 rounded">
                <div className="font-medium text-orange-600">
                  {nodes.reduce((sum, node) => sum + node.maintenanceCount, 0)}
                </div>
                <div className="text-orange-700">Maintenance</div>
              </div>
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="font-medium text-gray-600">
                  {nodes.reduce((sum, node) => sum + node.equipmentCount, 0)}
                </div>
                <div className="text-gray-700">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="p-4 max-h-48 overflow-y-auto border-t border-gray-200">
          <div className="space-y-2">
            {nodes
              .filter(node => {
                const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     node.address.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
                const matchesType = typeFilter === 'all' || node.type === typeFilter;
                return matchesSearch && matchesStatus && matchesType;
              })
              .map(node => (
                <div 
                  key={node.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedNodeId === node.id 
                      ? 'bg-red-50 border-red-200 shadow-sm' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectNode && onSelectNode(node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{node.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            node.status === 'operational' ? 'text-green-600 border-green-300' :
                            node.status === 'partial' ? 'text-yellow-600 border-yellow-300' :
                            'text-red-600 border-red-300'
                          }`}
                        >
                          {node.status}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {node.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{node.address}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-green-600">{node.availableCount} available</span>
                        <span className="text-blue-600">{node.inUseCount} in use</span>
                        <span className="text-orange-600">{node.maintenanceCount} maintenance</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{node.equipmentCount}</div>
                      <div className="text-xs text-gray-500">total</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedClusterMap;
