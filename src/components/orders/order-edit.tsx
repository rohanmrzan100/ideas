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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, MapPin, Package, Save, User } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

type OrderFormValues = {
  recipient_name: string;
  recipient_phone: string;
  recipient_city: string;
  recipient_zone: string;
  recipient_address: string;
  amount_to_collect: number;
  item_quantity: number;
  status: OrderStatus;
  item_description: string;
};

interface OrderEditFormProps {
  order: Order;
  onCancel: () => void;
  onSuccess: () => void;
}

export function OrderEditForm({ order, onCancel, onSuccess }: OrderEditFormProps) {
  const queryClient = useQueryClient();

  // --- Form Setup ---
  const { register, handleSubmit, control, watch } = useForm<OrderFormValues>({
    defaultValues: {
      recipient_name: order.customer_name,
      recipient_phone: order.customer_phone,
      recipient_city: String(order.recipient_city),
      recipient_zone: String(order.recipient_zone),
      recipient_address: order.customer_location,
      amount_to_collect: order.total_price,
      item_quantity: order.quantity,
      status: order.status,
      item_description: order.item_description,
    },
  });

  const selectedCityId = watch('recipient_city');

  // --- Data Fetching ---
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

  // --- Mutation ---
  const updateMutation = useMutation({
    mutationFn: (data: OrderFormValues) =>
      updateOrder(order.id, {
        ...data,
        recipient_city: Number(data.recipient_city),
        recipient_zone: Number(data.recipient_zone),
        amount_to_collect: Number(data.amount_to_collect),
        item_quantity: Number(data.item_quantity),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      onSuccess();
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const onSave = (data: OrderFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-3 sticky top-0 z-10">
        <Button size="icon" variant="ghost" onClick={onCancel}>
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-lg font-bold">Edit Order</h2>
      </div>

      {/* Scrollable Form Content */}
      <form
        id="edit-order-form"
        onSubmit={handleSubmit(onSave)}
        className="flex-1 overflow-y-auto p-6 space-y-8 pb-32"
      >
        {/* Status */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Order Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-white h-11 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                  <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                  <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                  <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Customer Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <User size={16} className="text-brand" />
            <h3 className="text-sm font-bold text-gray-900">Customer Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Full Name</label>
              <Input
                {...register('recipient_name', { required: true })}
                className="bg-white border-gray-200 h-11"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Phone</label>
              <Input
                {...register('recipient_phone', { required: true })}
                className="bg-white border-gray-200 h-11"
              />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <MapPin size={16} className="text-brand" />
            <h3 className="text-sm font-bold text-gray-900">Delivery Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">City</label>
              <Controller
                control={control}
                name="recipient_city"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white border-gray-200 h-11">
                      <SelectValue placeholder="Select City" />
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
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Zone</label>
              <Controller
                control={control}
                name="recipient_zone"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCityId}
                  >
                    <SelectTrigger className="bg-white border-gray-200 h-11">
                      <SelectValue placeholder="Select Zone" />
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Detailed Address</label>
            <Input
              {...register('recipient_address')}
              className="bg-white border-gray-200 h-11"
              placeholder="Street, landmark..."
            />
          </div>
        </div>

        {/* Items & Payment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Package size={16} className="text-brand" />
            <h3 className="text-sm font-bold text-gray-900">Items & Payment</h3>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-blue-700">
            Format: <span className="font-mono">1x Red/XL, 2x Blue/M</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Item Description</label>
            <Input
              {...register('item_description')}
              className="bg-white border-gray-200 h-11 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Total Qty</label>
              <Input
                type="number"
                {...register('item_quantity')}
                className="bg-white border-gray-200 h-11"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Amount (Rs)</label>
              <Input
                type="number"
                {...register('amount_to_collect')}
                className="bg-white border-gray-200 h-11 font-bold"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex items-center gap-3 z-20">
        <Button variant="outline" className="flex-1 h-12" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button
          className="flex-1 bg-brand text-white hover:bg-brand-primary/90 h-12 shadow-lg shadow-brand/20"
          type="submit"
          form="edit-order-form"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
