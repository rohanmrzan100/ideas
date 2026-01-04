'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// API & Store
import { fetchShopOrders, Order, OrderStatus, updateOrderStatus } from '@/api/orders';
import { useAppSelector } from '@/store/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Custom Components
import { OrderToolbar } from '@/components/orders/order-toolbar';
import { OrderTable } from '@/components/orders/order-table';
import { ViewOrderDialog } from '@/components/orders/view-order-dialog';
import { EditStatusDialog } from '@/components/orders/edit-status-dialog';

export default function OrderPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  const queryClient = useQueryClient();

  // 1. Fetch
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

  // 2. Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders', activeShopId] });
      setEditOrder(null);
    },
    onError: (err) => {
      alert('Failed to update status'); // Replace with toast
      console.error(err);
    },
  });

  // 3. Filter Logic
  const filteredOrders = orders.filter(
    (order: Order) =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm),
  );

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
            onView={setViewOrder}
            onEdit={setEditOrder}
            onClearFilter={() => setSearchTerm('')}
          />
        )}
      </div>

      {/* Modals */}
      <ViewOrderDialog
        order={viewOrder}
        open={!!viewOrder}
        onOpenChange={(open) => !open && setViewOrder(null)}
      />

      <EditStatusDialog
        order={editOrder}
        open={!!editOrder}
        onOpenChange={(open) => !open && setEditOrder(null)}
        isSaving={updateStatusMutation.isPending}
        onSave={(id, status) => updateStatusMutation.mutate({ id, status })}
      />
    </div>
  );
}
