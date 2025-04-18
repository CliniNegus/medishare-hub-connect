
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website?: string;
  working_hours?: string;
}

const HospitalMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .order('name');

        if (error) throw error;
        setHospitals(data || []);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !hospitals.length) return;

    const initMap = () => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: { lat: -1.2921, lng: 36.8219 }, // Nairobi center
        zoom: 12,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }]
          }
        ]
      });

      setMap(mapInstance);

      // Create markers for each hospital
      hospitals.forEach(hospital => {
        const marker = new google.maps.Marker({
          position: { lat: hospital.latitude, lng: hospital.longitude },
          map: mapInstance,
          title: hospital.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#dc2626",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">${hospital.name}</h3>
              <p class="text-sm">${hospital.address}</p>
              ${hospital.phone ? `<p class="text-sm">📞 ${hospital.phone}</p>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          setSelectedHospital(hospital);
          infoWindow.open(mapInstance, marker);
        });
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [hospitals]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-600" />
          Hospitals in Nairobi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <div ref={mapRef} className="absolute inset-0" />
            {selectedHospital && (
              <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
                <h3 className="font-bold text-lg">{selectedHospital.name}</h3>
                <p className="text-sm text-gray-600">{selectedHospital.address}</p>
                {selectedHospital.phone && (
                  <p className="text-sm text-gray-600 mt-1">
                    📞 {selectedHospital.phone}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HospitalMap;
