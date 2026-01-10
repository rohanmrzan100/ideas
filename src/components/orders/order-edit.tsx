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
import { ArrowLeft, Loader2, Minus, Plus, Save, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

  const { register, handleSubmit, control, watch, setValue } = useForm<OrderFormValues>({
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

  const [currentSelection, setCurrentSelection] = useState<OrderItem>({
    color: '',
    size: '',
    quantity: 1,
  });

  // FIX: Derive available colors from Variants, not just Images
  const availableVariants = order.product?.product_variants || [];
  const uniqueColors = Array.from(new Set(availableVariants.map((v) => v.color)));

  const availableSizes = Array.from(
    new Set(
      order.product?.product_variants?.map((v) => v.size) || ['Free Size', 'S', 'M', 'L', 'XL'],
    ),
  );

  const getImageForColor = (color: string) => {
    return order.product?.productImages?.find((img) => img.color === color)?.url;
  };

  const handleAddItem = () => {
    if (!currentSelection.color || !currentSelection.size) {
      toast.error('Please select both a color and a size');
      return;
    }
    const newItems = [...items, { ...currentSelection }];
    setValue('items', newItems);

    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * pricePerItem, 0);
    setValue('amount_to_collect', newTotal);

    setCurrentSelection((prev) => ({ ...prev, size: '', quantity: 1 }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue('items', newItems);

    const newTotal = newItems.reduce((sum, item) => sum + item.quantity * pricePerItem, 0);
    setValue('amount_to_collect', newTotal);
  };

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
      console.log(err);
      toast.error('Failed to update order');
    },
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-linear-to-br from-gray-50 to-gray-100">
      <div className="px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onCancel}>
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

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Full Name</label>
            <Input {...register('recipient_name')} className="h-10 mt-1" />
            <label className="text-[10px] font-bold text-gray-600 uppercase mt-2">Phone</label>
            <Input {...register('recipient_phone')} className="h-10 mt-1" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <label className="text-[10px] font-bold text-gray-600 uppercase">City</label>
            <Controller
              control={control}
              name="recipient_city"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10 mt-1">
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
            <label className="text-[10px] font-bold text-gray-600 uppercase mt-2">Zone</label>
            <Controller
              control={control}
              name="recipient_zone"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCityId}
                >
                  <SelectTrigger className="h-10 mt-1">
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
            <label className="text-[10px] font-bold text-gray-600 uppercase mt-2">Address</label>
            <Input {...register('recipient_address')} className="h-10 mt-1" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Order Items</h3>
            {items.length > 0 && (
              <span className="text-xs text-blue-600 font-semibold">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 mb-3">
            <p className="text-[9px] font-bold uppercase mb-1">Color</p>
            <div className="flex gap-1 flex-wrap">
              {uniqueColors.map((color) => {
                const selected = currentSelection.color === color;
                const imgUrl = getImageForColor(color);

                return (
                  <button
                    key={color}
                    onClick={() => setCurrentSelection((prev) => ({ ...prev, color }))}
                    className={cn(
                      'w-12 h-12 rounded-md border overflow-hidden relative transition-all',
                      selected ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-300',
                    )}
                    title={color}
                  >
                    {imgUrl ? (
                      <Image src={imgUrl} alt={color} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 mt-2">
              <Select
                value={currentSelection.size}
                onValueChange={(val) => setCurrentSelection((prev) => ({ ...prev, size: val }))}
              >
                <SelectTrigger className="h-9 text-xs">
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

              <div className="w-20 flex items-center border border-gray-300 rounded-md h-9">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSelection((prev) => ({
                      ...prev,
                      quantity: Math.max(1, prev.quantity - 1),
                    }))
                  }
                  className="px-2 text-gray-500 hover:text-blue-600"
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
                  className="px-2 text-gray-500 hover:text-blue-600"
                >
                  <Plus size={12} />
                </button>
              </div>

              <Button
                onClick={handleAddItem}
                size="sm"
                className="bg-blue-600 text-white h-9 gap-1"
              >
                <Plus size={12} /> Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {items.length > 0 ? (
              items.map((item, index) => {
                const itemSubtotal = item.quantity * pricePerItem;
                const img = getImageForColor(item.color);
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2.5 border rounded-lg bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-11 h-11 rounded-lg border overflow-hidden relative">
                        {img ? (
                          <Image src={img} alt={item.color} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: item.color }} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold">
                          {item.color} • {item.size}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {item.quantity} × Rs. {pricePerItem.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">Rs. {itemSubtotal.toLocaleString()}</p>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs text-gray-500 font-medium">No items added yet</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-3 mt-3">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
              Total Amount
            </label>
            <Input
              type="number"
              {...register('amount_to_collect')}
              className="h-10 text-white text-lg font-bold bg-gray-800 border-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
