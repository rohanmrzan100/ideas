import { Order } from '@/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, Edit2, MapPin, Package, Phone, Printer, User } from 'lucide-react';
import Image from 'next/image';
import { OrderStatusBadge } from './order-status-badge';

interface OrderPreviewProps {
  order: Order;
  onEdit: () => void;
}

type ParsedItem = {
  quantity: number;
  color: string;
  size: string;
};

export function OrderPreview({ order, onEdit }: OrderPreviewProps) {
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

  const formatCurrency = (amount: number | string) =>
    new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(Number(amount));

  const subtotal = items.reduce(
    (sum, item) => sum + Number(order.product?.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-4xl mx-auto p-4 space-y-4 print:p-0">
        {/* Header */}
        <div className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:border-b-2 print:rounded-none">
          <div>
            <h2 className="text-lg font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(order.created_at), 'PPP, p')}
            </div>
          </div>

          <div className="flex gap-2 print:hidden">
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer size={14} />
            </Button>
            <Button size="sm" onClick={onEdit}>
              <Edit2 size={14} className="mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between bg-white border rounded-lg px-4 py-2 text-sm print:hidden">
          <span className="text-gray-600">Status</span>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Product */}
        {order.product && (
          <div className="bg-white border rounded-lg p-4 flex gap-4">
            <div className="relative w-20 h-20 rounded-md overflow-hidden border bg-gray-100">
              <Image
                src={order.product.open_graph_image || order.product.productImages?.[0]?.url || ''}
                alt={order.product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold">{order.product.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{order.product.description}</p>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-base font-bold">{formatCurrency(order.product.price)}</span>
                <Badge variant="secondary" className="text-xs">
                  {items.length} variants
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Customer & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</h4>
            <div className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              {order.recipient_name}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-400" />
              {order.recipient_phone}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Address</h4>
            <div className="text-sm text-gray-700 flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
              <span>{order.recipient_address}</span>
            </div>
          </div>
        </div>
        {/* Items */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Package className="w-4 h-4" />
            Items
          </h3>

          {items.length ? (
            <div className="divide-y">
              {items.map((item, i) => {
                const imageUrl = findImageForColor(item.color);
                const itemTotal = Number(order.product!.price) * item.quantity;

                return (
                  <div key={i} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                    {/* Item Image */}
                    <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden border bg-gray-100">
                      {imageUrl && (
                        <Image src={imageUrl} alt={item.color} fill className="object-cover" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Size */}
                        <span className="text-xs font-medium text-gray-700 border border-gray-200 rounded-md px-2 py-0.5">
                          Size {item.size}
                        </span>

                        {/* Quantity */}
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
                          Qty {item.quantity}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        {formatCurrency(order.product!.price)} × {item.quantity}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(itemTotal)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No items</p>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {order.delivery_fee && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Delivery</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
          )}

          <div className="flex justify-between mt-4 pt-3 border-t">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-bold">{formatCurrency(order.amount_to_collect)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
