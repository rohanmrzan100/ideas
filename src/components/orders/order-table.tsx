import { Order, OrderStatus } from '@/api/orders';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatFullAddress } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  searchTerm: string;
  selectedOrders: string[];
  onSelectOrder: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onClearFilter: () => void;
  onCreateDelivery: (id: string) => void;
  onCancelDelivery: (id: string) => void;
}

export function OrderTable({
  orders,
  isLoading,
  searchTerm,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onView,
  onEdit,
  onStatusChange,
  onClearFilter,
  onCreateDelivery,
  onCancelDelivery,
}: OrderTableProps) {
  if (isLoading) return null;

  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;

  const handleHeaderCheckboxChange = () => {
    if (allSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(orders.map((o) => o.id));
    }
  };

  return (
    <div className="flex-1 overflow-x-auto min-h-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
            <th className="px-6 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleHeaderCheckboxChange}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
            </th>
            <th className="px-6 py-3 w-37.5">Date Placed</th>
            <th className="px-6 py-3 max-w-15">Customer & Location</th>
            <th className="px-6 py-3 min-w-70">Product</th>
            <th className="px-6 py-3 w-30">Total</th>
            <th className="px-6 py-3 w-35">Status</th>
            <th className="px-6 py-3 w-32 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length > 0 ? (
            orders.map((order) => {
              const isSelected = selectedOrders.includes(order.id);
              const hasPathao = !!order.shop?.pathao_store_id;
              const hasConsignment = !!order.delivery_consignment_id;

              return (
                <tr
                  key={order.id}
                  className={`group hover:bg-gray-50 transition-colors text-sm ${
                    isSelected ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => onView(order)}
                >
                  <td className="px-6 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectOrder(order.id)}
                      className="rounded border-gray-300 text-brand focus:ring-brand mt-1"
                    />
                  </td>
                  {/* 1. Date */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900 flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        {format(new Date(order.created_at), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-[10px] text-gray-400 pl-5">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </td>

                  {/* 2. Customer & Address */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{order.recipient_name}</span>
                      </div>
                      <div className="mt-1 flex items-start gap-1.5 text-xs text-gray-600 leading-snug max-w-xs">
                        <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{formatFullAddress(order)}</span>
                      </div>
                    </div>
                  </td>

                  {/* 3. Product */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 relative">
                        {order.product?.productImages?.[0] ? (
                          <Image
                            src={order.product.productImages[0].url}
                            alt="Img"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package size={24} className="text-gray-400 m-auto mt-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1 text-xs mb-1">
                          {order.product?.name}
                        </p>
                        <p className="text-[10px] text-gray-500">{order.item_quantity} Items</p>
                      </div>
                    </div>
                  </td>

                  {/* 4. Total */}
                  <td className="px-6 py-4 align-top">
                    <span className="font-bold text-gray-900 block">
                      {formatCurrency(Number(order.amount_to_collect))}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 uppercase">
                      <CreditCard size={10} /> COD
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top relative">
                    <Select
                      onValueChange={(val) => onStatusChange(order.id, val as OrderStatus)}
                      defaultValue={order.status}
                    >
                      <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-10">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={OrderStatus.PENDING}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value={OrderStatus.CONFIRMED}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            Confirmed
                          </div>
                        </SelectItem>
                        <SelectItem value={OrderStatus.SHIPPED}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            Shipped
                          </div>
                        </SelectItem>
                        <SelectItem value={OrderStatus.DELIVERED}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Delivered
                          </div>
                        </SelectItem>
                        <SelectItem value={OrderStatus.CANCELLED}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* 6. Actions */}
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Delivery Buttons (Only if pathao_store_id exists) */}
                      {hasPathao && !hasConsignment && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-green-600 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateDelivery(order.id);
                          }}
                          title="Create Delivery Request"
                        >
                          <Truck size={16} />
                        </Button>
                      )}

                      {hasPathao && hasConsignment && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelDelivery(order.id);
                          }}
                          title="Cancel Delivery Request"
                        >
                          <XCircle size={16} />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(order);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(order);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-24 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="opacity-40" />
                  </div>
                  <p className="font-medium text-lg text-gray-900">No orders found</p>
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
