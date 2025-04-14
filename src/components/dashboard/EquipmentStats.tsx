
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StethoscopeIcon, Calendar, HeartPulse } from "lucide-react";

const EquipmentStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Equipment</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <StethoscopeIcon className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Bookings</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Utilization Rate</p>
            <p className="text-2xl font-bold">72%</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <HeartPulse className="h-5 w-5 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentStats;
