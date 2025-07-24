import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, DollarSign, MapPin } from "lucide-react";

interface TrackingEquipment {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  image_url?: string;
  usage_hours: number;
  downtime_hours: number;
  remote_control_enabled: boolean;
  updated_at: string;
}

interface EquipmentAnalytics {
  id: string;
  equipment_id: string;
  usage_hours: number;
  downtime_hours: number;
  revenue_generated: number;
  date_recorded: string;
  last_location: string;
}

interface EquipmentMetricsTabProps {
  analytics: EquipmentAnalytics[];
  equipmentName: string;
  equipment: TrackingEquipment;
}

const EquipmentMetricsTab: React.FC<EquipmentMetricsTabProps> = ({
  analytics,
  equipmentName,
  equipment,
}) => {
  const totalHours = equipment.usage_hours + equipment.downtime_hours;
  const uptimePercentage = totalHours > 0 ? (equipment.usage_hours / totalHours) * 100 : 0;
  const totalRevenue = analytics.reduce((sum, item) => sum + (item.revenue_generated || 0), 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usage Hours</p>
                <p className="text-2xl font-bold text-foreground">{equipment.usage_hours}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-foreground">{uptimePercentage.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Equipment Uptime</span>
              <span>{uptimePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={uptimePercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Usage Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Hours:</span>
                  <span className="font-medium">{equipment.usage_hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downtime:</span>
                  <span className="font-medium">{equipment.downtime_hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Runtime:</span>
                  <span className="font-medium">{totalHours}h</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Location & Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{equipment.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(equipment.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remote Control:</span>
                  <span className={`font-medium ${equipment.remote_control_enabled ? 'text-green-600' : 'text-red-600'}`}>
                    {equipment.remote_control_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Analytics */}
      {analytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium text-sm">
                      {new Date(item.date_recorded).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Usage: {item.usage_hours}h | Revenue: ${item.revenue_generated}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.last_location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquipmentMetricsTab;