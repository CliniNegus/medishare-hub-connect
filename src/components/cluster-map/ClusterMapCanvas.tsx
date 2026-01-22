import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, RefreshCw } from 'lucide-react';
import { 
  ClusterMapCluster, 
  ClusterMapFacility,
  getFacilitiesByCluster 
} from '@/data/clusterMapDemoData';

interface ClusterMapCanvasProps {
  clusters: ClusterMapCluster[];
  selectedClusterId: string | null;
  onSelectCluster: (clusterId: string | null) => void;
  onSelectFacility?: (facilityId: string) => void;
  centerLat?: number;
  centerLng?: number;
}

// Security: Escape HTML special characters to prevent XSS
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (char) => map[char] || char);
};

const sanitizeNumber = (value: unknown): number => {
  const num = Number(value);
  return isFinite(num) && num >= 0 ? num : 0;
};

// Get utilization color based on percentage
const getUtilizationColor = (utilization: number): string => {
  if (utilization < 50) return '#22c55e'; // Green
  if (utilization < 75) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};

// Get facility status color
const getFacilityStatusColor = (status: string): string => {
  switch (status) {
    case 'Can Lend': return '#22c55e';
    case 'Needs Equipment': return '#f59e0b';
    case 'In Use': return '#3b82f6';
    default: return '#6b7280';
  }
};

const ClusterMapCanvas: React.FC<ClusterMapCanvasProps> = ({
  clusters,
  selectedClusterId,
  onSelectCluster,
  onSelectFacility,
  centerLat = 6.5244,
  centerLng = 3.3792,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const facilityMarkersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [tokenInput, setTokenInput] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    facilityMarkersRef.current.forEach(marker => marker.remove());
    facilityMarkersRef.current = [];
  }, []);

  // Create cluster bubble markers
  const createClusterMarkers = useCallback(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    clusters.forEach(cluster => {
      const isSelected = cluster.id === selectedClusterId;
      const color = getUtilizationColor(sanitizeNumber(cluster.utilization_pct));
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'cluster-bubble-marker';
      el.style.cssText = `
        width: ${isSelected ? '70px' : '60px'};
        height: ${isSelected ? '70px' : '60px'};
        border-radius: 50%;
        background: ${color};
        border: 3px solid ${isSelected ? '#E02020' : 'white'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        color: white;
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
      `;

      el.innerHTML = `
        <div style="font-size: 16px; font-weight: bold;">${sanitizeNumber(cluster.shared_device_count)}</div>
        <div style="font-size: 9px; opacity: 0.9;">devices</div>
      `;

      el.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
          el.style.transform = 'scale(1.15)';
          el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (!prefersReducedMotion) {
          el.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
          el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }
      });

      el.addEventListener('click', () => {
        onSelectCluster(cluster.id);
      });

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25, 
        closeButton: false,
        className: 'cluster-popup'
      }).setHTML(`
        <div style="padding: 8px; min-width: 150px;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #333;">
            ${escapeHtml(cluster.name)}
          </div>
          <div style="display: grid; gap: 4px; font-size: 12px; color: #666;">
            <div style="display: flex; justify-content: space-between;">
              <span>Facilities:</span>
              <span style="font-weight: 600;">${sanitizeNumber(cluster.facility_count)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Shared Devices:</span>
              <span style="font-weight: 600;">${sanitizeNumber(cluster.shared_device_count)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Utilization:</span>
              <span style="font-weight: 600; color: ${color};">${sanitizeNumber(cluster.utilization_pct)}%</span>
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
            Click to view details
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([cluster.center_lng, cluster.center_lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [clusters, selectedClusterId, onSelectCluster, prefersReducedMotion]);

  // Create facility markers for selected cluster
  const createFacilityMarkers = useCallback(() => {
    if (!map.current || !selectedClusterId) return;

    // Clear existing facility markers
    facilityMarkersRef.current.forEach(marker => marker.remove());
    facilityMarkersRef.current = [];

    const facilities = getFacilitiesByCluster(selectedClusterId);

    facilities.forEach(facility => {
      const color = getFacilityStatusColor(facility.status);

      const el = document.createElement('div');
      el.className = 'facility-marker';
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      `;

      el.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
          el.style.transform = 'scale(1.3)';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (!prefersReducedMotion) {
          el.style.transform = 'scale(1)';
        }
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectFacility?.(facility.id);
      });

      const popup = new mapboxgl.Popup({ 
        offset: 15, 
        closeButton: false,
        className: 'facility-popup'
      }).setHTML(`
        <div style="padding: 8px; min-width: 140px;">
          <div style="font-weight: bold; font-size: 13px; margin-bottom: 6px; color: #333;">
            ${escapeHtml(facility.name)}
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              background: ${facility.type === 'Hospital' ? '#dbeafe' : '#fef3c7'};
              color: ${facility.type === 'Hospital' ? '#1d4ed8' : '#92400e'};
            ">${escapeHtml(facility.type)}</span>
            <span style="
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              background: ${color}20;
              color: ${color};
            ">${escapeHtml(facility.status)}</span>
          </div>
          <div style="font-size: 11px; color: #666;">
            <div>Open Requests: ${sanitizeNumber(facility.open_requests)}</div>
            <div>Bookings: ${sanitizeNumber(facility.bookings_this_month)}</div>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([facility.lng, facility.lat])
        .setPopup(popup)
        .addTo(map.current!);

      facilityMarkersRef.current.push(marker);
    });
  }, [selectedClusterId, onSelectFacility, prefersReducedMotion]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [centerLng, centerLat],
        zoom: 10,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapLoaded(true);
        createClusterMarkers();
      });

      map.current.on('click', (e) => {
        // Check if click was on a marker
        const target = e.originalEvent.target as HTMLElement;
        if (!target.closest('.cluster-bubble-marker') && !target.closest('.facility-marker')) {
          onSelectCluster(null);
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapboxToken('');
      localStorage.removeItem('mapbox_token');
    }

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, centerLat, centerLng, clearMarkers]);

  // Update markers when clusters or selection changes
  useEffect(() => {
    if (isMapLoaded) {
      createClusterMarkers();
    }
  }, [isMapLoaded, createClusterMarkers]);

  // Update facility markers when selected cluster changes
  useEffect(() => {
    if (isMapLoaded && selectedClusterId) {
      createFacilityMarkers();
      
      // Zoom to selected cluster
      const cluster = clusters.find(c => c.id === selectedClusterId);
      if (cluster && map.current) {
        map.current.flyTo({
          center: [cluster.center_lng, cluster.center_lat],
          zoom: 12,
          duration: prefersReducedMotion ? 0 : 1000,
        });
      }
    } else {
      facilityMarkersRef.current.forEach(marker => marker.remove());
      facilityMarkersRef.current = [];
      
      // Reset zoom
      if (map.current) {
        map.current.flyTo({
          center: [centerLng, centerLat],
          zoom: 10,
          duration: prefersReducedMotion ? 0 : 1000,
        });
      }
    }
  }, [selectedClusterId, isMapLoaded, clusters, createFacilityMarkers, centerLat, centerLng, prefersReducedMotion]);

  // Handle token submission
  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  // Token input card if no token
  if (!mapboxToken) {
    return (
      <Card className="h-full flex items-center justify-center bg-muted/30">
        <CardContent className="text-center max-w-md p-6">
          <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox access token to view the cluster map.
            Get one free at{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="pk.eyJ1..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      {/* Loading skeleton */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border text-xs">
        <div className="font-semibold mb-2">Utilization</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span>0-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span>50-74%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span>75%+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterMapCanvas;
