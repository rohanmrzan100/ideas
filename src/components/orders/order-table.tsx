import { Order } from '@/api/orders';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { OrderStatusBadge } from './order-status-badge';
import Image from 'next/image';

// --- Helpers ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatFullAddress = (order: Order) => {
  return [order.customer_location, order.customer_district].filter(Boolean).join(', ');
};

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  searchTerm: string;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onClearFilter: () => void;
}

export function OrderTable({
  orders,
  isLoading,
  searchTerm,
  onView,
  onEdit,
  onClearFilter,
}: OrderTableProps) {
  if (isLoading) return null;

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
            <th className="px-6 py-3 w-37.5">Date Placed</th>
            <th className="px-6 py-3 min-w-55">Customer & Location</th>
            <th className="px-6 py-3 min-w-70">Product</th>
            <th className="px-6 py-3">Total</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="group hover:bg-gray-50 transition-colors text-sm">
                {/* 1. Date */}
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-400" />
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-xs text-gray-500 pl-4.5">
                      {format(new Date(order.created_at), 'h:mm a')}
                    </span>
                    <span className="text-[10px] text-gray-400 pl-4.5 mt-1">
                      Ref: {order.id.slice(-4)}
                    </span>
                  </div>
                </td>

                {/* 2. Customer & Address */}
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-gray-400" />
                      <span className="font-semibold text-gray-900">{order.customer_name}</span>
                    </div>

                    <a
                      href={`tel:${order.customer_phone}`}
                      className="text-xs text-gray-500 flex items-center gap-1.5 hover:text-blue-600 hover:underline w-fit"
                    >
                      <Phone size={12} /> {order.customer_phone}
                    </a>

                    <div className="mt-1 flex items-start gap-1.5 text-xs text-gray-600 leading-snug bg-gray-50 p-1.5 rounded border border-gray-100 max-w-50">
                      <MapPin size={12} className="shrink-0 mt-0.5 text-red-400" />
                      <span>{formatFullAddress(order)}</span>
                    </div>
                  </div>
                </td>

                {/* 3. Product with Items List */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {order.product ? (
                        <Image
                          width={500}
                          height={500}
                          src={
                            order.product?.productImages ? order.product?.productImages[0].url : ''
                          }
                          alt={order.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-2 leading-tight mb-2">
                        {order.product?.name || 'Unknown Product Item'}
                      </p>

                      <div className="flex flex-col gap-1.5">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-gray-600 bg-gray-100 px-1.5 rounded border border-gray-200">
                                {item.quantity}x
                              </span>

                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: item.color.toLowerCase() }}
                                />
                                <span className="text-gray-700 capitalize">{item.color}</span>
                                <span className="text-gray-300">/</span>
                                <span className="text-gray-700 font-medium">{item.size}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          // Fallback for orders without parsed items (shouldn't happen with new logic)
                          <span className="text-xs text-gray-400 italic">
                            No variants specified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 4. Total */}
                <td className="px-6 py-4 align-top">
                  <span className="font-bold text-gray-900 block">
                    {formatCurrency(order.total_price)}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 uppercase">
                    <CreditCard size={10} /> {order.payment_method}
                  </div>
                </td>

                {/* 5. Status */}
                <td className="px-6 py-4 align-top">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* 6. Actions */}
                <td className="px-6 py-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-900"
                      onClick={() => onView(order)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-blue-600"
                      onClick={() => onEdit(order)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-24 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="opacity-40" />
                  </div>
                  <p className="font-medium text-lg text-gray-900">No orders found</p>
                  <p className="text-sm max-w-xs mx-auto">
                    {searchTerm
                      ? `No results found for "${searchTerm}".`
                      : "You haven't received any orders yet."}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" size="sm" onClick={onClearFilter} className="mt-2">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
