'use client';

import { fetchShopOrders, OrderStatus } from '@/api/orders';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';
import { format, isSameDay, subDays } from 'date-fns';
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Loader2,
  LucideIcon,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['shop-orders', activeShopId],
    queryFn: () => fetchShopOrders(activeShopId),
    enabled: !!activeShopId,
  });

  // --- Metrics Calculation ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (acc, o) => acc + Number(o.amount_to_collect || o.amount_to_collect || 0),
      0,
    );
    const deliveredOrders = orders.filter((o) => o.status === OrderStatus.DELIVERED).length;
    const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING).length;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Last 7 Days Data for Chart
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayOrders = orders.filter((o) => isSameDay(new Date(o.created_at), date));
      const revenue = dayOrders.reduce(
        (acc, o) => acc + Number(o.amount_to_collect || o.amount_to_collect || 0),
        0,
      );
      return { date, revenue, count: dayOrders.length };
    });

    const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1); // Avoid division by zero

    return { totalRevenue, deliveredOrders, pendingOrders, avgOrderValue, last7Days, maxRevenue };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store&apos;s performance.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Orders"
          value={orders.length.toString()}
          icon={Package}
          subValue={`${stats.pendingOrders} Pending`}
        />
        <StatCard
          title="Delivered"
          value={stats.deliveredOrders.toString()}
          icon={Users}
          subValue="Completed orders"
        />
        <StatCard
          title="Avg. Order Value"
          value={`Rs. ${Math.round(stats.avgOrderValue).toLocaleString()}`}
          icon={CreditCard}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={18} /> Revenue (Last 7 Days)
              </h3>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
            {stats.last7Days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end h-full">
                  <div
                    className="w-full bg-brand/10 group-hover:bg-brand/20 rounded-t-lg transition-all relative"
                    style={{ height: `${(day.revenue / stats.maxRevenue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Rs. {day.revenue}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{format(day.date, 'EEE')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity / Simple List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Recent Sales
          </h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {order.recipient_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {order.recipient_name || 'Customer'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {format(new Date(order.created_at), 'MMM dd')}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  Rs. {Number(order.amount_to_collect || 0).toLocaleString()}
                </span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No recent sales</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, subValue, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
          <Icon size={20} />
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
              trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {trend} <ArrowUpRight size={12} />
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
        {subValue && <p className="text-xs text-gray-400 mt-1 font-medium">{subValue}</p>}
      </div>
    </div>
  );
}
