'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

// API & Store
import { fetchShopOrders, Order } from '@/api/orders';
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
  });

  // 2. Filter Logic
  const filteredOrders = orders.filter(
    (order: Order) =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm),
  );

  const handleOpenSheet = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your incoming orders, track status, and update deliveries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium bg-white">
            Total: <span className="ml-1 font-bold text-foreground">{orders.length}</span>
          </Badge>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative min-h-[500px]">
        <OrderToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Global Loading / Error States */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-3 text-primary" />
            <p className="text-sm font-medium">Syncing orders...</p>
          </div>
        )}

        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center text-red-500 p-12">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <AlertCircle size={24} />
            </div>
            <p className="font-medium">Failed to load orders</p>
            <p className="text-sm opacity-80 mt-1">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {/* The List */}
        {!isLoading && !isError && (
          <OrderTable
            orders={filteredOrders}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onView={handleOpenSheet} // Open the detailed sheet
            onEdit={handleOpenSheet} // Reuse the sheet for editing too
            onClearFilter={() => setSearchTerm('')}
          />
        )}
      </div>

      {/* The New Detailed Sheet */}
      <OrderDetailsSheet order={selectedOrder} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
