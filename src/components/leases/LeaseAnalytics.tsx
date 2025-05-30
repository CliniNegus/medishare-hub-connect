
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Activity,
  BarChart3
} from "lucide-react";
import { useLeaseAnalytics } from "@/hooks/use-lease-analytics";

interface LeaseAnalyticsProps {
  leases: any[];
  userRole?: string;
}

const LeaseAnalytics = ({ leases, userRole }: LeaseAnalyticsProps) => {
  const analytics = useLeaseAnalytics(leases);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 pb-3">
          <CardTitle className="text-sm font-medium text-[#333333] flex items-center">
            <Activity className="h-4 w-4 mr-2 text-[#E02020]" />
            Active Leases
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-[#333333]">
            {analytics.totalActiveLeases}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Currently active
          </p>
        </CardContent>
      </Card>

      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 pb-3">
          <CardTitle className="text-sm font-medium text-[#333333] flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-[#E02020]" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-[#333333]">
            ${analytics.monthlyRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            From active leases
          </p>
        </CardContent>
      </Card>

      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 pb-3">
          <CardTitle className="text-sm font-medium text-[#333333] flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-[#E02020]" />
            Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-[#333333]">
            ${analytics.totalPortfolioValue.toLocaleString()}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Total active value
          </p>
        </CardContent>
      </Card>

      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 pb-3">
          <CardTitle className="text-sm font-medium text-[#333333] flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#E02020]" />
            Avg. Lease Length
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-[#333333]">
            {analytics.averageLeaseLength}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Months average
          </p>
        </CardContent>
      </Card>

      {/* Status breakdown */}
      <Card className="border-[#E02020]/20 md:col-span-2">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 pb-3">
          <CardTitle className="text-sm font-medium text-[#333333] flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-[#E02020]" />
            Lease Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-green-200 text-green-800">
              Active: {analytics.leasesByStatus.active}
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-800">
              Completed: {analytics.leasesByStatus.completed}
            </Badge>
            <Badge variant="outline" className="border-red-200 text-red-800">
              Canceled: {analytics.leasesByStatus.canceled}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Monthly trend */}
      <Card className="border-[#E02020]/20 md:col-span-2">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20 pb-3">
          <CardTitle className="text-sm font-medium text-[#333333] flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-[#E02020]" />
            6-Month Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {analytics.monthlyTrend.slice(-3).map((month, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{month.month}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">${month.revenue.toLocaleString()}</span>
                  <Badge variant="secondary" className="text-xs">
                    {month.count} leases
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseAnalytics;
