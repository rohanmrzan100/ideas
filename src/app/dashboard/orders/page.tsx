'use client';

import { fetchShopOrders } from '@/api/order';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Calendar,
  Loader2,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';

export default function OrderPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shop-orders', activeShopId],
    queryFn: () => fetchShopOrders(activeShopId),
    enabled: !!activeShopId,
  });

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your customer orders here.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px] relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by customer or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 text-gray-400">
            <Loader2 size={32} className="animate-spin mb-2 text-brand" />
            <p className="text-sm">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center h-96 text-red-500">
            <AlertCircle size={32} className="mb-2" />
            <p className="font-medium">Failed to load orders</p>
            <p className="text-sm opacity-80">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="group hover:bg-gray-50/50 transition-colors text-sm"
                    >
                      <td className="px-6 py-4 font-mono text-gray-500">#{order.id.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{order.customer_name}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Phone size={10} /> {order.customer_phone}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {order.customer_district},{' '}
                            {order.customer_location}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-md border border-gray-200 overflow-hidden shrink-0">
                            {/* Optional: Add Image here if available in order.product */}
                            <Package className="w-full h-full p-2 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.product?.name || 'Product'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size: {order.size} • Color: {order.color} • Qty: {order.quantity}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">Rs. {order.total_price}</span>
                        <div className="text-xs text-gray-500 mt-0.5">{order.payment_method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                         `}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        <div className="flex items-center justify-end gap-1">
                          <Calendar size={12} />
                          {order.created_at}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <ShoppingBag size={20} className="opacity-50" />
                        </div>
                        <p>No orders found matching &quot;{searchTerm}&quot;</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
