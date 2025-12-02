import { Card, CardContent } from '@/components/ui/card';
import { ManufacturerOrder } from '@/hooks/useManufacturerOrders';
import { Clock, CheckCircle2, XCircle, Package, Truck, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ManufacturerOrderStatsProps {
  orders: ManufacturerOrder[];
}

export const ManufacturerOrderStats = ({ orders }: ManufacturerOrderStatsProps) => {
  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    declined: orders.filter(o => o.status === 'declined').length,
    totalRevenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.amount, 0),
  };

  const statCards = [
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'In Progress',
      value: stats.processing + stats.accepted + stats.shipped,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Declined',
      value: stats.declined,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-[#E02020]',
      bgColor: 'bg-red-50',
      isRevenue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className={stat.bgColor}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
