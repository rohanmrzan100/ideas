'use client';

import { ProductFormValues } from '@/app/dashboard/product/page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LayoutGrid, Tag } from 'lucide-react';
import { Control, Controller, FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';

type BasicDetailsProps = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
};

export default function BasicDetails({ register, errors, control, watch }: BasicDetailsProps) {
  const priceValue = watch('price');
  const displayPriceValue = watch('display_price');

  const price = priceValue ? Number(priceValue) : 0;
  const displayPrice = displayPriceValue ? Number(displayPriceValue) : 0;

  const discountPercent =
    price > 0 && displayPrice > price
      ? Math.round(((displayPrice - price) / displayPrice) * 100)
      : 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
          <Tag size={16} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Basic Details</h2>
      </div>

      <div className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Product Name</label>
          <input
            {...register('name', { required: 'Product name is required' })}
            placeholder="e.g., Winter Puffer Jacket"
            className={`w-full px-4 h-10 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none text-sm ${
              errors.name ? 'border-red-300 bg-red-50' : ''
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            placeholder="Describe materials, fit, and key features..."
            className={`w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none resize-none text-sm ${
              errors.description ? 'border-red-300 bg-red-50' : ''
            }`}
          />
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Selling Price */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Selling Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                Rs.
              </span>
              <input
                type="number"
                inputMode="numeric"
                {...register('price', { required: true, min: 1 })}
                className="w-full pl-9 pr-4 h-10 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none text-sm"
              />
            </div>
          </div>

          {/* Display Price */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Display Price <span className="text-gray-400">(Optional)</span>
              </label>

              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                Rs.
              </span>
              <input
                type="number"
                inputMode="numeric"
                {...register('display_price')}
                className="w-full pl-9 pr-4 h-10 rounded-lg bg-white border border-gray-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Category</label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <LayoutGrid size={14} />
                      <SelectValue placeholder="Select a category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing & Apparel</SelectItem>
                    <SelectItem disabled value="electronics">
                      Electronics
                    </SelectItem>
                    <SelectItem disabled value="home">
                      Home & Living
                    </SelectItem>
                    <SelectItem disabled value="beauty">
                      Beauty & Health
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
