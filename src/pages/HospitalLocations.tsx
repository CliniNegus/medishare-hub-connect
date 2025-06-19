
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HospitalMap } from "@/components/hospitals/HospitalMap";
import { HospitalList } from "@/components/hospitals/HospitalList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HospitalLocations = () => {
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select(`
          *,
          hospital_clusters (
            id,
            name,
            description,
            region
          )
        `);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">Hospital Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="map" className="w-full">
            <TabsList>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="w-full">
              <HospitalMap hospitals={hospitals || []} />
            </TabsContent>
            <TabsContent value="list">
              <HospitalList hospitals={hospitals || []} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalLocations;
