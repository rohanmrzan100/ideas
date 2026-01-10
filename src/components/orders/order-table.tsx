import { Order, OrderStatus } from '@/api/orders';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatFullAddress } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, CreditCard, Edit, Eye, MapPin, Package, ShoppingBag, User } from 'lucide-react';
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
}

type ParsedItem = {
  quantity: number;
  color: string;
  size: string;
};

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
}: OrderTableProps) {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;

  const handleHeaderCheckboxChange = () => {
    if (allSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(orders.map((o) => o.id));
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto min-h-[400px]">
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
            <th className="px-6 py-3 w-[150px]">Date Placed</th>
            <th className="px-6 py-3 min-w-[120px]">Customer & Location</th>
            <th className="px-6 py-3 min-w-[280px]">Product</th>
            <th className="px-6 py-3 w-[120px]">Total</th>
            <th className="px-6 py-3 w-[140px]">Status</th>
            <th className="px-6 py-3 w-[100px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length > 0 ? (
            orders.map((order) => {
              const isSelected = selectedOrders.includes(order.id);
              const items: ParsedItem[] = (() => {
                if (!order.item_description) return [];
                return order.item_description
                  .split(',')
                  .map((part) => {
                    const match = part.trim().match(/(\d+)x\s*([^/]+)\/(.+)/);
                    return match
                      ? {
                          quantity: Number(match[1]),
                          color: match[2].trim(),
                          size: match[3].trim(),
                        }
                      : null;
                  })
                  .filter(Boolean) as ParsedItem[];
              })();

              const findImageForColor = (colorName: string) => {
                if (!order.product?.productImages?.length) return '';
                const exact = order.product.productImages.find(
                  (img) => img.color?.toLowerCase() === colorName.toLowerCase(),
                );
                return exact?.url || order.product.productImages[0]?.url || '';
              };

              return (
                <tr
                  key={order.id}
                  className={`group hover:bg-gray-50 transition-colors text-sm ${
                    isSelected ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => onView(order)}
                >
                  {/* Checkbox */}
                  <td className="px-6 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onSelectOrder(order.id)}
                      className="rounded border-gray-300 text-brand focus:ring-brand mt-1"
                    />
                  </td>

                  {/* Date Placed */}
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

                  {/* Customer & Address */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-gray-400" />
                        <span className="font-semibold text-gray-900 line-clamp-1">
                          {order.recipient_name}
                        </span>
                      </div>
                      <div className="mt-1 flex items-start gap-1.5 text-xs text-gray-600 leading-snug max-w-xs line-clamp-2">
                        <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{formatFullAddress(order)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Product - Displays all item variants */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      {/* Product Name */}
                      <p className="font-medium text-gray-900 text-xs mb-1">
                        {order.product?.name || 'Deleted Product'}
                      </p>

                      {/* Item Variants */}
                      {items.length > 0 ? (
                        <div className="space-y-2 flex gap-6 justify-start">
                          {items.map((item, i) => {
                            const imageUrl = findImageForColor(item.color);
                            return (
                              <div
                                key={i}
                                className="flex flex-col items-center gap-2 py-1.5 border-b last:border-b-0 border-gray-100"
                              >
                                {/* Item Image */}
                                <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden border bg-gray-100">
                                  {imageUrl ? (
                                    <Image
                                      src={imageUrl}
                                      alt={item.color}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package size={16} className="text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {/* Size */}
                                    <span className="text-[10px] font-medium text-gray-700 border border-gray-200 rounded px-1.5 py-0.5">
                                      {item.size}
                                    </span>

                                    {/* Quantity */}
                                    <span className="text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
                                      ×{item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 py-1">
                          <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500">{order.item_quantity} Items</p>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 align-top">
                    <span className="font-bold text-gray-900 block">
                      {formatCurrency(Number(order.amount_to_collect))}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 uppercase">
                      <CreditCard size={10} /> COD
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 align-top relative" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={order.status}
                      onValueChange={(val) => onStatusChange(order.id, val as OrderStatus)}
                    >
                      <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-8 text-xs">
                        <SelectValue placeholder="Status" />
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

                  {/* Actions */}
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1">
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
