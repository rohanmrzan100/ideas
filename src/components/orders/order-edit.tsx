'use client';

import { City, getCities, getZones, Order, OrderStatus, updateOrder, Zone } from '@/api/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  Save,
  Trash2,
  Truck,
  User,
  Phone,
  Home,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

// --- Types ---

type OrderItem = {
  color: string;
  size: string;
  quantity: number;
};

type OrderFormValues = {
  recipient_name: string;
  recipient_phone: string;
  recipient_city: string;
  recipient_zone: string;
  recipient_address: string;
  amount_to_collect: number;
  status: OrderStatus;
  items: OrderItem[];
};

interface EditOrderFormProps {
  order: Order;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditOrderForm({ order, onCancel, onSuccess }: EditOrderFormProps) {
  const queryClient = useQueryClient();

  // --- 1. Helper: Parse existing description string into objects ---
  const parseItems = (description: string): OrderItem[] => {
    if (!description) return [];
    try {
      return description
        .split(',')
        .map((item) => {
          const match = item.trim().match(/(\d+)x\s*([^/]+)\/(.+)/);
          if (match) {
            return {
              quantity: parseInt(match[1], 10),
              color: match[2].trim(),
              size: match[3].trim(),
            };
          }
          return null;
        })
        .filter(Boolean) as OrderItem[];
    } catch {
      return [];
    }
  };

  // --- 2. Form Setup ---
  const { register, handleSubmit, control, watch, reset, setValue } = useForm<OrderFormValues>({
    defaultValues: {
      recipient_name: order.recipient_name || '',
      recipient_phone: order.recipient_phone || '',
      recipient_city: String(order.recipient_city || ''),
      recipient_zone: String(order.recipient_zone || ''),
      recipient_address: order.recipient_address || '',
      amount_to_collect: Number(order.amount_to_collect || 0),
      status: (order.status as OrderStatus) || OrderStatus.PENDING,
      items: parseItems(order.item_description || ''),
    },
  });

  const items = watch('items') || [];
  const selectedCityId = watch('recipient_city');
  const pricePerItem = Number(order.product?.price || 0);

  // --- 3. Selection State for New Items ---
  const [currentSelection, setCurrentSelection] = useState<OrderItem>({
    color: '',
    size: '',
    quantity: 1,
  });

  const availableVariants = order.product?.productImages || [];
  const availableSizes = Array.from(
    new Set(
      order.product?.product_variants?.map((v) => v.size) || ['Free Size', 'S', 'M', 'L', 'XL'],
    ),
  );

  const handleAddItem = () => {
    if (!currentSelection.color || !currentSelection.size) {
      toast.error('Please select both a color and a size');
      return;
    }
    const newItems = [...items, { ...currentSelection }];
    setValue('items', newItems);

    // Auto-update total price
    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * pricePerItem, 0);
    setValue('amount_to_collect', newTotal);

    // Reset selection (keep color for convenience, reset qty)
    setCurrentSelection((prev) => ({ ...prev, size: '', quantity: 1 }));
    toast.success('Item added');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue('items', newItems);

    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * pricePerItem, 0);
    setValue('amount_to_collect', newTotal);
    toast.success('Item removed');
  };

  // --- 4. Data Fetching (Locations) ---
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const data = await getCities();
      return Array.isArray(data) ? data : [];
    },
  });

  const { data: zones = [] } = useQuery({
    queryKey: ['zones', selectedCityId],
    queryFn: async () => {
      if (!selectedCityId) return [];
      const data = await getZones(Number(selectedCityId));
      return Array.isArray(data) ? data : [];
    },
    enabled: !!selectedCityId,
  });

  // --- 5. Mutation ---
  const updateMutation = useMutation({
    mutationFn: (data: OrderFormValues) => {
      const itemDescription = data.items
        .map((item) => `${item.quantity}x ${item.color}/${item.size}`)
        .join(', ');

      const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);

      return updateOrder(order.id, {
        recipient_name: data.recipient_name,
        recipient_phone: data.recipient_phone,
        recipient_city: Number(data.recipient_city),
        recipient_zone: Number(data.recipient_zone),
        recipient_address: data.recipient_address,
        amount_to_collect: Number(data.amount_to_collect),
        item_quantity: totalQuantity,
        status: data.status,
        item_description: itemDescription,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
      toast.success('Order Updated Successfully!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update order');
    },
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header (Sticky) */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20 shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h2 className="text-base font-bold text-gray-900">Edit Order</h2>
              <p className="text-[10px] text-gray-500">#{order.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <Button
            onClick={handleSubmit((data) => updateMutation.mutate(data))}
            disabled={updateMutation.isPending}
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 gap-1.5"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Truck size={14} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Order Status</h3>
          </div>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <User size={14} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Customer Details</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <User size={10} />
                Full Name
              </label>
              <Input
                {...register('recipient_name', { required: true })}
                className="bg-gray-50 border-gray-200 h-10"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Phone size={10} />
                Phone Number
              </label>
              <Input
                {...register('recipient_phone', { required: true })}
                className="bg-gray-50 border-gray-200 h-10"
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        {/* Delivery Location */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
              <MapPin size={14} className="text-green-600" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Delivery Location</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  City
                </label>
                <Controller
                  control={control}
                  name="recipient_city"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 h-10">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city: City) => (
                          <SelectItem key={city.city_id} value={String(city.city_id)}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                  Zone
                </label>
                <Controller
                  control={control}
                  name="recipient_zone"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCityId}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 h-10 disabled:opacity-50">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone: Zone) => (
                          <SelectItem key={zone.zone_id} value={String(zone.zone_id)}>
                            {zone.zone_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Home size={10} />
                Full Address
              </label>
              <Input
                {...register('recipient_address')}
                className="bg-gray-50 border-gray-200 h-10"
                placeholder="Street address, building, landmarks..."
              />
            </div>
          </div>
        </div>

        {/* Items & Payment */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <Package size={14} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Order Items</h3>
            </div>
            {items.length > 0 && (
              <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </div>
            )}
          </div>

          {/* Add Item Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 mb-3">
            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-2 flex items-center gap-1">
              <Plus size={10} />
              Add New Item
            </label>

            {/* Colors */}
            <div className="mb-2">
              <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1.5">
                Select Color
              </p>
              <div className="flex flex-wrap gap-1.5">
                {availableVariants.length > 0 ? (
                  availableVariants.map((v) => {
                    const isSelected = currentSelection.color === v.color;
                    return (
                      <button
                        key={v.id || v.color}
                        type="button"
                        onClick={() =>
                          setCurrentSelection((prev) => ({ ...prev, color: v.color || '' }))
                        }
                        className={cn(
                          'w-12 h-12 rounded-lg border-2 overflow-hidden relative transition-all hover:scale-105',
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                            : 'border-gray-300 hover:border-gray-400',
                        )}
                        title={v.color}
                      >
                        <Image src={v.url} alt={v.color || ''} fill className="object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <Check size={12} className="text-blue-600" strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic">No variants available</p>
                )}
              </div>
            </div>

            {/* Size, Qty & Add Button */}
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">Size</p>
                <Select
                  value={currentSelection.size}
                  onValueChange={(val) => setCurrentSelection((prev) => ({ ...prev, size: val }))}
                >
                  <SelectTrigger className="bg-white border-gray-300 h-9 text-xs">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-24">
                <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">Quantity</p>
                <div className="flex items-center h-9 bg-white border border-gray-300 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSelection((prev) => ({
                        ...prev,
                        quantity: Math.max(1, prev.quantity - 1),
                      }))
                    }
                    className="px-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 h-full transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="flex-1 text-center text-xs font-bold">
                    {currentSelection.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSelection((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
                    }
                    className="px-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 h-full transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 gap-1 shadow-sm"
                >
                  <Plus size={12} />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {items.length > 0 ? (
              items.map((item, index) => {
                const itemSubtotal = item.quantity * pricePerItem;
                return (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-2.5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden relative flex items-center justify-center group-hover:border-blue-300 transition-colors">
                        {(() => {
                          const img = availableVariants.find((v) => v.color === item.color)?.url;
                          return img ? (
                            <Image src={img} alt={item.color} fill className="object-cover" />
                          ) : (
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: item.color }}
                            />
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {item.color} • {item.size}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {item.quantity} × Rs. {pricePerItem.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">
                          Rs. {itemSubtotal.toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">No items added yet</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Add items using the form above</p>
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 shadow-lg">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Total Amount to Collect
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Rs.</span>
              <Input
                type="number"
                {...register('amount_to_collect')}
                className="h-10 text-lg font-bold bg-gray-800 border-gray-700 text-white flex-1"
                placeholder="0"
              />
            </div>
            {items.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Calculated total: Rs.{' '}
                {items
                  .reduce((sum, item) => sum + item.quantity * pricePerItem, 0)
                  .toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
