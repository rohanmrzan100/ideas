import { Order } from '@/api/orders';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar, MapPin, Package, User, Receipt, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { OrderStatusBadge } from './order-status-badge';

interface ViewOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function ViewOrderDialog({ order, open, onOpenChange }: ViewOrderDialogProps) {
  if (!order) return null;

  const hasMultipleItems = order.items && order.items.length > 1;

  const findImageForColor = (colorName: string) => {
    if (!order.product?.productImages) return '';
    const exact = order.product.productImages.find(
      (img) => img.color?.toLowerCase() === colorName.toLowerCase(),
    );
    if (exact) return exact.url;
    return order.product.productImages[0]?.url || order.product.image || '';
  };

  // Logic: Use the first item's color for the main image, or default product image
  const heroImage =
    order.items && order.items.length > 0
      ? findImageForColor(order.items[0].color)
      : order.product?.image || '';

  const unitPrice = order.product?.price || 0;
  const itemTotal = unitPrice * order.quantity;
  const grandTotal = order.total_price;
  const additionalFees = grandTotal - itemTotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" bg-white p-0 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Order #{order.id.slice(-6).toUpperCase()}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1.5 text-sm">
              <Calendar size={14} />
              {format(new Date(order.created_at), 'PPP')} at{' '}
              {format(new Date(order.created_at), 'p')}
            </DialogDescription>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="p-8 grid gap-8">
          {/* SECTION 1: PRODUCT DETAILS (Large Image) */}
          {/* Moved to top for visual hierarchy */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="flex flex-col md:flex-row items-start">
              {/* LARGE IMAGE: 300px x 300px */}
              <div className="w-full  h-[300px] bg-gray-100 border-r border-gray-100 shrink-0 relative flex items-center justify-center">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="Product Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <Package className="text-gray-400 w-20 h-20" />
                )}
              </div>

              {/* Product Info Column */}
              <div className="flex-1 p-8 min-w-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {order.product?.name}
                    </h3>
                  </div>
                  <span className="text-lg font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    {formatCurrency(unitPrice)}{' '}
                    <span className="text-sm font-normal text-gray-500">/ unit</span>
                  </span>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Ordered Variants ({order.items?.length || 0})
                  </h4>

                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-3">
                      {order.items.map((item, idx) => {
                        const itemImg = findImageForColor(item.color);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {/* Thumbnail for list items */}
                              <div className="w-14 h-14 bg-white rounded-lg border border-gray-200 shrink-0 overflow-hidden relative shadow-sm">
                                {itemImg ? (
                                  <Image
                                    src={itemImg}
                                    alt={item.color}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full"
                                    style={{ background: item.color }}
                                  />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                    style={{ background: item.color }}
                                  />
                                  {!item.color.startsWith('#') && (
                                    <span className="font-semibold text-gray-900">
                                      {item.color}
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Size:{' '}
                                  <span className="font-medium text-gray-900">{item.size}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                              x {item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No specific variants selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: INFO GRID (Customer, Location, Payment) */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Customer */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Customer
              </h4>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-full">
                <p className="font-bold text-lg text-gray-900">{order.customer_name}</p>
                <a
                  href={`tel:${order.customer_phone}`}
                  className="text-brand hover:underline font-medium block mt-1"
                >
                  {order.customer_phone}
                </a>
              </div>
            </div>

            {/* Delivery */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} /> Delivery Address
              </h4>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-full flex items-start gap-3">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {formatFullAddress(order)}
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Receipt size={14} /> Payment Summary
              </h4>
              <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 space-y-3 h-full flex flex-col justify-center">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Subtotal <span className="text-xs opacity-70">({order.quantity} items)</span>
                  </span>
                  <span className="font-medium">{formatCurrency(itemTotal)}</span>
                </div>

                {additionalFees !== 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{additionalFees > 0 ? 'Fees' : 'Discount'}</span>
                    <span className={additionalFees > 0 ? 'text-gray-900' : 'text-green-600'}>
                      {additionalFees > 0 ? '+' : ''}
                      {formatCurrency(additionalFees)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 my-1" />

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-wide">
                      <CreditCard size={10} /> {order.payment_method}
                    </span>
                  </div>
                  <span className="font-extrabold text-xl text-brand">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
