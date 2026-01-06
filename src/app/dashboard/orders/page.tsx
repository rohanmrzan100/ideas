'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Package, TrendingUp } from 'lucide-react';
import { useState, useMemo } from 'react';

// API & Store
import { fetchShopOrders, Order, OrderStatus } from '@/api/orders';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';

// Custom Components
import { OrderTable } from '@/components/orders/order-table';
import { OrderToolbar } from '@/components/orders/order-toolbar';
import { OrderDetailsSheet } from '@/components/orders/OrderDetailSheet';

export default function OrderPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const [searchTerm, setSearchTerm] = useState('');

  // Sheet State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shop-orders', activeShopId],
    queryFn: () => fetchShopOrders(activeShopId),
    enabled: !!activeShopId,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Enhanced filter logic with memoization
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const lowerSearch = searchTerm.toLowerCase();
    return orders.filter((order: Order) => {
      const customerName = order.customer_name?.toLowerCase() || '';
      const orderId = order.id.toLowerCase();
      const customerPhone = order.customer_phone || '';

      return (
        customerName.includes(lowerSearch) ||
        orderId.includes(lowerSearch) ||
        customerPhone.includes(lowerSearch)
      );
    });
  }, [orders, searchTerm]);

  // Calculate order statistics
  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === OrderStatus.PENDING).length;
    const processing = orders.filter((o) => o.status === OrderStatus.CONFIRMED).length;
    const completed = orders.filter((o) => o.status === OrderStatus.DELIVERED).length;

    return { pending, processing, completed };
  }, [orders]);

  const handleOpenSheet = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Small delay before clearing to allow smooth animation
      setTimeout(() => setSelectedOrder(null), 300);
    }
  };

  return (
    <div className="space-y-6 p-1 pb-8">
      {/* Enhanced Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500">Manage and track your order pipeline</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 transition-colors border-gray-300"
          >
            <span className="text-gray-600">Total:</span>
            <span className="ml-1.5 font-bold text-gray-900">{orders.length}</span>
          </Badge>

          {stats.pending > 0 && (
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-sm font-medium bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
              Pending: {stats.pending}
            </Badge>
          )}

          {stats.processing > 0 && (
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-sm font-medium bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Processing: {stats.processing}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Card with improved styling */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative min-h-[600px] transition-shadow hover:shadow-md">
        <OrderToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Enhanced Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
              <Loader2 size={40} className="absolute top-2 left-2 animate-spin text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700 mt-4">Syncing orders...</p>
            <p className="text-xs text-gray-500 mt-1">This won&apos;t take long</p>
          </div>
        )}

        {/* Enhanced Error State */}
        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load orders</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Order Table */}
        {!isLoading && !isError && (
          <div className="flex-1">
            <OrderTable
              orders={filteredOrders}
              isLoading={isLoading}
              searchTerm={searchTerm}
              onView={handleOpenSheet}
              onEdit={handleOpenSheet}
              onClearFilter={() => setSearchTerm('')}
            />
          </div>
        )}
      </div>

      {/* Enhanced Order Details Sheet */}
      <OrderDetailsSheet order={selectedOrder} open={isSheetOpen} onOpenChange={handleCloseSheet} />
    </div>
  );
}
