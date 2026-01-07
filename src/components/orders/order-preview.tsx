import { Order } from '@/api/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  CreditCard,
  Edit2,
  MapPin,
  Package,
  Printer,
  User,
  Calendar,
  Phone,
  Home,
} from 'lucide-react';
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
  // Parsing Logic
  const items: ParsedItem[] = (() => {
    if (!order.item_description) return [];
    try {
      const parsed = order.item_description
        .split(',')
        .map((part) => {
          const match = part.trim().match(/(\d+)x\s*([^/]+)\/(.+)/);
          if (match)
            return {
              quantity: parseInt(match[1], 10),
              color: match[2].trim(),
              size: match[3].trim(),
            };
          return null;
        })
        .filter((item): item is ParsedItem => item !== null);
      return parsed.length > 0 ? parsed : [];
    } catch {
      return [];
    }
  })();

  const findImageForColor = (colorName: string) => {
    if (!order.product?.productImages) return '';
    const exact = order.product.productImages.find(
      (img) => img.color?.toLowerCase() === colorName.toLowerCase(),
    );
    return exact ? exact.url : order.product.productImages[0]?.url || '';
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const handlePrint = () => {
    window.print();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 print:bg-white">
      <div className="max-w-4xl mx-auto p-3 md:p-4 space-y-4 pb-20 print:p-0 print:space-y-4 print:pb-0">
        {/* Header Section - Enhanced */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 print:shadow-none print:border-none">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg print:hidden">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Calendar className="w-3 h-3 print:hidden" />
                    <span>{format(new Date(order.created_at), 'PPP, p')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="gap-1.5 flex-1 sm:flex-none hover:bg-gray-50 transition-colors"
              >
                <Printer size={14} /> Print
              </Button>
              <Button
                size="sm"
                onClick={onEdit}
                className="gap-1.5 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit2 size={14} /> Edit
              </Button>
            </div>
          </div>

          {/* Status Banner - Improved */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 print:hidden">
            <span className="text-xs font-semibold text-gray-700">Order Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center border-b-2 pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">ORDER RECEIPT</h1>
          <p className="text-lg">Order #{order.id}</p>
          <p className="text-sm text-gray-600">{format(new Date(order.created_at), 'PPP')}</p>
        </div>

        {/* Order Items - Enhanced Card Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 print:shadow-none print:border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Order Items</h3>
            <Badge variant="secondary" className="text-xs font-semibold">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item, idx) => {
                const variantImage = findImageForColor(item.color);
                const itemTotal = Number(order.product.price) * item.quantity;

                return (
                  <div
                    key={idx}
                    className="group relative flex items-center gap-3 p-3 rounded-lg border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:border-blue-200 hover:shadow-sm transition-all duration-200 print:border print:shadow-none print:bg-white"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden shrink-0 group-hover:border-blue-300 transition-colors">
                      <Image src={variantImage} alt={item.color} fill className="object-cover" />
                      <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-700 print:hidden">
                        {item.color}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-gray-500 uppercase">
                              Color:
                            </span>
                            <span className="text-xs font-semibold text-gray-900">
                              {item.color}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-gray-500 uppercase">
                              Size:
                            </span>
                            <span className="text-xs font-semibold text-gray-900">{item.size}</span>
                          </div>
                        </div>

                        {/* Quantity Badge */}
                        <div className="bg-blue-50 border-2 border-blue-200 px-2.5 py-1 rounded-md print:bg-transparent print:border-black shrink-0">
                          <span className="text-[10px] font-medium text-gray-600 print:text-black">
                            Qty
                          </span>
                          <span className="ml-1.5 text-sm font-bold text-blue-600 print:text-black">
                            {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                        <span className="text-xs text-gray-600">
                          {formatCurrency(order.product.price)} × {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                <Package className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                <p className="text-xs text-gray-600">
                  {order.item_description || 'No items in this order'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer & Delivery Info Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
          {/* Customer Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 print:shadow-none print:border">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-purple-50 rounded-lg print:hidden">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Customer Details
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 print:hidden" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Name</p>
                  <p className="font-bold text-base text-gray-900">{order.recipient_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 mt-0.5 print:hidden" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Phone</p>
                  <p className="font-semibold text-sm text-gray-700">{order.recipient_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 print:shadow-none print:border">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-green-50 rounded-lg print:hidden">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Delivery Address
              </h3>
            </div>
            <div className="flex items-start gap-2">
              <Home className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0 print:hidden" />
              <p className="font-medium text-sm text-gray-700 leading-relaxed">
                {order.recipient_address}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary - Enhanced */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden print:bg-white print:border-2 print:border-black print:shadow-none">
          <div className="p-4 space-y-3">
            {/* Payment Method */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-700 print:border-gray-300">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-800 rounded-lg print:hidden">
                  <CreditCard className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider print:text-black">
                  Payment Method
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-500 text-white font-bold text-xs print:bg-transparent print:text-black print:border print:border-black"
              >
                Cash on Delivery
              </Badge>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 print:bg-transparent print:border-t-2 print:border-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5 print:text-gray-600">
                    Total Amount
                  </p>
                  <p className="text-3xl font-extrabold text-white print:text-black">
                    {formatCurrency(order.amount_to_collect)}
                  </p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg print:hidden">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
