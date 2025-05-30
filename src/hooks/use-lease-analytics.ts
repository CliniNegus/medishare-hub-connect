
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";

interface LeaseAnalytics {
  totalActiveLeases: number;
  monthlyRevenue: number;
  totalPortfolioValue: number;
  averageLeaseLength: number;
  leasesByStatus: {
    active: number;
    completed: number;
    canceled: number;
  };
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
}

export const useLeaseAnalytics = (leases: any[]) => {
  const [analytics, setAnalytics] = useState<LeaseAnalytics>({
    totalActiveLeases: 0,
    monthlyRevenue: 0,
    totalPortfolioValue: 0,
    averageLeaseLength: 0,
    leasesByStatus: {
      active: 0,
      completed: 0,
      canceled: 0,
    },
    monthlyTrend: [],
  });
  const { profile } = useAuth();

  useEffect(() => {
    if (!leases.length) return;

    // Calculate analytics
    const activeLeases = leases.filter(lease => lease.status === 'active');
    const completedLeases = leases.filter(lease => lease.status === 'completed');
    const canceledLeases = leases.filter(lease => lease.status === 'canceled');

    const monthlyRevenue = activeLeases.reduce(
      (sum, lease) => sum + (lease.monthly_payment || 0), 
      0
    );

    const totalPortfolioValue = activeLeases.reduce(
      (sum, lease) => sum + (lease.total_value || 0), 
      0
    );

    // Calculate average lease length in months
    const averageLeaseLength = activeLeases.length > 0 
      ? activeLeases.reduce((sum, lease) => {
          const start = new Date(lease.start_date);
          const end = new Date(lease.end_date);
          const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                        (end.getMonth() - start.getMonth());
          return sum + months;
        }, 0) / activeLeases.length
      : 0;

    // Calculate monthly trend (last 6 months)
    const monthlyTrend = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthLeases = leases.filter(lease => {
        const createdAt = new Date(lease.created_at);
        return createdAt >= monthStart && createdAt <= monthEnd;
      });

      const monthRevenue = monthLeases.reduce(
        (sum, lease) => sum + (lease.monthly_payment || 0), 
        0
      );

      monthlyTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        count: monthLeases.length,
      });
    }

    setAnalytics({
      totalActiveLeases: activeLeases.length,
      monthlyRevenue,
      totalPortfolioValue,
      averageLeaseLength: Math.round(averageLeaseLength),
      leasesByStatus: {
        active: activeLeases.length,
        completed: completedLeases.length,
        canceled: canceledLeases.length,
      },
      monthlyTrend,
    });
  }, [leases, profile]);

  return analytics;
};
