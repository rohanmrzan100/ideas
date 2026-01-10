'use client';

import { fetchShopOrders, Order, OrderStatus, updateOrderStatus } from '@/api/orders';
import { OrderDetailsSheet } from '@/components/orders/OrderDetailSheet';
import { OrderTable } from '@/components/orders/order-table';
import { OrderToolbar } from '@/components/orders/order-toolbar';
import { useAppSelector } from '@/store/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function OrdersPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId);
  const queryClient = useQueryClient();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'preview' | 'edit'>('preview');

  // 1. Fetch Orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['shop-orders', activeShopId],
    queryFn: () => fetchShopOrders(activeShopId || ''),
    enabled: !!activeShopId,
  });

  // 2. Filter Orders (Client-side)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        order.recipient_name?.toLowerCase().includes(searchLower) ||
        order.recipient_phone?.includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Handlers
  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setSheetMode('preview');
    setSheetOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedOrders(ids);
  };

  // --- MODIFIED: Handle Status Change with Stock Toast ---
  const handleStatusChange = (id: string, status: OrderStatus) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    let successMessage = 'Order status updated successfully';

    // 1. Cancelling: Stock Restored
    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      successMessage = 'Order cancelled. Stock restored to inventory';
    }
    // 2. Reactivating: Stock Deducted
    else if (order.status === OrderStatus.CANCELLED && status !== OrderStatus.CANCELLED) {
      successMessage = 'Order reactivated. Stock deducted from inventory';
    }

    // 3. Trigger Toast Promise
    toast.promise(statusMutation.mutateAsync({ id, status }), {
      loading: 'Updating status...',
      success: successMessage,
      error: (err) => err.message || 'Failed to update order status',
    });
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">Manage and track your customer orders.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <OrderToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <OrderTable
          orders={filteredOrders}
          isLoading={isLoading}
          searchTerm={searchTerm}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onView={handleView}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onClearFilter={handleClearFilter}
        />
      </div>

      <OrderDetailsSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialMode={sheetMode}
      />
    </div>
  );
}
