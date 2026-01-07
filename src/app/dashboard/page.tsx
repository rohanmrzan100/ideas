'use client';

import { fetchShopOrders, OrderStatus } from '@/api/orders';
import { fetchShopProducts } from '@/api/shop';
import { formatCurrency } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Box,
  CreditCard,
  DollarSign,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { format } from 'date-fns';

export default function DashboardOverview() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const user = useAppSelector((s) => s.app.user);

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['shop-products', activeShopId],
    queryFn: () => fetchShopProducts(activeShopId),
    enabled: !!activeShopId,
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['shop-orders', activeShopId],
    queryFn: () => fetchShopOrders(activeShopId),
    enabled: !!activeShopId,
  });

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + Number(o.amount_to_collect || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING);
    const lowStockProducts = products.filter((p) => {
      const totalStock = p.product_variants.reduce((sum, v) => sum + v.stock, 0);
      return totalStock > 0 && totalStock < 5;
    });

    return {
      totalRevenue,
      pendingCount: pendingOrders.length,
      productCount: products.length,
      lowStockCount: lowStockProducts.length,
      recentOrders: orders.slice(0, 5),
    };
  }, [orders, products]);

  const isLoading = loadingProducts || loadingOrders;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 text-brand" />
        <p className="text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* --- Welcome Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-medium">
            <Clock size={14} />
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Good Morning, {user?.name?.split(' ')[0] || 'Seller'}! ☀️
          </h1>
          <p className="text-gray-500 mt-1">
            You have <span className="font-bold text-brand">{stats.pendingCount} new orders</span>{' '}
            to process today.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/product"
            className="inline-flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition shadow-lg shadow-brand/20 active:scale-95 transform duration-200"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-green-100 text-green-700 rounded-xl">
                <DollarSign size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +12%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
        </div>

        {/* Pending Orders */}
        <Link
          href="/dashboard/orders"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand/50 hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <ShoppingBag size={20} />
              </div>
              <ArrowUpRight
                size={18}
                className="text-gray-300 group-hover:text-brand transition-colors"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-extrabold text-gray-900">{stats.pendingCount}</p>
              {stats.pendingCount > 0 && (
                <span className="text-xs text-amber-600 font-medium">Needs attention</span>
              )}
            </div>
          </div>
        </Link>

        {/* Total Products */}
        <Link
          href="/dashboard/my-products"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand/50 hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Box size={20} />
              </div>
              <ArrowUpRight
                size={18}
                className="text-gray-300 group-hover:text-brand transition-colors"
              />
            </div>
            <p className="text-sm font-medium text-gray-500">Active Products</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{stats.productCount}</p>
          </div>
        </Link>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                <AlertCircle size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-extrabold text-gray-900">{stats.lowStockCount}</p>
              {stats.lowStockCount > 0 && (
                <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">
                  Action needed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* --- Recent Activity Feed --- */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package size={18} className="text-brand" /> Recent Orders
            </h3>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold text-brand hover:text-brand-primary flex items-center gap-1 group"
            >
              View All{' '}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-bold text-lg shadow-inner">
                        {order.recipient_name?.charAt(0) || '#'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors">
                          {order.recipient_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{order.item_quantity} Items</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{format(new Date(order.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(Number(order.amount_to_collect))}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-medium">No orders received yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- Quick Actions & Tips --- */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand to-[#1e1b4b] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CreditCard size={120} className="-rotate-12" />
            </div>
            <h3 className="font-bold text-lg relative z-10 mb-2">Share your shop</h3>
            <p className="text-white/80 text-sm mb-6 relative z-10 max-w-[90%] leading-relaxed">
              Get more sales by sharing your unique store link on Instagram & TikTok.
            </p>
            <button className="relative z-10 bg-white text-brand px-4 py-2.5 rounded-xl text-sm font-bold w-full hover:bg-gray-50 transition shadow-md active:scale-95 duration-200">
              Copy Store Link
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-6">Store Health</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="text-green-600">85%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-green-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-600">Monthly Revenue Goal</span>
                  <span className="text-brand">42%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-brand rounded-full" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right">Target: Rs. 100,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
