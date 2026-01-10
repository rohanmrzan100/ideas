'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Package, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

// API & Store
import {
  cancelPathaoDelivery,
  fetchShopOrders,
  Order,
  OrderStatus,
  requestPathaoDelivery,
  updateOrderStatus,
} from '@/api/orders';
import { useAppSelector } from '@/store/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Custom Components
import { OrderTable } from '@/components/orders/order-table';
import { OrderToolbar } from '@/components/orders/order-toolbar';
import { OrderDetailsSheet } from '@/components/orders/OrderDetailSheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OrderPage() {
  const activeShopId = useAppSelector((s) => s.app.activeShopId) ?? '';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Sheet State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const queryClient = useQueryClient();
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
    staleTime: 30000,
  });

  // Filter Logic
  const filteredOrders = useMemo(() => {
    let result = orders;

    // 1. Status Filter
    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.status === statusFilter);
    }

    // 2. Search Filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const name = (order.recipient_name || order.recipient_name || '').toLowerCase();
        const id = order.id.toLowerCase();
        const phone = (order.recipient_phone || order.recipient_phone || '').toLowerCase();
        return (
          name.includes(lowerSearch) || id.includes(lowerSearch) || phone.includes(lowerSearch)
        );
      });
    }

    return result;
  }, [orders, searchTerm, statusFilter]);

  // Bulk Actions
  const handleSelectOrder = (id: string) => {
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]));
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedOrders(ids);
  };

  const handleBulkAction = (action: string) => {
    toast.info(`Bulk ${action} for ${selectedOrders.length} orders (Not implemented in API yet)`);
    // Here you would call a mutation to update status for all selected IDs
    setSelectedOrders([]);
  };

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === OrderStatus.PENDING).length;
    const processing = orders.filter((o) => o.status === OrderStatus.CONFIRMED).length;
    return { pending, processing };
  }, [orders]);

  const handleOpenSheet = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setTimeout(() => setSelectedOrder(null), 300);
  };

  async function onStatusChange(order_id: string, orderStatus: OrderStatus) {
    toast.promise(
      async () => {
        await updateOrderStatus(order_id, orderStatus);
        // Refresh data to show new status in UI
        await queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      },
      {
        loading: 'Updating status...',
        success: 'Order status updated!',
        error: 'Failed to update status',
      },
    );
  }

  // --- Delivery Handlers ---
  const handleCreateDelivery = async (id: string) => {
    toast.promise(requestPathaoDelivery(id), {
      loading: 'Requesting delivery...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
        return 'Delivery requested successfully';
      },
      error: (err) => err.message || 'Failed to request delivery',
    });
  };

  const handleCancelDelivery = async (id: string) => {
    toast.promise(cancelPathaoDelivery(id), {
      loading: 'Cancelling delivery...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
        return 'Delivery cancelled successfully';
      },
      error: (err) => err.message || 'Failed to cancel delivery',
    });
  };

  return (
    <div className="space-y-6 p-1 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500">Manage and track your order pipeline</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium bg-white">
            Total: {orders.length}
          </Badge>
          {stats.pending > 0 && (
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-sm font-medium bg-amber-50 border-amber-200 text-amber-700"
            >
              Pending: {stats.pending}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative min-h-150">
        {/* Bulk Action Bar (Overlay) */}
        {selectedOrders.length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-blue-600 text-white p-2 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="px-4 font-bold text-sm">{selectedOrders.length} selected</div>
            <div className="flex items-center gap-2 px-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleBulkAction('Ship')}
                className="h-8 text-xs"
              >
                Mark Shipped
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('Delete')}
                className="h-8 text-xs"
              >
                <Trash2 size={12} className="mr-1" /> Delete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedOrders([])}
                className="h-8 text-xs text-white hover:text-blue-100 hover:bg-blue-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <OrderToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        )}

        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle size={32} className="text-red-500 mb-2" />
            <p>Failed to load orders</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex-1">
            <OrderTable
              onStatusChange={onStatusChange}
              orders={filteredOrders}
              isLoading={isLoading}
              searchTerm={searchTerm}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrder}
              onSelectAll={handleSelectAll}
              onView={handleOpenSheet}
              onEdit={handleOpenSheet}
              onClearFilter={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              // Pass handlers
              onCreateDelivery={handleCreateDelivery}
              onCancelDelivery={handleCancelDelivery}
            />
          </div>
        )}
      </div>

      <OrderDetailsSheet order={selectedOrder} open={isSheetOpen} onOpenChange={handleCloseSheet} />
    </div>
  );
}
