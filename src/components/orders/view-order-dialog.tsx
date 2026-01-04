import { Order } from '@/api/orders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar, MapPin, Package, User } from 'lucide-react';
import Image from 'next/image';
import { OrderStatusBadge } from './order-status-badge';

interface ViewOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// FIX: Removed customer_city
const formatFullAddress = (order: Order) => {
  return [order.customer_location, order.customer_district].filter(Boolean).join(', ');
};

export function ViewOrderDialog({ order, open, onOpenChange }: ViewOrderDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Order Details</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <Calendar size={12} />
            Placed on {format(new Date(order.created_at), 'PPP')} at{' '}
            {format(new Date(order.created_at), 'p')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          {/* Status Banner */}
          <div className="flex justify-between items-center bg-gray-50/80 p-4 rounded-lg border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Current Status</span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b pb-1">
                Customer
              </h4>
              <div className="text-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="text-gray-500 text-xs hover:text-blue-600 block mt-0.5"
                    >
                      {order.customer_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-50 p-2 rounded-full">
                    <MapPin size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-xs">Delivery Address</p>
                    <p className="text-gray-600 leading-snug mt-0.5">{formatFullAddress(order)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b pb-1">
                Payment Summary
              </h4>
              <div className="text-sm space-y-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{order.quantity} item(s)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="font-bold text-lg text-brand">
                    {new Intl.NumberFormat('en-NP', {
                      style: 'currency',
                      currency: 'NPR',
                      maximumFractionDigits: 0,
                    }).format(order.total_price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Item Details with Image */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Product Ordered
            </h4>
            <div className="flex gap-4 border border-gray-100 p-3 rounded-lg items-start hover:bg-gray-50 transition-colors">
              {/* Image Container */}
              <div className="w-16 h-16 bg-gray-100 rounded-md shrink-0 border border-gray-200 flex items-center justify-center overflow-hidden">
                {order.product ? (
                  <Image
                    width={500}
                    height={500}
                    src={order.product?.productImages[0].url}
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="text-gray-400 w-8 h-8" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{order.product?.name}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                  {order.size && (
                    <span className="bg-white border px-2 py-0.5 rounded shadow-sm">
                      Size: <span className="font-medium text-gray-900">{order.size}</span>
                    </span>
                  )}
                  {order.color && (
                    <span className="flex items-center gap-1.5 bg-white border px-2 py-0.5 rounded shadow-sm">
                      Color:
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ background: order.color }}
                      />
                      <span className="font-medium text-gray-900 capitalize">{order.color}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
