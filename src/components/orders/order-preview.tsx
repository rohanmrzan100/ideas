import { Order } from '@/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CreditCard, Edit2, MapPin, Package, User } from 'lucide-react';
import Image from 'next/image';
import { OrderStatusBadge } from './order-status-badge';

interface OrderPreviewProps {
  order: Order;
  onEdit: () => void;
}

export function OrderPreview({ order, onEdit }: OrderPreviewProps) {
  // Helper to find specific image for a variant color
  const findImageForColor = (colorName: string) => {
    if (!order.product?.productImages) return '';

    // Try to find an exact color match (case insensitive)
    const exact = order.product.productImages.find(
      (img) => img.color?.toLowerCase() === colorName.toLowerCase(),
    );

    if (exact) return exact.url;

    // Fallback: If no specific color image, use the main product image or the first one
    return order.product.productImages[0]?.url || order.product.image || '';
  };

  // Determine the main "Hero" image (uses the first item's color, or default)
  const mainHeroImage =
    order.items && order.items.length > 0
      ? findImageForColor(order.items[0].color)
      : order.product?.image || '';

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 pb-32">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Order #{order.id.slice(-6).toUpperCase()}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Placed on {format(new Date(order.created_at), 'PPP p')}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onEdit} className="gap-2 w-full sm:w-auto">
          <Edit2 size={14} /> Edit Order
        </Button>
      </div>

      {/* --- Status Banner --- */}
      <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-sm font-semibold text-gray-600">Current Status</span>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* --- Product Hero Card --- */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl shadow-sm bg-white">
        {/* Large Hero Image */}
        <div className="w-full sm:w-24 h-48 sm:h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative shrink-0">
          {mainHeroImage ? (
            <Image src={mainHeroImage} alt="Product Hero" fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <Package size={24} />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 py-1 space-y-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {order.product?.name}
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs font-medium w-fit">
            Rs. {order.product?.price.toLocaleString()} / unit
          </Badge>
        </div>
      </div>

      {/* --- Order Items List (The key part for showing both images) --- */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Order Items ({order.items.length})
        </h4>

        <div className="space-y-3">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => {
              // DYNAMIC IMAGE LOGIC: Find image specifically for THIS item's color
              const variantImage = findImageForColor(item.color);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Variant Thumbnail */}
                    <div className="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative shrink-0">
                      {variantImage ? (
                        <Image src={variantImage} alt={item.color} fill className="object-cover" />
                      ) : (
                        // Fallback: Show a color swatch if no image exists
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: item.color.toLowerCase() !== '-' ? item.color : '#eee',
                          }}
                        />
                      )}
                    </div>

                    {/* Variant Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {/* Tiny Color Dot */}
                        <span
                          className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                          style={{
                            backgroundColor:
                              item.color.toLowerCase() !== '-' ? item.color : 'transparent',
                          }}
                        />
                        <span className="font-bold text-gray-900 capitalize">{item.color}</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-bold text-gray-900">{item.size}</span>
                      </div>
                      {/* SKU or other details could go here */}
                    </div>
                  </div>

                  {/* Quantity Badge */}
                  <span className="text-sm font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 min-w-[3rem] text-center">
                    x {item.quantity}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 italic">No detailed items found.</p>
          )}
        </div>
      </div>

      <Separator />

      {/* --- Customer & Delivery Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Card */}
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <User size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Customer</span>
          </div>
          <div>
            <p className="font-bold text-lg text-gray-900">{order.customer_name}</p>
            <a
              href={`tel:${order.customer_phone}`}
              className="text-brand font-medium hover:underline block mt-1"
            >
              {order.customer_phone}
            </a>
          </div>
        </div>

        {/* Delivery Card */}
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <MapPin size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Delivery</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 leading-snug">{order.customer_location}</p>
            <p className="text-sm text-gray-500 mt-1">{order.customer_district}</p>
          </div>
        </div>
      </div>

      {/* --- Payment Footer --- */}
      <div className="rounded-xl bg-gray-900 text-white overflow-hidden shadow-lg mt-auto">
        <div className="p-5 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2 text-gray-400">
            <CreditCard size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Payment Method</span>
          </div>
          <span className="font-bold text-sm uppercase">{order.payment_method}</span>
        </div>
        <div className="p-5 flex justify-between items-center bg-gray-950/50">
          <span className="font-medium text-lg text-gray-300">Total Amount</span>
          <span className="font-extrabold text-2xl text-white">
            Rs. {order.total_price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
