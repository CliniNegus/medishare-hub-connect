import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  popularity_score: number;
  is_featured: boolean;
  booking_count: number;
  status: string;
}

const EquipmentPopularityManager = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name, manufacturer, category, popularity_score, is_featured, booking_count, status')
        .order('popularity_score', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        title: "Error",
        description: "Failed to fetch equipment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (equipmentId: string, currentFeatured: boolean) => {
    setUpdating(equipmentId);
    try {
      const { error } = await supabase
        .from('equipment')
        .update({ is_featured: !currentFeatured })
        .eq('id', equipmentId);

      if (error) throw error;

      setEquipment(prev => 
        prev.map(item => 
          item.id === equipmentId 
            ? { ...item, is_featured: !currentFeatured }
            : item
        )
      );

      toast({
        title: "Success",
        description: `Equipment ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const updatePopularityScore = async (equipmentId: string, newScore: number) => {
    setUpdating(equipmentId);
    try {
      const { error } = await supabase
        .from('equipment')
        .update({ popularity_score: newScore })
        .eq('id', equipmentId);

      if (error) throw error;

      setEquipment(prev => 
        prev.map(item => 
          item.id === equipmentId 
            ? { ...item, popularity_score: newScore }
            : item
        )
      );

      toast({
        title: "Success",
        description: "Popularity score updated successfully",
      });
    } catch (error) {
      console.error('Error updating popularity score:', error);
      toast({
        title: "Error",
        description: "Failed to update popularity score",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const recalculateAllScores = async () => {
    setLoading(true);
    try {
      // Call the stored procedure to update all popularity scores
      for (const item of equipment) {
        await supabase.rpc('update_equipment_popularity_score', {
          equipment_id_param: item.id
        });
      }

      await fetchEquipment();
      toast({
        title: "Success",
        description: "All popularity scores recalculated based on current bookings",
      });
    } catch (error) {
      console.error('Error recalculating scores:', error);
      toast({
        title: "Error",
        description: "Failed to recalculate popularity scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading equipment data...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Equipment Popularity Management
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Manage which equipment appears in the "Most Popular" sections across all dashboards
          </p>
          <Button 
            onClick={recalculateAllScores}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Popularity Score</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.manufacturer}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.booking_count}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.popularity_score}
                      onChange={(e) => updatePopularityScore(item.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                      disabled={updating === item.id}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={item.is_featured ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFeatured(item.id, item.is_featured)}
                      disabled={updating === item.id}
                    >
                      <Star className={`h-4 w-4 mr-1 ${item.is_featured ? 'fill-current' : ''}`} />
                      {item.is_featured ? 'Featured' : 'Feature'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p><strong>Popularity Score:</strong> Calculated as (Bookings × 10) + Usage Hours</p>
          <p><strong>Featured Equipment:</strong> Always appears in top 5, regardless of score</p>
          <p><strong>Top 5 Display:</strong> Featured equipment + highest scoring equipment (up to 5 total)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentPopularityManager;